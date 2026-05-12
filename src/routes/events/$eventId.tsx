import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Badge,
  Button,
  Paper,
  Group,
  Stack,
  Skeleton,
  Divider,
  ThemeIcon,
  SimpleGrid,
} from '@mantine/core'
import {
  MapPin,
  Users,
  Clock,
  Calendar,
  Tag,
  ImageOff,
  ArrowLeft,
  Ticket,
  CalendarCheck,
} from 'lucide-react'
import type { InferSelectModel } from 'drizzle-orm'
import { event } from '#/db/schema'

export const Route = createFileRoute('/events/$eventId')({
  component: EventDetailPage,
})

type Event = InferSelectModel<typeof event>

const CATEGORY_COLORS: Record<string, string> = {
  music: 'pink', tech: 'blue', food: 'orange',
  sports: 'green', arts: 'violet', business: 'indigo',
}

// ── MOCK (replace with real query using eventId) ──
const MOCK_EVENT: Event = {
  id: 'abc123',
  createdBy:"utrref",
  title: 'Nairobi Tech Summit 2025',
  description: `Join us for the biggest tech conference in East Africa. The Nairobi Tech Summit brings together innovators, engineers, founders, and investors from across the continent for two days of talks, workshops, and networking.\n\nExpect keynotes from industry leaders, hands-on sessions covering AI, cloud infrastructure, fintech, and mobile-first development, plus dedicated time to connect with fellow builders shaping Africa's tech future.\n\nWhether you're a seasoned engineer or just starting out, this summit is designed to inspire, educate, and connect.`,
  category: 'tech',
  locationId: 'Kenyatta International Convention Centre, Nairobi',
  price: 2500,
  capacity: 500,
  slotsRemaining: 120,
  startsAt: new Date(2026, 7, 15, 9, 0).toISOString(),
  endsAt: new Date(2026, 7, 16, 18, 0).toISOString(),
  isFeatured: true,
  coverImage: 'https://picsum.photos/seed/tech/1200/500',
  status: 'published',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

// ── SKELETON ──
function EventDetailSkeleton() {
  return (
    <div className="space-y-6 py-6">
      <Skeleton height={400} radius="lg" />
      <Stack gap="md">
        <Skeleton height={36} width="60%" radius="md" />
        <Skeleton height={16} width="30%" radius="md" />
        <Skeleton height={16} width="50%" radius="md" />
        <Skeleton height={120} radius="md" />
      </Stack>
    </div>
  )
}

function EventDetailPage() {
  const { eventId } = Route.useParams()

  // Replace with: const { data: event } = useSuspenseQuery(getEventQueryOptions(eventId))
  const ev = MOCK_EVENT
  const loading = false

  if (loading) return <EventDetailSkeleton />
  if (!ev) return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-3 text-center">
      <p className="font-semibold text-slate-700 dark:text-slate-200">Event not found</p>
      <Link to="/">
        <Button variant="light" color="blue" size="sm" leftSection={<ArrowLeft size={15} />}>
          Back to events
        </Button>
      </Link>
    </div>
  )

  // const price = ev.price
  const isSoldOut = ev.slotsRemaining === 0
  const isLowStock = ev.slotsRemaining > 0 && ev.slotsRemaining <= 20
  const isCancelled = ev.status === 'cancelled'

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-KE', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    })

  const formatTime = (d: string) =>
    new Date(d).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })

  const formatDateTime = (d: string) => `${formatDate(d)} at ${formatTime(d)}`

  const slotsPercent = Math.round(((ev.capacity - ev.slotsRemaining) / ev.capacity) * 100)

  return (
    <div className="space-y-6 py-6">

      {/* ── BACK ── */}
      <Link to="/">
        <Button variant="subtle" color="gray" size="xs" leftSection={<ArrowLeft size={14} />} className="px-0">
          Back to events
        </Button>
      </Link>

      {/* ── COVER IMAGE ── */}
      <div className="relative h-64 w-full overflow-hidden rounded-2xl bg-slate-100 sm:h-80 lg:h-96 dark:bg-slate-800">
        {ev.coverImage ? (
          <img src={ev.coverImage} alt={ev.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageOff size={48} className="text-slate-300 dark:text-slate-600" />
          </div>
        )}

        {/* Status overlay */}
        {isCancelled && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Badge size="xl" color="red" variant="filled" radius="md">Event Cancelled</Badge>
          </div>
        )}

        <div className="absolute left-4 top-4 flex gap-2">
          {ev.category && (
            <Badge variant="filled" color={CATEGORY_COLORS[ev.category] ?? 'gray'} size="md" radius="sm">
              {ev.category}
            </Badge>
          )}
          {isSoldOut && <Badge variant="filled" color="red" size="md" radius="sm">Sold out</Badge>}
          {isLowStock && <Badge variant="filled" color="orange" size="md" radius="sm">{ev.slotsRemaining} slots left</Badge>}
        </div>
      </div>
      <div className='text-center'>
        <p className="text-2xl font-bold leading-snug text-slate-900 sm:text-3xl dark:text-slate-50">
          {ev.title}
        </p>
        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
          Listed on {formatDate(ev.createdAt)}
        </p>
      </div>
      {/* ── MAIN CONTENT ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* LEFT — details */}

        <div className="space-y-6 lg:col-span-2">

          {/* Title */}


          {/* Quick meta */}
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
            <Paper withBorder radius="md" p="md" className="shadow-sm">
              <Group gap="sm" wrap="nowrap">
                <ThemeIcon variant="light" color="blue" radius="md" size={36}>
                  <Calendar size={18} />
                </ThemeIcon>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Starts</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                    {formatDateTime(ev.startsAt)}
                  </p>
                </div>
              </Group>
            </Paper>

            <Paper withBorder radius="md" p="md" className="shadow-sm">
              <Group gap="sm" wrap="nowrap">
                <ThemeIcon variant="light" color="indigo" radius="md" size={36}>
                  <CalendarCheck size={18} />
                </ThemeIcon>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Ends</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                    {formatDateTime(ev.endsAt)}
                  </p>
                </div>
              </Group>
            </Paper>

            {ev.locationId && (
              <Paper withBorder radius="md" p="md" className="shadow-sm">
                <Group gap="sm" wrap="nowrap">
                  <ThemeIcon variant="light" color="teal" radius="md" size={36}>
                    <MapPin size={18} />
                  </ThemeIcon>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Location</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                      {ev.locationId}
                    </p>
                  </div>
                </Group>
              </Paper>
            )}

            <Paper withBorder radius="md" p="md" className="shadow-sm">
              <Group gap="sm" wrap="nowrap">
                <ThemeIcon variant="light" color="grape" radius="md" size={36}>
                  <Users size={18} />
                </ThemeIcon>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Capacity</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                    {ev.slotsRemaining} / {ev.capacity} slots remaining
                  </p>
                </div>
              </Group>
            </Paper>
          </SimpleGrid>

          {/* Slots progress bar */}
          <div>
            <Group justify="space-between" mb={6}>
              <span className="text-xs text-slate-500 dark:text-slate-400">Booking progress</span>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{slotsPercent}% booked</span>
            </Group>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className={`h-full rounded-full transition-all ${slotsPercent >= 90 ? 'bg-red-500' : slotsPercent >= 70 ? 'bg-orange-400' : 'bg-blue-500'
                  }`}
                style={{ width: `${slotsPercent}%` }}
              />
            </div>
          </div>

          <Divider />

          {/* Description */}
          {ev.description && (
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
                About this event
              </p>
              <div className="space-y-3">
                {ev.description.split('\n\n').map((para, i) => (
                  <p key={i} className="text-sm leading-7 text-slate-600 dark:text-slate-400">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* RIGHT — booking card */}
        <div className="lg:col-span-1">
          <Paper withBorder radius="lg" p="lg" className="sticky top-6 shadow-sm">
            <Stack gap="md">

              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Price per ticket</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                  {ev.price === 0 ? 'Free' : `KES ${ev.price.toLocaleString()}`}
                </p>
              </div>

              <Divider />

              <Stack gap="xs">
                <Group gap={8} wrap="nowrap">
                  <Tag size={13} className="shrink-0 text-slate-400" />
                  <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                    {ev.category ?? 'General'}
                  </span>
                </Group>
                <Group gap={8} wrap="nowrap">
                  <Clock size={13} className="shrink-0 text-slate-400" />
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {formatDate(ev.startsAt)}
                  </span>
                </Group>
                <Group gap={8} wrap="nowrap">
                  <Users size={13} className="shrink-0 text-slate-400" />
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {isSoldOut ? 'No slots remaining' : `${ev.slotsRemaining} slots left`}
                  </span>
                </Group>
              </Stack>

              <Divider />

              <Button
                fullWidth
                radius="md"
                color="blue"
                size="md"
                leftSection={<Ticket size={16} />}
                disabled={isSoldOut || isCancelled}
              >
                {isCancelled ? 'Event cancelled' : isSoldOut ? 'Sold out' : 'Book now'}
              </Button>

              {isLowStock && !isSoldOut && (
                <p className="text-center text-xs text-orange-500">
                  Only {ev.slotsRemaining} slots remaining — book soon!
                </p>
              )}

            </Stack>
          </Paper>
        </div>

      </div>
    </div>
  )
}