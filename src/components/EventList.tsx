import { GetEventsQueryOption } from "#/db/queries/event.queries"
import type { EventCategory } from "#/db/validations/event.validation"
import { Group, Pagination, SimpleGrid } from "@mantine/core"
import { useSuspenseQuery } from "@tanstack/react-query"
import { EventCard } from "./EventCard"
import { FeaturedEvents } from "#/routes"
export const PAGE_SIZE = 6
export type Category = 'all' | NonNullable<EventCategory>

export function EventsList({
  page,
  debouncedSearch,
  dateRange,
  activeCategory,
  hasFilters,
  onPageChange,
}: {
  page:            number
  debouncedSearch: string
  dateRange:       [string | null, string | null]
  activeCategory:  Category
  hasFilters:      boolean
  onPageChange:    (p: number) => void
}) {
  const { data: eventsResponse } = useSuspenseQuery(
    GetEventsQueryOption({ page, limit: PAGE_SIZE })
  )

  const allEvents = eventsResponse?.data ?? []
  const meta      = eventsResponse?.meta

  const filtered = allEvents.filter(e => {
    const matchesSearch =
      e.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      (e.location?.name ?? '').toLowerCase().includes(debouncedSearch.toLowerCase())

    const matchesCategory = activeCategory === 'all' || e.category === activeCategory

    const [start, end] = dateRange
    const matchesDate =
      !start && !end  ? true
      : start && !end ? e.startsAt >= start
      : !start && end ? e.endsAt   <= end
      :                 e.startsAt >= start! && e.endsAt <= end!

    return matchesSearch && matchesCategory && matchesDate && e.status === 'published'
  })

  const featuredEvents = allEvents
    .filter(e => e.isFeatured && e.status === 'published')
    .slice(0, 5)

  return (
    <>
      {/* ── FEATURED ROW ── */}
      {featuredEvents.length > 0 && !hasFilters && (
        <FeaturedEvents events={featuredEvents} />
      )}

      {/* ── RESULTS BAR ── */}
      <Group justify="space-between" align="center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {meta ? `Showing ${allEvents.length} of ${meta.total} event${meta.total !== 1 ? 's' : ''}` : ''}
        </p>
      </Group>

      {/* ── GRID ── */}
      {filtered.length === 0 ? (
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
            onChange={onPageChange}
            radius="md"
            color="blue"
          />
        </Group>
      )}
    </>
  )
}