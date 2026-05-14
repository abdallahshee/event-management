import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

import type { ReactNode } from 'react'
import { QueryClient } from '@tanstack/react-query'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
// import TanstackQueryProvider, {
//   getContext,
// } from './integrations/tanstack-query/root-provider'

// export function getRouter() {
//   const context = getContext()

//   const router = createTanStackRouter({
//     routeTree,
//     context:getContext(),
//     scrollRestoration: true,
//     defaultPreload: 'intent',
//     defaultPreloadStaleTime: 0,
//   })

//   setupRouterSsrQueryIntegration({ router, queryClient: context.queryClient })

//   return router
// }

import { getContext } from './integrations/tanstack-query/root-provider'

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,
    context: getContext(),
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
      defaultHashScrollIntoView: { behavior: 'smooth' },

    // defaultErrorComponent: ({ error, reset }) => (
    //   <ErrorComponent error={error} />
    // ),
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
