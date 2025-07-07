import { createClient, type SupabaseClient } from "@supabase/supabase-js"

/**
 * Returns a Supabase client.
 * In **preview / local** environments where SUPABASE env-vars might be absent,
 * we fall back to a harmless “stub” client so the UI can still render.
 * Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to unlock full functionality.
 */
function getSupabaseClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

  if (supabaseUrl && supabaseAnonKey) {
    return createClient(supabaseUrl, supabaseAnonKey)
  }

  // -------  Fallback: show helpful warning & create a dummy client  -------
  // We use a public “example” URL/key so @supabase/supabase-js doesn’t throw.
  console.warn(
    [
      "⚠️  Supabase environment variables are missing.",
      "The app is running in a limited preview mode.",
      "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable uploads.",
    ].join("\n"),
  )

  // NOTE:  You can still navigate the UI, but any network calls will 404.
  return createClient("https://example.supabase.co", "public-anon-key")
}

export const supabase = getSupabaseClient()
export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
)
