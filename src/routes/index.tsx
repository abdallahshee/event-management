import { createFileRoute, Link } from '@tanstack/react-router'
import {
  SimpleGrid, Card, Badge, Button, Paper,
  Group, Stack, Skeleton, Pagination, TextInput,
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import '@mantine/dates/styles.css'
import { useState, Suspense } from 'react'
import { Search, Calendar, MapPin, Users, Clock, ImageOff, ChevronLeft, ChevronRight } from 'lucide-react'
import { useDebouncedValue } from '@mantine/hooks'
import { useSuspenseQuery } from '@tanstack/react-query'
import { SupportedEventCategories } from '#/db/utils'
import type { EventCategory } from '#/db/validations/event.validation'
import { GetEventsQueryOption } from '#/db/queries/event.queries'
import { EventCard, getCategoryColor, type EventItem } from '#/components/EventCard'
import { EventsList, PAGE_SIZE, type Category } from '#/components/EventList'



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

function EventsPageSkeleton() {
  return (
    <div className="space-y-6 py-6">
      <FeaturedSkeleton />
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
        {Array.from({ length: PAGE_SIZE }).map((_, i) => <EventCardSkeleton key={i} />)}
      </SimpleGrid>
    </div>
  )
}

// ── FEATURED BANNER ──
export function FeaturedEvents({ events }: { events: EventItem[] }) {
  const [index, setIndex] = useState(0)
  const ev    = events[index]
  const price = typeof ev.price === 'number' ? ev.price : parseFloat(ev.price as any)
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div>
      <Group justify="space-between" align="center" mb="sm">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Featured event{events.length > 1 ? 's' : ''}
        </p>
        {events.length > 1 && (
          <Group gap="xs">
            <button
              onClick={() => setIndex(i => (i - 1 + events.length) % events.length)}
              className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              <ChevronLeft size={13} />
            </button>
            <span className="text-xs text-slate-400">{index + 1} / {events.length}</span>
            <button
              onClick={() => setIndex(i => (i + 1) % events.length)}
              className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              <ChevronRight size={13} />
            </button>
          </Group>
        )}
      </Group>

      <Paper withBorder radius="lg" p={0} className="overflow-hidden shadow-sm transition-all duration-300">
        <div className="flex flex-col sm:flex-row">
          <div className="relative h-48 w-full shrink-0 bg-slate-100 sm:h-auto sm:w-64 dark:bg-slate-800">
            {ev.coverImage ? (
              <img src={ev.coverImage} alt={ev.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <ImageOff size={28} className="text-slate-300 dark:text-slate-600" />
              </div>
            )}
            <div className="absolute left-3 top-3 flex gap-1.5">
              <Badge variant="filled" color="yellow" size="sm" radius="sm">Featured</Badge>
              {ev.type === 'free' && (
                <Badge variant="filled" color="green" size="sm" radius="sm">Free</Badge>
              )}
              {ev.category && (
                <Badge variant="filled" color={getCategoryColor(ev.category)} size="sm" radius="sm">
                  {ev.category}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex flex-1 flex-col justify-between p-5">
            <div className="space-y-2">
              <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">{ev.title}</p>
              {ev.description && (
                <p className="line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{ev.description}</p>
              )}
              <Stack gap={4} mt="xs">
                <Group gap={6}>
                  <Clock size={13} className="text-slate-400" />
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {formatDate(ev.startsAt)} — {formatDate(ev.endsAt)}
                  </span>
                </Group>
                {ev.location && (
                  <Group gap={6}>
                    <MapPin size={13} className="text-slate-400" />
                    <span className="text-xs text-slate-500 dark:text-slate-400">{ev.location.name}</span>
                  </Group>
                )}
                <Group gap={6}>
                  <Users size={13} className="text-slate-400" />
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {ev.slotsRemaining} / {ev.capacity} slots remaining
                  </span>
                </Group>
              </Stack>
            </div>

            <Group justify="space-between" align="center" mt="md">
              <p className="text-xl font-bold text-slate-900 dark:text-slate-50">
                {ev.type === 'free' || price === 0
                  ? <Badge color="green" variant="light" size="lg">Free</Badge>
                  : `KES ${price.toLocaleString()}`
                }
              </p>
              <Group gap="xs">
                <Link to="/events/$slug" params={{ slug: ev.slug }}>
                  <Button size="sm" radius="md" color="blue" variant="light">View details</Button>
                </Link>
                <Button size="sm" radius="md" color="blue" disabled={ev.slotsRemaining === 0}>
                  {ev.slotsRemaining === 0 ? 'Sold out' : ev.type === 'free' ? 'Register' : 'Book now'}
                </Button>
              </Group>
            </Group>
          </div>
        </div>

        {events.length > 1 && (
          <Group justify="center" gap="xs" py="xs" className="border-t border-slate-100 dark:border-slate-800">
            {events.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? 'w-4 bg-blue-500' : 'w-1.5 bg-slate-300 dark:bg-slate-600'
                }`}
              />
            ))}
          </Group>
        )}
      </Paper>
    </div>
  )
}





export const Route = createFileRoute('/')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(
      GetEventsQueryOption({ page: 1, limit: PAGE_SIZE })
    ),
  component: HomePage,
})
// ── HOME PAGE ──
function HomePage() {
  const [search, setSearch]                 = useState('')
  const [debouncedSearch]                   = useDebouncedValue(search, 300)
  const [dateRange, setDateRange]           = useState<[string | null, string | null]>([null, null])
  const [activeCategory, setActiveCategory] = useState<Category>('all')
  const [page, setPage]                     = useState(1)

  const hasFilters = !!(debouncedSearch || dateRange[0] || dateRange[1] || activeCategory !== 'all')

  const handleSearchChange   = (e: React.ChangeEvent<HTMLInputElement>) => { setSearch(e.target.value); setPage(1) }
  const handleDateChange     = (value: [string | null, string | null])  => { setDateRange(value);       setPage(1) }
  const handleCategoryChange = (cat: Category)                          => { setActiveCategory(cat);    setPage(1) }
  const handleClearFilters   = ()                                        => { setSearch(''); setDateRange([null, null]); setActiveCategory('all'); setPage(1) }

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

      {/* ── SUSPENSE BOUNDARY ── */}
      <Suspense
        fallback={
          <div className="space-y-6">
            <FeaturedSkeleton />
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
              {Array.from({ length: PAGE_SIZE }).map((_, i) => <EventCardSkeleton key={i} />)}
            </SimpleGrid>
          </div>
        }
      >
        <EventsList
          page={page}
          debouncedSearch={debouncedSearch}
          dateRange={dateRange}
          activeCategory={activeCategory}
          hasFilters={hasFilters}
          onPageChange={setPage}
        />
      </Suspense>

    </div>
  )
}

