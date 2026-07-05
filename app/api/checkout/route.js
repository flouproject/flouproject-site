import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "../../../lib/supabase";

// CATATAN: sementara pembayaran otomatis via Midtrans belum aktif
// (masih menunggu proses approval merchant), alur ini memakai
// transfer manual + konfirmasi WhatsApp, sama seperti /api/register.
// Setelah Midtrans approve, tinggal aktifkan lagi pemanggilan Snap API di sini.

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
        payment_status: "pending_manual_transfer",
        midtrans_order_id: orderId,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return NextResponse.json({ orderId, amount });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: `Terjadi kesalahan pada server: ${err.message || err}` },
      { status: 500 }
    );
  }
}
