import { createFileRoute, Link } from '@tanstack/react-router'
import {
  SimpleGrid, Card, Badge, Button, Paper,
  Group, Stack, Skeleton, Pagination, TextInput,
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import '@mantine/dates/styles.css'
import { useState, useEffect } from 'react'
import { Search, Calendar, MapPin, Users, Clock, ImageOff, ChevronLeft, ChevronRight } from 'lucide-react'
import { useDebouncedValue } from '@mantine/hooks'
import type { Event } from '#/db/validations/event.validation'

export const Route = createFileRoute('/')({
  component: HomePage,
})


const CATEGORY_COLORS: Record<string, string> = {
  music: 'pink', tech: 'blue', food: 'orange',
  sports: 'green', arts: 'violet', business: 'indigo',
}

const CATEGORIES = ['all', 'music', 'tech', 'food', 'sports', 'arts', 'business'] as const
type Category = typeof CATEGORIES[number]

const PAGE_SIZE = 9

const MOCK_EVENTS: Event[] = [
  ...Array.from({ length: 24 }, (_, i) => ({
    id: String(i + 1),
    title: ['Nairobi Tech Summit 2025', 'East Africa Business Forum', 'Creative Arts Festival', 'Startup Pitch Night', 'Women in Tech Conference', 'Digital Marketing Masterclass'][i % 6],
    description: 'Join us for an incredible event experience.',
    category: (['music', 'tech', 'food', 'sports', 'arts', 'business'] as const)[i % 6],
    locationId: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru'][i % 4],
    price: ['0', '500', '1500', '2500', '5000'][i % 5],
    capacity: 100 + i * 10,
    slotsRemaining: Math.max(0, 80 - i * 3),
    startsAt: new Date(2025, 5 + (i % 4), 10 + i).toISOString(),
    endsAt: new Date(2025, 5 + (i % 4), 12 + i).toISOString(),
    isFeatured: i % 5 === 0,
    coverImage: i % 3 === 0 ? null : `https://picsum.photos/seed/${i + 1}/600/300`,
    status: 'published' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })),
  {
    id: '25',
    title: 'Savanna Music Festival 2025',
    description: 'A celebration of African music and culture under the open sky.',
    category: 'music' as const,
    locationId: 'Uhuru Gardens, Nairobi',
    price: '3500',
    capacity: 2000,
    slotsRemaining: 15,
    startsAt: new Date(2025, 9, 18, 14, 0).toISOString(),
    endsAt: new Date(2025, 9, 19, 23, 0).toISOString(),
    isFeatured: true,
    coverImage: 'https://picsum.photos/seed/savanna/600/300',
    status: 'published' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// ── SKELETON ──
function EventCardSkeleton() {
  return (
    <Card withBorder radius="md" p={0} className="overflow-hidden shadow-sm">
      <Skeleton height={160} radius={0} />
      <Stack gap="sm" p="md">
        <Skeleton height={18} width={70} radius="sm" />
        <Skeleton height={16} width="80%" radius="sm" />
        <Skeleton height={12} width="50%" radius="sm" />
        <Skeleton height={12} width="60%" radius="sm" />
        <Group justify="space-between" mt="xs">
          <Skeleton height={20} width={80} radius="sm" />
          <Skeleton height={28} width={80} radius="sm" />
        </Group>
      </Stack>
    </Card>
  )
}

// ── FEATURED BANNER ──
function FeaturedEvents({ events }: { events: Event[] }) {
  const [index, setIndex] = useState(0)
  const ev = events[index]
  const price = parseFloat(ev.price)
  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })

  useEffect(() => {
    if (events.length <= 1) return
    const timer = setInterval(() => {
      setIndex(i => (i + 1) % events.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [events.length])

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
                {ev.locationId && (
                  <Group gap={6}>
                    <MapPin size={13} className="text-slate-400" />
                    <span className="text-xs text-slate-500 dark:text-slate-400">{ev.locationId}</span>
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
                <Link to="/events/$eventId" params={{ eventId: ev.id }}>
                  <Button size="sm" radius="md" color="blue" variant="light">
                    View details
                  </Button>
                </Link>
                <Button
                  size="sm"
                  radius="md"
                  color="blue"
                  disabled={ev.slotsRemaining === 0}
                >
                  {ev.slotsRemaining === 0 ? 'Sold out' : 'Book now'}
                </Button>
              </Group>
            </Group>
          </div>
        </div>

        {/* Dot indicators */}
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
function EventCard({ event }: { event: Event }) {
  const isSoldOut = event.slotsRemaining === 0
  const isLowStock = event.slotsRemaining > 0 && event.slotsRemaining <= 10
  const price = parseFloat(event.price)
  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <Card withBorder radius="md" p={0} className="flex flex-col overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <Link to="/events/$eventId" params={{ eventId: event.id }} className="contents">
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
            {event.locationId && (
              <Group gap={6} wrap="nowrap">
                <MapPin size={12} className="shrink-0 text-slate-400" />
                <span className="truncate text-xs text-slate-500 dark:text-slate-400">{event.locationId}</span>
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
          <Link to="/events/$eventId" params={{ eventId: event.id }}>
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
  const loading = false

  const filtered = MOCK_EVENTS.filter(e => {
    const matchesSearch =
      e.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      (e.locationId ?? '').toLowerCase().includes(debouncedSearch.toLowerCase())

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

  const featuredEvents = MOCK_EVENTS.filter(e => e.isFeatured && e.status === 'published')
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
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

      {/* ── FEATURED ── */}
      {featuredEvents.length > 0 && !debouncedSearch && activeCategory === 'all' && (
        <FeaturedEvents events={featuredEvents} />
      )}

      {/* ── RESULTS BAR ── */}
      <Group justify="space-between" align="center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {filtered.length} event{filtered.length !== 1 ? 's' : ''} found
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
      {loading ? (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => <EventCardSkeleton key={i} />)}
        </SimpleGrid>
      ) : paginated.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-200">No events found</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Try adjusting your search or filters</p>
        </div>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {paginated.map(e => <EventCard key={e.id} event={e} />)}
        </SimpleGrid>
      )}

      {/* ── PAGINATION ── */}
      {totalPages > 1 && (
        <Group justify="center" mt="lg">
          <Pagination total={totalPages} value={page} onChange={setPage} radius="md" color="blue" />
        </Group>
      )}

    </div>
  )
}