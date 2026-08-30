import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js'

// ------------------------------------------------------------------
// Shared Supabase DB client.
// Works in BOTH server components and client components (no cookie
// session needed — the app uses its own admin login, not Supabase Auth).
// When Supabase env vars are missing, the data layer automatically
// falls back to the in-memory mock data (demo mode).
// ------------------------------------------------------------------

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
// Support BOTH env naming conventions (legacy anon key & new publishable key)
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

let dbInstance: SupabaseClient | null = null

export function getDb(): SupabaseClient {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local')
  }
  if (!dbInstance) {
    dbInstance = createSupabaseClient(supabaseUrl, supabaseAnonKey)
  }
  return dbInstance
}
