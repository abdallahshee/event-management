import { createFileRoute, Link } from '@tanstack/react-router'
import {
  SimpleGrid, Card, Badge, Button, Paper,
  Group, Stack, Skeleton, Pagination, TextInput,
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import '@mantine/dates/styles.css'
import { useState } from 'react'
import { Search, Calendar, MapPin, Users, Clock, ImageOff, ChevronLeft, ChevronRight } from 'lucide-react'
import { useDebouncedValue } from '@mantine/hooks'
import { useSuspenseQuery } from '@tanstack/react-query'
import { GetEventsQueryOption } from '#/db/queries/event.queries'

// ── TYPES ──
type EventItem = {
  id: string
  title: string
  slug:string,
  description: string | null
  coverImage: string | null
  category: string | null
  price: number
  capacity: number
  slotsRemaining: number
  startsAt: string
  endsAt: string
  status: string
  isFeatured: boolean
  locationId: string | null
  location: { name: string } | null
}
const MOCK_EVENTS: EventItem[] = [
  {
    id: '1',
    title: 'Nairobi Tech Summit 2026',
    slug:" str fgyuhuih",
    description: 'A gathering of the brightest minds in tech across East Africa. Talks, workshops and networking.',
    coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    category: 'tech',
    price: 2500,
    capacity: 500,
    slotsRemaining: 120,
    startsAt: '2026-07-10T09:00:00.000Z',
    endsAt: '2026-07-11T17:00:00.000Z',
    status: 'published',
    isFeatured: true,
    locationId: 'loc-1',
    location: { name: 'KICC, Nairobi' },
  },
  {
    id: '2',
    title: 'Blankets & Wine Nairobi',
     slug:" str fgyuhuihhninfyu",
    description: 'An iconic outdoor music experience featuring local and international artists under the sun.',
    coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
    category: 'music',
    price: 3500,
    capacity: 2000,
    slotsRemaining: 8,
    startsAt: '2026-07-19T13:00:00.000Z',
    endsAt: '2026-07-19T22:00:00.000Z',
    status: 'published',
    isFeatured: true,
    locationId: 'loc-2',
    location: { name: 'Ngong Racecourse, Nairobi' },
  },
  {
    id: '3',
    title: 'Nairobi Food Festival',
     slug:" str fgyuhuihererf",
    description: 'Celebrate the best of Kenyan and international cuisine with top chefs, tastings and live cooking demos.',
    coverImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
    category: 'food',
    price: 1500,
    capacity: 800,
    slotsRemaining: 340,
    startsAt: '2026-08-02T10:00:00.000Z',
    endsAt: '2026-08-03T20:00:00.000Z',
    status: 'published',
    isFeatured: false,
    locationId: 'loc-3',
    location: { name: 'The Hub Karen, Nairobi' },
  },
  {
    id: '4',
    title: 'Startup Pitch Night',
     slug:" str fgyuhuihwerdytg",
    description: 'Watch 10 early-stage startups pitch to a panel of top investors. Network with founders and VCs.',
    coverImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800',
    category: 'business',
    price: 0,
    capacity: 150,
    slotsRemaining: 0,
    startsAt: '2026-07-24T18:00:00.000Z',
    endsAt: '2026-07-24T21:00:00.000Z',
    status: 'published',
    isFeatured: false,
    locationId: 'loc-4',
    location: { name: 'iHub, Nairobi' },
  },
  {
    id: '5',
    title: 'Safari 7s Rugby Tournament',
     slug:" str fgyuhuihytdyrdtu",
    description: 'Kenya\'s premier sevens rugby tournament featuring clubs from across the country.',
    coverImage: 'https://images.unsplash.com/photo-1508098682722-e99c643e7f0b?w=800',
    category: 'sports',
    price: 500,
    capacity: 5000,
    slotsRemaining: 2300,
    startsAt: '2026-08-15T08:00:00.000Z',
    endsAt: '2026-08-16T18:00:00.000Z',
    status: 'published',
    isFeatured: true,
    locationId: 'loc-5',
    location: { name: 'RFUEA Ground, Nairobi' },
  },
  {
    id: '6',
    title: 'East Africa Art Fair',
     slug:" str fgyuhuihe str dyui",
    description: 'A curated showcase of contemporary art from emerging and established East African artists.',
    coverImage: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800',
    category: 'arts',
    price: 1000,
    capacity: 300,
    slotsRemaining: 95,
    startsAt: '2026-09-05T10:00:00.000Z',
    endsAt: '2026-09-07T19:00:00.000Z',
    status: 'published',
    isFeatured: false,
    locationId: 'loc-6',
    location: { name: 'Nairobi National Museum' },
  },
]

type Category = 'all' | 'music' | 'tech' | 'food' | 'sports' | 'arts' | 'business'

const CATEGORIES: Category[] = ['all', 'music', 'tech', 'food', 'sports', 'arts', 'business']
const CATEGORY_COLORS: Record<string, string> = {
  music: 'violet', tech: 'blue', food: 'orange',
  sports: 'green', arts: 'pink', business: 'cyan',
}

export const Route = createFileRoute('/')({
  // loader: async ({ context }) => {
  //   await context.queryClient.prefetchQuery(GetEventsQueryOption({ limit: 6, page: 1 }))
  // },
  component: HomePage,
})

// ── SKELETON ──
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

// ── FEATURED BANNER ──
function FeaturedEvents({ events }: { events: EventItem[] }) {
  const [index, setIndex] = useState(0)
  const ev = events[index]
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
              {ev.category && (
                <Badge variant="filled" color={CATEGORY_COLORS[ev.category] ?? 'gray'} size="sm" radius="sm">
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
                {price === 0 ? 'Free' : `KES ${price.toLocaleString()}`}
              </p>
              <Group gap="xs">
                <Link to="/events/$slug" params={{ slug: ev.slug }}>
                  <Button size="sm" radius="md" color="blue" variant="light">View details</Button>
                </Link>
                <Button size="sm" radius="md" color="blue" disabled={ev.slotsRemaining === 0}>
                  {ev.slotsRemaining === 0 ? 'Sold out' : 'Book now'}
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

// ── EVENT CARD ──
function EventCard({ event }: { event: EventItem }) {
  const isSoldOut = event.slotsRemaining === 0
  const isLowStock = event.slotsRemaining > 0 && event.slotsRemaining <= 10
  const price = typeof event.price === 'number' ? event.price : parseFloat(event.price as any)
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <Card withBorder radius="md" p={0} className="flex flex-col overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <Link to="/events/$slug" params={{ slug: event.slug }} className="contents">
        <div className="relative h-40 w-full shrink-0 bg-slate-100 dark:bg-slate-800">
          {event.coverImage ? (
            <img src={event.coverImage} alt={event.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ImageOff size={28} className="text-slate-300 dark:text-slate-600" />
            </div>
          )}
          <div className="absolute left-3 top-3 flex gap-1.5">
            {isSoldOut && <Badge variant="filled" color="red" size="sm" radius="sm">Sold out</Badge>}
            {isLowStock && <Badge variant="filled" color="orange" size="sm" radius="sm">{event.slotsRemaining} left</Badge>}
          </div>
        </div>

        <Stack gap="xs" p="md" className="flex-1">
          {event.category && (
            <Badge variant="light" color={CATEGORY_COLORS[event.category] ?? 'gray'} size="sm" radius="sm" className="w-fit">
              {event.category}
            </Badge>
          )}
          <p className="line-clamp-2 text-sm font-semibold leading-snug text-slate-900 dark:text-slate-50">
            {event.title}
          </p>
          <Stack gap={4} mt={2}>
            {event.location && (
              <Group gap={6} wrap="nowrap">
                <MapPin size={12} className="shrink-0 text-slate-400" />
                {/* ✅ use location.name instead of locationId */}
                <span className="truncate text-xs text-slate-500 dark:text-slate-400">{event.location.name}</span>
              </Group>
            )}
            <Group gap={6} wrap="nowrap">
              <Clock size={12} className="shrink-0 text-slate-400" />
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {formatDate(event.startsAt)} — {formatDate(event.endsAt)}
              </span>
            </Group>
            <Group gap={6} wrap="nowrap">
              <Users size={12} className="shrink-0 text-slate-400" />
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {event.slotsRemaining} / {event.capacity} slots remaining
              </span>
            </Group>
          </Stack>
        </Stack>
      </Link>

      <Group justify="space-between" align="center" px="md" py="sm" className="shrink-0 border-t border-slate-100 dark:border-slate-800">
        <p className="text-sm font-bold text-slate-900 dark:text-slate-50">
          {price === 0 ? 'Free' : `KES ${price.toLocaleString()}`}
        </p>
        <Group gap="xs">
          <Link to="/events/$slug" params={{ slug: event.slug }}>
            <Button size="xs" radius="md" color="blue" variant="light">Details</Button>
          </Link>
          <Button size="xs" radius="md" color="blue" variant={isSoldOut ? 'outline' : 'filled'} disabled={isSoldOut}>
            {isSoldOut ? 'Sold out' : 'Book now'}
          </Button>
        </Group>
      </Group>
    </Card>
  )
}

// ── HOME PAGE ──
function HomePage() {
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebouncedValue(search, 300)
  const [dateRange, setDateRange] = useState<[string | null, string | null]>([null, null])
  const [activeCategory, setActiveCategory] = useState<Category>('all')
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 6

const isLoading = false
const eventsResponse = {
  data: MOCK_EVENTS,
  meta: { total: MOCK_EVENTS.length, totalPages: 1, page: 1, limit: 6 }
}

  const allEvents = eventsResponse?.data ?? []
  const meta = eventsResponse?.meta

  // client-side filter on top of server pagination
  const filtered = allEvents.filter(e => {
    const matchesSearch =
      e.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      (e.location?.name ?? '').toLowerCase().includes(debouncedSearch.toLowerCase())

    const matchesCategory = activeCategory === 'all' || e.category === activeCategory

    const [start, end] = dateRange
    const matchesDate =
      !start && !end ? true
      : start && !end ? e.startsAt >= start
      : !start && end ? e.endsAt <= end
      : start && end ? e.startsAt >= start && e.endsAt <= end
      : true

    return matchesSearch && matchesCategory && matchesDate && e.status === 'published'
  })

  // first 5 featured events shown in their own row
  const featuredEvents = allEvents
    .filter(e => e.isFeatured && e.status === 'published')
    .slice(0, 5)

  const hasFilters = debouncedSearch || dateRange[0] || dateRange[1] || activeCategory !== 'all'

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => { setSearch(e.target.value); setPage(1) }
  const handleDateChange = (value: [string | null, string | null]) => { setDateRange(value); setPage(1) }
  const handleCategoryChange = (cat: Category) => { setActiveCategory(cat); setPage(1) }

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

        <Group gap="xs" wrap="wrap">
          {CATEGORIES.map(cat => (
            <Button
              key={cat}
              size="xs"
              radius="xl"
              variant={activeCategory === cat ? 'filled' : 'light'}
              color={cat === 'all' ? 'blue' : CATEGORY_COLORS[cat] ?? 'gray'}
              onClick={() => handleCategoryChange(cat)}
              className="capitalize"
            >
              {cat}
            </Button>
          ))}
        </Group>
      </Paper>

      {/* ── FEATURED ROW (first 5, own row, hidden when filters active) ── */}
      {featuredEvents.length > 0 && !hasFilters && (
        isLoading ? (
          <Stack gap="md">
            <FeaturedSkeleton />
          </Stack>
        ) : (
          <FeaturedEvents events={featuredEvents} />
        )
      )}

      {/* ── RESULTS BAR ── */}
      <Group justify="space-between" align="center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {meta ? `${meta.total} event${meta.total !== 1 ? 's' : ''} found` : ''}
        </p>
        {hasFilters && (
          <button
            className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
            onClick={() => { setSearch(''); setDateRange([null, null]); setActiveCategory('all'); setPage(1) }}
          >
            Clear filters
          </button>
        )}
      </Group>

      {/* ── GRID ── */}
      {isLoading ? (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => <EventCardSkeleton key={i} />)}
        </SimpleGrid>
      ) : filtered.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200">No events found</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Try adjusting your search or filters</p>
        </div>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {filtered.map(e => <EventCard key={e.id} event={e} />)}
        </SimpleGrid>
      )}

      {/* ── PAGINATION ── */}
      {meta && meta.totalPages > 1 && (
        <Group justify="center" mt="lg">
          <Pagination
            total={meta.totalPages}
            value={page}
            onChange={setPage}
            radius="md"
            color="blue"
          />
        </Group>
      )}
    </div>
  )
}