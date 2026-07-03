import { NextResponse } from "next/server";
import crypto from "crypto";
import { getSupabaseServerClient } from "../../../lib/supabase";

// URL ini yang perlu didaftarkan di:
// Midtrans Dashboard > Settings > Configuration > Payment Notification URL
// Contoh: https://domainkamu.vercel.app/api/webhook
// Route ini menangani DUA jenis transaksi sekaligus, dibedakan dari awalan order_id:
//   "WS-"  -> pendaftaran workshop (tabel registrations)
//   "ORD-" -> pesanan produk (tabel orders)

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      transaction_id,
      fraud_status,
    } = body;

    const serverKey = process.env.MIDTRANS_SERVER_KEY;

    const expectedSignature = crypto
      .createHash("sha512")
      .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
      .digest("hex");

    if (expectedSignature !== signature_key) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    let newStatus = "pending";
    if (transaction_status === "capture") {
      newStatus = fraud_status === "accept" ? "paid" : "pending";
    } else if (transaction_status === "settlement") {
      newStatus = "paid";
    } else if (["deny", "cancel", "expire"].includes(transaction_status)) {
      newStatus = "failed";
    } else if (transaction_status === "pending") {
      newStatus = "pending";
    }

    const supabase = getSupabaseServerClient();

    if (order_id.startsWith("ORD-")) {
      // --- Pesanan produk ---
      const { data: order, error: fetchError } = await supabase
        .from("orders")
        .select("*")
        .eq("midtrans_order_id", order_id)
        .single();
      if (fetchError) throw fetchError;

      const wasAlreadyPaid = order.payment_status === "paid";

      const { error: updateError } = await supabase
        .from("orders")
        .update({ payment_status: newStatus, midtrans_transaction_id: transaction_id })
        .eq("midtrans_order_id", order_id);
      if (updateError) throw updateError;

      // Kurangi stok hanya sekali, saat status BERUBAH menjadi paid
      if (newStatus === "paid" && !wasAlreadyPaid) {
        for (const item of order.items) {
          const { data: product } = await supabase
            .from("products")
            .select("stock")
            .eq("id", item.product_id)
            .single();
          if (product) {
            await supabase
              .from("products")
              .update({ stock: Math.max(0, product.stock - item.qty) })
              .eq("id", item.product_id);
          }
        }
      }
    } else {
      // --- Pendaftaran workshop (default, order_id "WS-...") ---
      const { error } = await supabase
        .from("registrations")
        .update({ payment_status: newStatus, midtrans_transaction_id: transaction_id })
        .eq("midtrans_order_id", order_id);
      if (error) throw error;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
