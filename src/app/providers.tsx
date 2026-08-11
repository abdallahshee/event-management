'use client'

import type { ReactNode } from 'react'
import { MantineProvider } from '@mantine/core'
import { theme } from '#/components/theme-toggler'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      {children}
    </MantineProvider>
  )
}
