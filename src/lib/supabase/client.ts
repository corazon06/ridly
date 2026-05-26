"use client";
import { createBrowserClient } from "@supabase/ssr";
import { IS_MOCK, SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";

export function createClient() {
  if (IS_MOCK) {
    throw new Error(
      "Supabase client requested in mock mode. Use the data layer (/src/lib/data/*) which switches automatically."
    );
  }
  return createBrowserClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);
}
