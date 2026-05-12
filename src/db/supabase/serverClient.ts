import { createServerClient } from "@supabase/ssr"
import { getCookies, setCookie } from "@tanstack/react-start/server"

export function getSupabaseServerClient() {
  return createServerClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
            const cookies = getCookies()
         return Object.keys(cookies).map((name) => ({
            name,
            value: cookies[name] ?? "",
          }))
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            setCookie(name, value, options as any)
          })
        },
        },
    }
  )
}


// export function getSupabaseServerClient() {
//   return createServerClient(
//     process.env.VITE_SUPABASE_URL!,
//     process.env.SUPABASE_PUBLISHABLE_KEY!,
//     {
//       cookies: {
//         getAll() {
//           const cookies = getCookies()

//           return Object.keys(cookies).map((name) => ({
//             name,
//             value: cookies[name] ?? "",
//           }))
//         },

//         setAll(cookiesToSet) {
//           cookiesToSet.forEach(({ name, value, options }) => {
//             setCookie(name, value, options as any)
//           })
//         },
//       },
//     }
//   )
// }