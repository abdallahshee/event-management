'use client'

import {
  SimpleGrid, Card, Paper,
  Group, Stack, Skeleton, TextInput, Button,
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import '@mantine/dates/styles.css'
import { useState, useTransition } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Search, Calendar } from 'lucide-react'
import { useDebouncedValue } from '@mantine/hooks'
import { SupportedEventCategories, PAGE_SIZE } from '#/db/utils'
import { getCategoryColor } from '#/components/event-card'
import { EventsList, type Category } from '#/components/event-list'
import type { GetEventsFn } from '#/server/functions/event.functions'

// ── CONSTANTS ──

const CATEGORIES: Category[] = ['all', ...SupportedEventCategories]

// ── SKELETONS ──
function EventCardSkeleton() {
  return (
    <Card withBorder radius="md" p={0} className="overflow-hidden shadow-sm">
      <Skeleton height={160} radius={0} />
      <Stack gap="sm" p="md">
        <Skeleton height={16} width={70} radius="sm" />
        <Skeleton height={18} width="80%" radius="sm" />
        <Group gap={6} mt={4}>
          <Skeleton height={12} width={12} radius="xl" />
          <Skeleton height={12} width="50%" radius="sm" />
        </Group>
        <Group gap={6}>
          <Skeleton height={12} width={12} radius="xl" />
          <Skeleton height={12} width="60%" radius="sm" />
        </Group>
        <Group gap={6}>
          <Skeleton height={12} width={12} radius="xl" />
          <Skeleton height={12} width="40%" radius="sm" />
        </Group>
        <Group justify="space-between" mt="xs">
          <Skeleton height={20} width={60} radius="sm" />
          <Group gap="xs">
            <Skeleton height={28} width={60} radius="md" />
            <Skeleton height={28} width={70} radius="md" />
          </Group>
        </Group>
      </Stack>
    </Card>
  )
}

function FeaturedSkeleton() {
  return (
    <Paper withBorder radius="lg" p={0} className="overflow-hidden shadow-sm">
      <div className="flex flex-col sm:flex-row">
        <Skeleton height={200} width={260} radius={0} className="shrink-0" />
        <Stack gap="sm" p="lg" className="flex-1">
          <Group gap="xs">
            <Skeleton height={20} width={70} radius="sm" />
            <Skeleton height={20} width={60} radius="sm" />
          </Group>
          <Skeleton height={22} width="70%" radius="sm" />
          <Skeleton height={14} width="90%" radius="sm" />
          <Skeleton height={14} width="75%" radius="sm" />
          <Group gap={6} mt={4}>
            <Skeleton height={12} width={12} radius="xl" />
            <Skeleton height={12} width="40%" radius="sm" />
          </Group>
          <Group gap={6}>
            <Skeleton height={12} width={12} radius="xl" />
            <Skeleton height={12} width="30%" radius="sm" />
          </Group>
          <Group justify="space-between" mt="md">
            <Skeleton height={24} width={80} radius="sm" />
            <Group gap="xs">
              <Skeleton height={32} width={90} radius="md" />
              <Skeleton height={32} width={90} radius="md" />
            </Group>
          </Group>
        </Stack>
      </div>
    </Paper>
  )
}

// ── HOME PAGE ──
type EventsResponse = Awaited<ReturnType<typeof GetEventsFn>>

export function HomePage({
  eventsResponse,
  page,
}: {
  eventsResponse: EventsResponse
  page:           number
}) {
  const router   = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const [search, setSearch]                 = useState('')
  const [debouncedSearch]                   = useDebouncedValue(search, 300)
  const [dateRange, setDateRange]           = useState<[string | null, string | null]>([null, null])
  const [activeCategory, setActiveCategory] = useState<Category>('all')

  const hasFilters = !!(debouncedSearch || dateRange[0] || dateRange[1] || activeCategory !== 'all')

  const goToPage = (p: number) => startTransition(() => {
    router.push(p === 1 ? pathname : `${pathname}?page=${p}`)
  })

  const handleSearchChange   = (e: React.ChangeEvent<HTMLInputElement>) => { setSearch(e.target.value); goToPage(1) }
  const handleDateChange     = (value: [string | null, string | null])  => { setDateRange(value);       goToPage(1) }
  const handleCategoryChange = (cat: Category)                          => { setActiveCategory(cat);    goToPage(1) }
  const handleClearFilters   = ()                                        => { setSearch(''); setDateRange([null, null]); setActiveCategory('all'); goToPage(1) }

  return (
    <div className="space-y-6 py-6">

      {/* ── HERO + FILTERS ── */}
      <Paper withBorder radius="xl" p="xl" className="bg-slate-50 shadow-sm dark:bg-slate-900/50">
        <div className="mb-6 text-center">
          <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
            Discover & Book Events
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Find events happening around you and secure your spot today
          </p>
        </div>

        <div className="mb-4 grid grid-cols-1 gap-3 lg:grid-cols-3">
          <TextInput
            className="lg:col-span-2"
            placeholder="Search by name or location..."
            radius="md"
            value={search}
            onChange={handleSearchChange}
            leftSection={<Search size={15} />}
          />
          <DatePickerInput
            type="range"
            placeholder="Filter by date range"
            radius="md"
            clearable
            value={dateRange}
            onChange={handleDateChange}
            leftSection={<Calendar size={15} />}
          />
        </div>

        <Group gap="xs" wrap="wrap" justify="space-between">
          <Group gap="xs" wrap="wrap">
            {CATEGORIES.map(cat => (
              <Button
                key={cat}
                size="xs"
                radius="xl"
                variant={activeCategory === cat ? 'filled' : 'light'}
                color={cat === 'all' ? 'blue' : getCategoryColor(cat)}
                onClick={() => handleCategoryChange(cat)}
                className="capitalize"
              >
                {cat}
              </Button>
            ))}
          </Group>
          {hasFilters && (
            <button
              className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
              onClick={handleClearFilters}
            >
              Clear filters
            </button>
          )}
        </Group>
      </Paper>

      {/* ── RESULTS ── */}
      {isPending ? (
        <div className="space-y-6">
          <FeaturedSkeleton />
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => <EventCardSkeleton key={i} />)}
          </SimpleGrid>
        </div>
      ) : (
        <EventsList
          eventsResponse={eventsResponse}
          page={page}
          debouncedSearch={debouncedSearch}
          dateRange={dateRange}
          activeCategory={activeCategory}
          hasFilters={hasFilters}
          onPageChange={goToPage}
        />
      )}

    </div>
  )
}
