import { Outlet } from '@tanstack/react-router'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/events')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
    <div>
        <h1>CREATE EVENT PAGE</h1>
        <Outlet />
    </div>)
}
