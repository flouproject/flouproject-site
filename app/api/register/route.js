import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "../../../lib/supabase";
import { getTierById } from "../../../lib/tickets";

// CATATAN: sementara pembayaran otomatis via Midtrans belum aktif
// (masih menunggu proses approval merchant), alur ini memakai
// transfer manual + konfirmasi WhatsApp. Setelah Midtrans approve,
// tinggal aktifkan lagi pemanggilan Snap API di sini.

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, whatsapp, ticketTier } = body;

    if (!name || !email || !whatsapp || !ticketTier) {
      return NextResponse.json(
        { error: "Semua field wajib diisi (nama, email, whatsapp, tiket)." },
        { status: 400 }
      );
    }

    const tier = getTierById(ticketTier);
    if (!tier) {
      return NextResponse.json({ error: "Tipe tiket tidak valid." }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();

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

    const orderId = `WS-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)
      .toUpperCase()}`;

    const { data: inserted, error: insertError } = await supabase
      .from("registrations")
      .insert({
        name,
        email,
        whatsapp,
        ticket_tier: tier.id,
        ticket_name: tier.name,
        amount: tier.price,
        payment_status: "pending_manual_transfer",
        midtrans_order_id: orderId,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return NextResponse.json({
      orderId,
      amount: tier.price,
      ticketName: tier.name,
    });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
