import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/events/$eventId')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
  <div>Hello "/events/$eventId/details"!
    <Outlet/>
  </div>
)
}
