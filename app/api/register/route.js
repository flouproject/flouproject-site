import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "../../../lib/supabase";

const MIDTRANS_IS_PRODUCTION = process.env.MIDTRANS_IS_PRODUCTION === "true";
const MIDTRANS_SNAP_URL = MIDTRANS_IS_PRODUCTION
  ? "https://app.midtrans.com/snap/v1/transactions"
  : "https://app.sandbox.midtrans.com/snap/v1/transactions";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, whatsapp, eventSlug } = body;

    // --- Validasi input dasar ---
    if (!name || !email || !whatsapp || !eventSlug) {
      return NextResponse.json(
        { error: "Semua field wajib diisi (nama, email, whatsapp, event)." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServerClient();

    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("*")
      .eq("slug", eventSlug)
      .eq("is_active", true)
      .single();

    if (eventError || !event) {
      return NextResponse.json({ error: "Event tidak ditemukan." }, { status: 404 });
    }

    // --- Cek kuota sederhana (opsional) ---
    if (event.quota) {
      const { count, error: countError } = await supabase
        .from("registrations")
        .select("*", { count: "exact", head: true })
        .eq("event_id", event.id)
        .neq("payment_status", "failed");

      if (countError) throw countError;
      if (count >= event.quota) {
        return NextResponse.json(
          { error: `Kuota untuk "${event.title}" sudah habis.` },
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
        event_id: event.id,
        ticket_tier: event.slug,
        ticket_name: event.title,
        amount: event.price,
        payment_status: "pending",
        midtrans_order_id: orderId,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // --- Event gratis: langsung tandai lunas, tidak perlu Midtrans ---
    if (event.price === 0) {
      await supabase
        .from("registrations")
        .update({ payment_status: "paid" })
        .eq("id", inserted.id);

      return NextResponse.json({ free: true, orderId });
    }

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
          gross_amount: event.price,
        },
        customer_details: {
          first_name: name,
          email,
          phone: whatsapp,
        },
        item_details: [
          {
            id: event.slug,
            price: event.price,
            quantity: 1,
            name: event.title,
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
