import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "../../../lib/supabase";
import { getTierById } from "../../../lib/tickets";

const MIDTRANS_IS_PRODUCTION = process.env.MIDTRANS_IS_PRODUCTION === "true";
const MIDTRANS_SNAP_URL = MIDTRANS_IS_PRODUCTION
  ? "https://app.midtrans.com/snap/v1/transactions"
  : "https://app.sandbox.midtrans.com/snap/v1/transactions";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, whatsapp, ticketTier } = body;

    // --- Validasi input dasar ---
    if (!name || !email || !whatsapp || !ticketTier) {
      return NextResponse.json(
        { error: "Semua field wajib diisi (nama, email, whatsapp, tiket)." },
        { status: 400 }
      );
    }

    const tier = getTierById(ticketTier);
    if (!tier) {
      return NextResponse.json(
        { error: "Tipe tiket tidak valid." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServerClient();

    // --- Cek kuota sederhana (opsional) ---
    if (tier.quota) {
      const { count, error: countError } = await supabase
        .from("registrations")
        .select("*", { count: "exact", head: true })
        .eq("ticket_tier", tier.id)
        .neq("payment_status", "failed");

      if (countError) throw countError;
      if (count >= tier.quota) {
        return NextResponse.json(
          { error: `Kuota untuk tiket "${tier.name}" sudah habis.` },
          { status: 409 }
        );
      }
    }

    // --- Buat order_id unik ---
    const orderId = `WS-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)
      .toUpperCase()}`;

    // --- Simpan dulu ke Supabase dengan status pending ---
    const { data: inserted, error: insertError } = await supabase
      .from("registrations")
      .insert({
        name,
        email,
        whatsapp,
        ticket_tier: tier.id,
        ticket_name: tier.name,
        amount: tier.price,
        payment_status: "pending",
        midtrans_order_id: orderId,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // --- Request Snap token ke Midtrans ---
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    if (!serverKey) {
      return NextResponse.json(
        { error: "MIDTRANS_SERVER_KEY belum diset di environment variables." },
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
        transaction_details: {
          order_id: orderId,
          gross_amount: tier.price,
        },
        customer_details: {
          first_name: name,
          email,
          phone: whatsapp,
        },
        item_details: [
          {
            id: tier.id,
            price: tier.price,
            quantity: 1,
            name: tier.name,
          },
        ],
      }),
    });

    const midtransData = await midtransRes.json();

    if (!midtransRes.ok) {
      // Rollback: tandai registrasi sebagai gagal supaya tidak menggantung
      await supabase
        .from("registrations")
        .update({ payment_status: "failed" })
        .eq("id", inserted.id);

      return NextResponse.json(
        { error: midtransData.error_messages?.join(", ") || "Gagal membuat transaksi Midtrans." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      snapToken: midtransData.token,
      orderId,
    });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
