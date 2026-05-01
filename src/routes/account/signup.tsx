import { createFileRoute, Link } from '@tanstack/react-router'
import { useForm, schemaResolver } from '@mantine/form'
import { TextInput, PasswordInput, Button, Paper, Divider, Stack, Group, Checkbox } from '@mantine/core'
import { useState } from 'react'
import { SignUpSchema, type SignUpRequest } from '#/db/validations/profile.validation'
import { getSupabaseBrowserClient } from '#/db/supabase/browserClient'
import { Alert } from '@mantine/core'
import { AlertCircle } from 'lucide-react'
import z from "zod"
export const Route = createFileRoute('/account/signup')({
  component: SignUpPage,
})

function SignUpPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const form = useForm<SignUpRequest & { terms: boolean }>({
    validate: schemaResolver(SignUpSchema.and(
      z.object({ terms: z.literal(true, { error: () => ({ message: 'You must agree to the terms' }) }) })
    ), { sync: true }),
    validateInputOnBlur: true,
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  })

  const handleSubmit = async (values: SignUpRequest) => {
    setLoading(true)
    setError(null)

    const { error: signUpError } = await getSupabaseBrowserClient().auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          first_name: values.firstName,
          last_name: values.lastName,
        },
      },
    })

    setLoading(false)

    if (signUpError) {
      setError(signUpError.message)
      return
    }

    setSuccess(true)
  }

  if (success) {
    return (
      <Paper withBorder radius="lg" p="xl" className="text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <svg className="h-7 w-7 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">Check your email</p>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          We sent a confirmation link to <strong>{form.values.email}</strong>. Click it to activate your account.
        </p>
        <Link to="/account">
          <Button variant="subtle" color="blue" mt="lg" fullWidth>
            Back to sign in
          </Button>
        </Link>
      </Paper>
    )
  }

  return (
    <>
      {/* Header */}
      <div className="mb-8 text-center">
        <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Create your account
        </p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <Link to="/account" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
            Sign in
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
              label="First name"
              placeholder="Abdallah"
              radius="md"
              {...form.getInputProps('firstName')}
            />
            <TextInput
              label="Last name"
              placeholder="Shee"
              radius="md"
              {...form.getInputProps('lastName')}
            />
            <TextInput
              label="Email address"
              placeholder="you@example.com"
              type="email"
              radius="md"
              {...form.getInputProps('email')}
            />

            <PasswordInput
              label="Password"
              placeholder="Min. 8 characters"
              radius="md"
              {...form.getInputProps('password')}
            />

            <PasswordInput
              label="Confirm password"
              placeholder="Repeat your password"
              radius="md"
              {...form.getInputProps('confirmPassword')}
            />

            <Divider />

            <Checkbox
              size="sm"
              {...form.getInputProps('terms', { type: 'checkbox' })}
              label={
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  I agree to the{' '}
                  <a href="/terms" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="/privacy" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                    Privacy Policy
                  </a>
                </span>
              }
            />

            <Button
              type="submit"
              fullWidth
              radius="md"
              color="blue"
              loading={loading}
              mt="xs"
            >
              Create account
            </Button>
            {/* <span className="text-sm text-slate-600 dark:text-slate-400 flex justify-between">
              <span>
                Already have an account?{' '}</span>
              <Link to="/account" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                Sign in
              </Link>
            </span> */}
          </Stack>
        </form>
      </Paper>
    </>
  )
}