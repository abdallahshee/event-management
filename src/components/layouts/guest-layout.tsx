'use client'

import { Container } from '@mantine/core'
import Navbar from '#/components/navbar'
import Footer from '#/components/footer'

export function GuestLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <Container fluid>
            <h1 className='w-full bg-red-800'>I AM HERE AS THE OWNERED GUEST</h1>
        {children}
      </Container>
      <Footer />
    </>
  )
}
