import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr"

let client: ReturnType<typeof createSupabaseBrowserClient> | undefined

export function createBrowserClient() {
  if (typeof window === "undefined") {
    throw new Error("createBrowserClient should only be called on the client side")
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase configuration is missing. Please check environment variables.")
  }

  if (!client) {
    client = createSupabaseBrowserClient(supabaseUrl, supabaseAnonKey)
  }

  return client
}
