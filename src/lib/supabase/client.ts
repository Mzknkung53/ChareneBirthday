/**
 * Placeholder Supabase client.
 *
 * The site must run with no credentials, so this never throws: it reports
 * whether the env vars exist and returns null otherwise. Once you install
 * @supabase/supabase-js, swap the body of getSupabase() for a real client and
 * the services in lib/services will start using the database automatically.
 *
 * TODO: npm i @supabase/supabase-js, then:
 *   import { createClient } from '@supabase/supabase-js';
 *   return createClient(url, anonKey);
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

export type SupabaseClientLike = unknown;

export function getSupabase(): SupabaseClientLike | null {
  if (!isSupabaseConfigured) return null;
  // TODO: Replace with a real createClient(url, anonKey) call.
  return null;
}
