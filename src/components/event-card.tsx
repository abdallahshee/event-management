import type { EventCategory } from "#/db/validations/event.validation"
import { Badge, Button, Card, Group, Stack } from "@mantine/core"
import Link from "next/link"
import { Clock, ImageOff, MapPin, Users } from "lucide-react"

const CATEGORY_COLORS: Record<NonNullable<EventCategory>, string> = {
  music:    'violet',
  tech:     'blue',
  food:     'orange',
  sports:   'green',
  arts:     'pink',
  business: 'cyan',
}


export const getCategoryColor = (category: EventCategory): string =>
  category ? CATEGORY_COLORS[category] : 'gray'

export type EventItem = {
  id:             string
  title:          string
  slug:           string
  type:           'free' | 'paid'
  description:    string | null
  coverImage:     string | null
  category:       EventCategory
  price:          number
  capacity:       number
  slotsRemaining: number
  startsAt:       string
  endsAt:         string
  status:         string | null
  isFeatured:     boolean
  locationId:     string | null
  location:       { name: string } | null
}
export function EventCard({ event }: { event: EventItem }) {
  const isSoldOut  = event.slotsRemaining === 0
  const isLowStock = event.slotsRemaining > 0 && event.slotsRemaining <= 10
  const price      = typeof event.price === 'number' ? event.price : parseFloat(event.price as any)
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <Card withBorder radius="md" p={0} className="flex flex-col overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <Link href={`/events/${event.slug}`} className="contents">
        <div className="relative h-40 w-full shrink-0 bg-slate-100 dark:bg-slate-800">
          {event.coverImage ? (
            <img src={event.coverImage} alt={event.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ImageOff size={28} className="text-slate-300 dark:text-slate-600" />
            </div>
          )}
          <div className="absolute left-3 top-3 flex gap-1.5">
            {isSoldOut  && <Badge variant="filled" color="red"    size="sm" radius="sm">Sold out</Badge>}
            {isLowStock && <Badge variant="filled" color="orange" size="sm" radius="sm">{event.slotsRemaining} left</Badge>}
            {event.type === 'free' && !isSoldOut && (
              <Badge variant="filled" color="green" size="sm" radius="sm">Free</Badge>
            )}
          </div>
        </div>

        <Stack gap="xs" p="md" className="flex-1">
          {event.category && (
            <Badge
              variant="light"
              color={getCategoryColor(event.category)}
              size="sm"
              radius="sm"
              className="w-fit capitalize"
            >
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
          {event.type === 'free' || price === 0
            ? <Badge color="green" variant="light">Free</Badge>
            : `KES ${price.toLocaleString()}`
          }
        </p>
        <Group gap="xs">
          <Link href={`/events/${event.slug}`}>
            <Button size="xs" radius="md" color="blue" variant="light">Details</Button>
          </Link>
          <Button
            size="xs"
            radius="md"
            color="blue"
            variant={isSoldOut ? 'outline' : 'filled'}
            disabled={isSoldOut}
          >
            {isSoldOut ? 'Sold out' : event.type === 'free' ? 'Register' : 'Book now'}
          </Button>
        </Group>
      </Group>
    </Card>
  )
}
