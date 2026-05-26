import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { IS_MOCK, SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";

export function createClient() {
  if (IS_MOCK) {
    throw new Error(
      "Supabase server client requested in mock mode. Use the data layer (/src/lib/data/*)."
    );
  }
  const cookieStore = cookies();
  return createServerClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          /* called from a Server Component — safe to ignore */
        }
      },
    },
  });
}
