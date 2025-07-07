import { createClient, type SupabaseClient } from "@supabase/supabase-js"

/**
 * Returns a Supabase client.
 * In **preview / local** environments where SUPABASE env-vars might be absent,
 * we fall back to a harmless "stub" client so the UI can still render.
 * Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to unlock full functionality.
 */
function getSupabaseClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (supabaseUrl && supabaseAnonKey) {
    console.log("✅ Supabase configured with URL:", supabaseUrl.substring(0, 30) + "...")
    return createClient(supabaseUrl, supabaseAnonKey)
  }

  // -------  Fallback: show helpful warning & create a dummy client  -------
  console.warn(
    [
      "⚠️  Supabase environment variables are missing.",
      "The app is running in a limited preview mode.",
      "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable uploads.",
      "",
      "To set up Supabase:",
      "1. Create a project at https://supabase.com",
      "2. Go to Settings > API",
      "3. Copy your Project URL and anon/public key",
      "4. Add them as environment variables",
    ].join("\n"),
  )

  // NOTE: You can still navigate the UI, but any network calls will fail gracefully
  return createClient("https://example.supabase.co", "public-anon-key")
}

export const supabase = getSupabaseClient()
export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
)

// Helper function to test Supabase connection
export async function testSupabaseConnection() {
  if (!isSupabaseConfigured) {
    return { success: false, error: "Supabase not configured" }
  }

  try {
    const { data, error } = await supabase.from("shared_images").select("count").limit(1)
    if (error) {
      console.error("Supabase connection test failed:", error)
      return { success: false, error: error.message }
    }
    return { success: true, data }
  } catch (error) {
    console.error("Supabase connection test error:", error)
    return { success: false, error: "Connection failed" }
  }
}
