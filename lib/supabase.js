import { createClient } from "@supabase/supabase-js";

// Client untuk dipakai di server (API routes) — pakai Service Role Key
// supaya bisa insert/update tanpa terhalang Row Level Security.
// JANGAN pernah expose SUPABASE_SERVICE_ROLE_KEY ke frontend/browser.
export function getSupabaseServerClient() {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "SUPABASE_URL atau SUPABASE_SERVICE_ROLE_KEY belum diset di environment variables."
    );
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}
