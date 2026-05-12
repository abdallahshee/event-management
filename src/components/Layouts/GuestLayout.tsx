import { Outlet } from '@tanstack/react-router'
import { Container } from '@mantine/core'
import Navbar from '#/components/Navbar'
import Footer from '#/components/Footer'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import TanStackQueryDevtools from '#/integrations/tanstack-query/devtools'

export function GuestLayout() {
  return (
    <>
      <Navbar />
      <Container fluid>
            <h1 className='w-full bg-red-800'>I AM HERE AS THE OWNERED GUEST</h1>
        <Outlet />
        <TanStackDevtools
          config={{ position: 'bottom-right' }}
          plugins={[
            { name: 'Tanstack Router', render: <TanStackRouterDevtoolsPanel /> },
            TanStackQueryDevtools,
          ]}
        />
      </Container>
      <Footer />
    </>
  )
}