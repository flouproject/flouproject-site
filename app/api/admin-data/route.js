import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "../../../lib/supabase";

export async function GET(request) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const providedPassword = request.headers.get("x-admin-password");

  if (!adminPassword || providedPassword !== adminPassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = getSupabaseServerClient();

    const [{ data: registrations, error: regError }, { data: orders, error: orderError }] =
      await Promise.all([
        supabase.from("registrations").select("*").order("created_at", { ascending: false }),
        supabase.from("orders").select("*").order("created_at", { ascending: false }),
      ]);

    if (regError) throw regError;
    if (orderError) throw orderError;

    return NextResponse.json({ registrations, orders });
  } catch (err) {
    console.error("Fetch admin data error:", err);
    return NextResponse.json({ error: "Gagal mengambil data." }, { status: 500 });
  }
}
