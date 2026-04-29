import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/account')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  )
}