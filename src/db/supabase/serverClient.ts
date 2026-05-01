// import { createClient } from "@supabase/supabase-js"
// import {createServerClient} from '@supabase/ssr'

// let client: ReturnType<typeof createClient> | null = null

// export const getSupabaseServerClient = () => {
//   if (!client) {
//     client = createServerClient(
//       import.meta.env.VITE_SUPABASE_URL!,
//       import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY!
//     )
//   }
//   return client
// }