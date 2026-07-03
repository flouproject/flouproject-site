import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "../../../lib/supabase";

const MIDTRANS_IS_PRODUCTION = process.env.MIDTRANS_IS_PRODUCTION === "true";
const MIDTRANS_SNAP_URL = MIDTRANS_IS_PRODUCTION
  ? "https://app.midtrans.com/snap/v1/transactions"
  : "https://app.sandbox.midtrans.com/snap/v1/transactions";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, whatsapp, address, items } = body;

    if (!name || !email || !whatsapp || !address || !items || items.length === 0) {
      return NextResponse.json({ error: "Data pesanan tidak lengkap." }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();

    // --- Validasi ulang harga & stok dari database (jangan percaya harga dari client) ---
    const productIds = items.map((i) => i.id);
    const { data: products, error: productError } = await supabase
      .from("products")
      .select("*")
      .in("id", productIds);

    if (productError) throw productError;

    let amount = 0;
    const verifiedItems = [];

    for (const cartItem of items) {
      const product = products.find((p) => p.id === cartItem.id);
      if (!product || !product.is_active) {
        return NextResponse.json(
          { error: `Produk "${cartItem.name}" tidak tersedia lagi.` },
          { status: 409 }
        );
      }
      if (product.stock < cartItem.qty) {
        return NextResponse.json(
          { error: `Stok "${product.name}" tidak cukup (sisa ${product.stock}).` },
          { status: 409 }
        );
      }
      amount += product.price * cartItem.qty;
      verifiedItems.push({
        product_id: product.id,
        name: product.name,
        price: product.price,
        qty: cartItem.qty,
      });
    }

    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const { data: inserted, error: insertError } = await supabase
      .from("orders")
      .insert({
        customer_name: name,
        email,
        whatsapp,
        address,
        items: verifiedItems,
        amount,
        payment_status: "pending",
        midtrans_order_id: orderId,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    if (!serverKey) {
      return NextResponse.json(
        { error: "MIDTRANS_SERVER_KEY belum diset." },
        { status: 500 }
      );
    }
    const authHeader = "Basic " + Buffer.from(`${serverKey}:`).toString("base64");

    const midtransRes = await fetch(MIDTRANS_SNAP_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({
        transaction_details: { order_id: orderId, gross_amount: amount },
        customer_details: { first_name: name, email, phone: whatsapp },
        item_details: verifiedItems.map((i) => ({
          id: i.product_id,
          price: i.price,
          quantity: i.qty,
          name: i.name,
        })),
      }),
    });

    const midtransData = await midtransRes.json();

    if (!midtransRes.ok) {
      await supabase.from("orders").update({ payment_status: "failed" }).eq("id", inserted.id);
      return NextResponse.json(
        { error: midtransData.error_messages?.join(", ") || "Gagal membuat transaksi." },
        { status: 500 }
      );
    }

    return NextResponse.json({ snapToken: midtransData.token, orderId });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}
