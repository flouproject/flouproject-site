import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "../../../lib/supabase";

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ products: data });
  } catch (err) {
    console.error("Fetch products error:", err);
    return NextResponse.json({ error: "Gagal mengambil produk." }, { status: 500 });
  }
}
