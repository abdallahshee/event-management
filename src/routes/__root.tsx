import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import '@mantine/core/styles.css'
import appCss from '../styles.css?url'
import type { QueryClient } from '@tanstack/react-query'
import { MantineProvider } from '@mantine/core'
import { theme } from '#/components/ThemeToggler'
import { AdminLayout } from '#/components/Layouts/AdminLayout'
import { UserLayout } from '#/components/Layouts/UserLayout'
import { getCurrentUserAndRoleFn } from '#/server/functions/profile.functions'


interface MyRouterContext {
  queryClient: QueryClient
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
  beforeLoad: async () => {
    const result = await getCurrentUserAndRoleFn()
    return {
      user: result?.user ?? null,
      role: result?.role ?? false,
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
  const { user, role } = Route.useRouteContext()

  if (user && role === "admin") {
    return <AdminLayout />
  }
  return <UserLayout />

}