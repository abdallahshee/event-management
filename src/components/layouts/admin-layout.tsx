'use client'

import { AppShell, Container } from '@mantine/core'
import Navbar from '#/components/navbar'
import Footer from '#/components/footer'

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell header={{ height: 56 }} padding="md">
      <AppShell.Header>
        <h1 className='w-full bg-red-800'>I AM THE ADMIN</h1>
        <Navbar />
      </AppShell.Header>
      <AppShell.Main>
        <Container fluid>
          {children}
        </Container>
      </AppShell.Main>
      <Footer />
    </AppShell>
  )
}
