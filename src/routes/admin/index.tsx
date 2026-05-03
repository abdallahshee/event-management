import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/')({
  loader:async({context})=>{
    // await context.queryClient.prefetchQuery(GetEvents)
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/"!</div>
}
