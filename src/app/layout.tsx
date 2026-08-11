import type { Metadata } from 'next'
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import '../styles.css'
import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core'
import { Providers } from './providers'
import { AdminLayout } from '#/components/layouts/admin-layout'
import { UserLayout } from '#/components/layouts/user-layout'
import { getCurrentUserAndRoleFn } from '#/server/functions/profile.functions'

export const metadata: Metadata = {
  title: 'Evenue',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const result = await getCurrentUserAndRoleFn()
  const isAdmin = !!result?.user && result.role === 'admin'

  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body>
        <Providers>
          {isAdmin ? (
            <AdminLayout>{children}</AdminLayout>
          ) : (
            <UserLayout>{children}</UserLayout>
          )}
        </Providers>
      </body>
    </html>
  )
}
