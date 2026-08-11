'use client'

import { Badge, Button, Group, Paper, Stack } from '@mantine/core'
import Link from 'next/link'
import { useState } from 'react'
import { ChevronLeft, ChevronRight, Clock, ImageOff, MapPin, Users } from 'lucide-react'
import { getCategoryColor, type EventItem } from '#/components/event-card'

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
                <Link href={`/events/${ev.slug}`}>
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
