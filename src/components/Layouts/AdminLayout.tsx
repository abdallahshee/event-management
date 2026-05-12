import { Outlet } from '@tanstack/react-router'
import { AppShell, Container } from '@mantine/core'
import Navbar from '#/components/Navbar'
import Footer from '#/components/Footer'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import TanStackQueryDevtools from '#/integrations/tanstack-query/devtools'

export function AdminLayout() {
  return (
    <AppShell header={{ height: 56 }} padding="md">
      <AppShell.Header>
        <h1 className='w-full bg-red-800'>I AM THE ADMIN</h1>
        <Navbar />
      </AppShell.Header>
      <AppShell.Main>
        <Container fluid>
          <Outlet />
        </Container>
      </AppShell.Main>
      <Footer />
      <TanStackDevtools
        config={{ position: 'bottom-right' }}
        plugins={[
          { name: 'Tanstack Router', render: <TanStackRouterDevtoolsPanel /> },
          TanStackQueryDevtools,
        ]}
      />
    </AppShell>
  )
}