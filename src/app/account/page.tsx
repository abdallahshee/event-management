'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm, schemaResolver } from '@mantine/form'
import { TextInput, PasswordInput, Button, Paper, Divider, Stack, Alert } from '@mantine/core'
import { useState } from 'react'
import { SignInSchema, type SignInRequest } from '#/db/validations/profile.validation'
import { getSupabaseBrowserClient } from '#/db/supabase/browserClient'
import { AlertCircle } from 'lucide-react'


export default function SignInPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const form = useForm<SignInRequest>({
    validate: schemaResolver(SignInSchema, { sync: true }),
    validateInputOnBlur:true,
    initialValues: {
      email: '',
      password: '',
    },
  })

  const handleSubmit = async (values: SignInRequest) => {
    setLoading(true)
    setError(null)

    const { error: signInError } = await getSupabaseBrowserClient().auth.signInWithPassword({
      email: values.email,
      password: values.password,
    })

    setLoading(false)

    if (signInError) {
      setError(signInError.message)
      return
    }

    router.push('/')
  }

  return (
    <>
      {/* Header */}
      <div className="mb-8 text-center">
        <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Welcome back
        </p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Don't have an account?{' '}
          <Link href="/account/signup" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
            Sign up
          </Link>
        </p>
      </div>

      <Paper withBorder radius="lg" p="xl" className="shadow-sm">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">

            {error && (
              <Alert
                variant="light"
                color="red"
                radius="md"
                icon={<AlertCircle size={16} />}
              >
                <span className="text-sm">{error}</span>
              </Alert>
            )}

            <TextInput
              label="Email address"
              placeholder="you@example.com"
              type="email"
              radius="md"
              {...form.getInputProps('email')}
            />

            <PasswordInput
              label="Password"
              placeholder="Your password"
              radius="md"
              {...form.getInputProps('password')}
            />

            <div className="flex justify-end">
              <Link
                href="/account/forgot-password"
                className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                Forgot password?
              </Link>
            </div>

            <Divider />

            <Button
              type="submit"
              fullWidth
              radius="md"
              color="blue"
              loading={loading}
            >
              Sign in
            </Button>

          </Stack>
        </form>
      </Paper>
    </>
  )
}
