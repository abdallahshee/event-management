import { createClient } from "@supabase/supabase-js"

let client: ReturnType<typeof createClient> | null = null

export const getSupabaseBrowserClient = () => {
  if (!client) {
    client = createClient(
      import.meta.env.VITE_SUPABASE_URL!,
      import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY!
    )
  }
  return client
}