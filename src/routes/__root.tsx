import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import '@mantine/core/styles.css'
import appCss from '../styles.css?url'
import type { QueryClient } from '@tanstack/react-query'
import type { User } from '@supabase/supabase-js'
import { MantineProvider } from '@mantine/core'
import { theme } from '#/components/ThemeToggler'
import { getCurrentUserAndRoleQueryOption } from '#/db/queries/profile.queries'
import { AdminLayout } from '#/components/Layouts/AdminLayout'
import { UserLayout } from '#/components/Layouts/UserLayout'
import { GuestLayout } from '#/components/Layouts/GuestLayout'

interface MyRouterContext {
  queryClient: QueryClient
  user: User | null
  isAdmin: boolean
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Evenue' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
    ],
  }),
  beforeLoad: async ({ context }) => {
    const result = await context.queryClient.fetchQuery(
      getCurrentUserAndRoleQueryOption()
    )
    return {
      user: result?.user ?? null,
      isAdmin: result?.isAdmin ?? false,
    }
  },
  shellComponent: RootDocument,
  component: RootComponent,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <MantineProvider theme={theme} defaultColorScheme="dark">
        <body>
          {children}
          <Scripts />
        </body>
      </MantineProvider>
    </html>
  )
}

function RootComponent() {
  const { user, isAdmin } = Route.useRouteContext()

  if (user && isAdmin) return <AdminLayout />
  if (user) return <UserLayout />
  return <GuestLayout />
}