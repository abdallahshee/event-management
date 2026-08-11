'use client'

import { Button, Paper } from '@mantine/core'
import { AlertTriangle } from 'lucide-react'

export default function Error({ reset }: { error: Error & { digest?: string }, reset: () => void }) {
  return (
    <div className="flex min-h-[400px] items-center justify-center py-10">
      <Paper withBorder radius="lg" p="xl" className="max-w-md text-center shadow-sm">
        <AlertTriangle size={32} className="mx-auto mb-3 text-red-500" />
        <p className="font-semibold text-slate-900 dark:text-slate-50">Something went wrong</p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          We couldn't load this page. Please try again.
        </p>
        <Button mt="lg" color="blue" onClick={reset}>Try again</Button>
      </Paper>
    </div>
  )
}
