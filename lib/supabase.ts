import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

let supabaseClient: ReturnType<typeof createClientComponentClient> | null = null

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables. Please check that NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your .env.local file.",
    )
  }

  // Use singleton pattern to avoid creating multiple clients
  if (!supabaseClient) {
    supabaseClient = createClientComponentClient({
      supabaseUrl,
      supabaseKey: supabaseAnonKey,
    })
  }

  return supabaseClient
}

// Export a default client for convenience
export const supabase = createClient()
