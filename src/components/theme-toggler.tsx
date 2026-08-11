'use client'

import { useMantineColorScheme, ActionIcon, Tooltip } from '@mantine/core'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggler() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()

  return (
    <Tooltip
      label={colorScheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      position="bottom"
      withArrow
    >
      <ActionIcon
        onClick={toggleColorScheme}
        variant="subtle"
        color="gray"
        size="md"
        radius="md"
        aria-label="Toggle color scheme"
      >
        {colorScheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </ActionIcon>
    </Tooltip>
  )
}


import { createTheme, rem } from '@mantine/core'

export const theme = createTheme({
  primaryColor: 'blue',
  primaryShade: { light: 6, dark: 7 },

  fontFamily: 'Inter, sans-serif',
  fontFamilyMonospace: 'JetBrains Mono, monospace',

  defaultRadius: 'md',

  colors: {
    brand: [
      '#e6f1ff', // 0
      '#cce3ff', // 1
      '#99c7ff', // 2
      '#66aaff', // 3
      '#338eff', // 4
      '#0072ff', // 5
      '#005bcc', // 6 ← primary light
      '#0047a3', // 7 ← primary dark
      '#00337a', // 8
      '#001f52', // 9
    ],
  },

  headings: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: '600',
    sizes: {
      h1: { fontSize: rem(36) },
      h2: { fontSize: rem(28) },
      h3: { fontSize: rem(22) },
      h4: { fontSize: rem(18) },
    },
  },

  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
    md: '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
    lg: '0 8px 24px rgba(0,0,0,0.10), 0 4px 8px rgba(0,0,0,0.04)',
  },

  components: {
    Button: {
      defaultProps: {
        radius: 'md',
      },
    },
    Card: {
      defaultProps: {
        radius: 'md',
        withBorder: true,
      },
    },
    Input: {
      defaultProps: {
        radius: 'md',
      },
    },
    Paper: {
      defaultProps: {
        radius: 'md',
      },
    },
    Badge: {
      defaultProps: {
        radius: 'sm',
      },
    },
    Modal: {
      defaultProps: {
        radius: 'lg',
        centered: true,
      },
    },
    Notification: {
      defaultProps: {
        radius: 'md',
      },
    },
  },
})