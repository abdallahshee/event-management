import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/account/forgot-password')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/account/forgot-password"!</div>
}
