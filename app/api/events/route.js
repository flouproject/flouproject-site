import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "../../../lib/supabase";

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("is_active", true)
      .order("event_date", { ascending: true });

    if (error) throw error;
    return NextResponse.json({ events: data });
  } catch (err) {
    console.error("Fetch events error:", err);
    return NextResponse.json({ error: "Gagal mengambil event." }, { status: 500 });
  }
}
