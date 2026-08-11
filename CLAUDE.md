@AGENTS.md

# Project architecture

Event Manager is a Next.js (App Router) app — Mantine UI, Tailwind CSS, Drizzle ORM, Supabase (auth + Postgres + storage).

TanStack Start/Router/Query were fully removed on 2026-08-11 (commit `fc99fec`). Do not reintroduce `@tanstack/react-query` or a route-tree/`createServerFn` pattern.

- `src/app/**/page.tsx` + `layout.tsx` — App Router routes.
- `src/server/functions/*.ts` — Server Actions (`'use server'`), plain async functions that `Schema.parse(data)` their own input. Called directly, not through a client-side query layer.
- Data flow: a server component (`page.tsx`) awaits the Server Action and passes the result down as props. Client components manage pending/loading state locally with `useState`/`useTransition`, not `useQuery`/`useMutation`.
- `src/db/` — Drizzle schema, Supabase clients (`serverClient.ts` uses `next/headers` `cookies()`, async), Zod validations. No `src/db/queries/` layer anymore.
- `src/proxy.ts` — Next 16's renamed `middleware.ts`, refreshes the Supabase session.
- `src/server/auth.ts` — `getAuthUser()` helper used inline wherever auth is needed (replaces the old TanStack request middleware).
