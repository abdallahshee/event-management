import { GetEventsFn } from '#/server/functions/event.functions'
import { PAGE_SIZE } from '#/db/utils'
import { HomePage } from '#/components/home-page'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageParam } = await searchParams
  const page = Math.max(1, Number(pageParam) || 1)
  const eventsResponse = await GetEventsFn({ page, limit: PAGE_SIZE })

  return <HomePage eventsResponse={eventsResponse} page={page} />
}
