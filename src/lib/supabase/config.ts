/**
 * Centralized Supabase config + mock-mode flag.
 *
 * If env vars are missing the app runs in MOCK MODE — all data comes from
 * /src/lib/mock/*. Useful for the first preview before the Supabase project
 * is provisioned. Real backend kicks in as soon as env vars are filled.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const IS_MOCK = !SUPABASE_URL || !SUPABASE_ANON_KEY;
