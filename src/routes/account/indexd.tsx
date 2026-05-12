import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/account/indexd')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/account/"!</div>
}
