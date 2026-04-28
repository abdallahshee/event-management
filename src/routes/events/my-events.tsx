import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/events/my-events')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/events/my-events"!</div>
}
