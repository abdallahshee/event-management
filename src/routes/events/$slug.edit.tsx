import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/events/$slug/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/events/$eventId/edit"!</div>
}
