'use client'

// components/navbar.tsx
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Group, Button, Avatar, Menu, Divider, Burger, Drawer, Stack,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import {
  Home, CalendarDays, LogOut, User,
  ChevronDown, Ticket, BookOpen, Info, Mail,
} from 'lucide-react'
import { getSupabaseBrowserClient } from '#/db/supabase/browserClient'
import { useState, useEffect } from 'react'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { ThemeToggler } from './theme-toggler'

const NAV_LINKS = [
  { to: '/', label: 'Home', icon: <Home size={15} /> },
  { to: '/events', label: 'Events', icon: <CalendarDays size={15} /> },
  { to: '/bookings', label: 'My Bookings', icon: <BookOpen size={15} />, authOnly: true },
  { to: '/about', label: 'About', icon: <Info size={15} /> },
  { to: '/contact', label: 'Contact', icon: <Mail size={15} /> },
]

export default function Navbar() {
  const [opened, { toggle, close }] = useDisclosure(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const currentPath = usePathname()

  useEffect(() => {
    const supabase = getSupabaseBrowserClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await getSupabaseBrowserClient().auth.signOut()
    setUser(null)
    close()
  }

  const initials = user
    ? `${user.user_metadata?.first_name?.[0] ?? ''}${user.user_metadata?.last_name?.[0] ?? ''}`.toUpperCase() || user.email?.[0]?.toUpperCase()
    : ''

  const isActive = (to: string) =>
    to === '/' ? currentPath === '/' : currentPath.startsWith(to)

  const visibleLinks = NAV_LINKS.filter(l => !l.authOnly || user)

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex h-14 w-full items-center justify-between px-4 sm:px-6">
  <ThemeToggler />
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 no-underline">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <Ticket size={16} className="text-white" />
            </div>
            <span className="text-base font-bold text-slate-900 dark:text-slate-50">
              Evenue
            </span>
          </Link>

          {/* Desktop nav — only visible at md and above */}
    {/* Desktop nav — wrapped in div so Tailwind hidden works reliably */}
<div className="hidden md:flex">
  <Group gap={2}>
    {visibleLinks.map(link => (
      <Link
        key={link.to}
        href={link.to}
        className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium no-underline transition-colors ${
          isActive(link.to)
            ? 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50'
        }`}
      >
        {link.label}
      </Link>
    ))}
  </Group>
</div>

          {/* Right side — auth + burger */}
          <Group gap="sm">

            {/* Authenticated user menu — always visible when logged in */}
            {user ? (
              <Menu shadow="md" width={210} radius="md" position="bottom-end">
                <Menu.Target>
                  <button className="flex items-center gap-2 rounded-lg px-2 py-1 transition hover:bg-slate-100 dark:hover:bg-slate-800">
                    <Avatar color="blue" radius="md" size={32}>{initials}</Avatar>
                    {/* Name only visible on desktop */}
                    <span className="hidden text-sm font-medium text-slate-700 md:block dark:text-slate-300">
                      {user.user_metadata?.first_name ?? user.email?.split('@')[0]}
                    </span>
                    <ChevronDown size={14} className="text-slate-400 hidden md:block" />
                  </button>
                </Menu.Target>
                <Menu.Dropdown>
                  <div className="px-3 py-2">
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-50">
                      {user.user_metadata?.first_name} {user.user_metadata?.last_name}
                    </p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                  </div>
                  <Divider />
                  <Menu.Item leftSection={<User size={14} />}>My profile</Menu.Item>
                  <Menu.Item leftSection={<BookOpen size={14} />}>My bookings</Menu.Item>
                  <Divider />
                  <Menu.Item color="red" leftSection={<LogOut size={14} />} onClick={handleSignOut}>
                    Sign out
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            ) : (
              /* Desktop auth buttons — only visible at md and above */
              <Group gap="xs" className="hidden md:flex">
                <Link href="/account">
                  <Button size="xs" variant="subtle" color="blue" radius="md">Sign in</Button>
                </Link>
                <Link href="/account/signup">
                  <Button size="xs" variant="filled" color="blue" radius="md">Sign up</Button>
                </Link>
              </Group>
            )}

            {/* Burger — only visible below md */}
            <Burger opened={opened} onClick={toggle} size="sm" className="md:hidden" />
          </Group>

        </div>
      </header>

      {/* Mobile drawer */}
      <Drawer
        opened={opened}
        onClose={close}
        size="xs"
        position="right"
        title={
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600">
              <Ticket size={14} className="text-white" />
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-slate-50">Evenue</span>
          </div>
        }
      >
        <Stack gap="xs" mt="sm">
          {visibleLinks.map(link => (
            <Link
              key={link.to}
              href={link.to}
              onClick={close}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium no-underline transition-colors ${
                isActive(link.to)
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}

          <Divider my="xs" />

          {user ? (
            <>
              <div className="flex items-center gap-3 rounded-md px-3 py-2">
                <Avatar color="blue" radius="md" size={36}>{initials}</Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                    {user.user_metadata?.first_name} {user.user_metadata?.last_name}
                  </p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                </div>
              </div>
              <Divider />
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                <LogOut size={15} />
                Sign out
              </button>
            </>
          ) : (
            <Stack gap="xs" px="xs">
              <Link href="/account" onClick={close}>
                <Button fullWidth size="sm" variant="outline" color="blue" radius="md">Sign in</Button>
              </Link>
              <Link href="/account/signup" onClick={close}>
                <Button fullWidth size="sm" variant="filled" color="blue" radius="md">Sign up</Button>
              </Link>
            </Stack>
          )}
        </Stack>
      </Drawer>
    </>
  )
}
