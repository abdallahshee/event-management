import { getSupabaseServerClient } from "#/db/supabase/serverClient";
import type { User } from "@supabase/supabase-js";
import { createMiddleware } from "@tanstack/react-start";

type AuthContext = {
  user: User | null
}

export const authMiddleware = createMiddleware({ type: 'request' })
  .server(async ({ next }) => {
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase.auth.getUser()

    const context: AuthContext = error || !data.user
      ? { user: null }
      : {
          user: data.user,
        }

    return next({ context })
  })