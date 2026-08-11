import { getSupabaseServerClient } from "#/db/supabase/serverClient"
import type { User } from "@supabase/supabase-js"

export async function getAuthUser(): Promise<User | null> {
  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase.auth.getUser()
  return error || !data.user ? null : data.user
}
