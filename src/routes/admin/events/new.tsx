import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import {
  TextInput, Textarea, Select, NumberInput, Switch,
  Button, Group, Stack, Paper, Stepper, Badge,
  FileInput, Divider, Alert, Tooltip,
} from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import '@mantine/dates/styles.css'
import { schemaResolver, useForm } from '@mantine/form'
import {
  CalendarDays, MapPin, Tag, Info, ImagePlus,
  DollarSign, Users, ChevronRight, ChevronLeft,
  CheckCircle, Sparkles, Globe, Lock, AlertCircle,
} from 'lucide-react'
import { useState } from 'react'
import { CreateEventSchema, type CreateEventRequest } from '#/db/validations/event.validation'
import { SupportedEventCategories, SupportedEventTypes } from '#/db/utils'
import { CreateEventMutationOption } from '#/db/queries/event.queries'

export const Route = createFileRoute('/admin/events/new')({
  component: CreateEventPage,
})

// ── Step definitions ──────────────────────────────────────
const STEPS = [
  { label: 'Basics',    description: 'Title, type & category' },
  { label: 'Details',   description: 'Description & image'    },
  { label: 'Schedule',  description: 'Dates & capacity'       },
  { label: 'Location',  description: 'Where it happens'       },
  { label: 'Review',    description: 'Confirm & publish'      },
]

// ── Category options ──────────────────────────────────────
const CATEGORY_OPTIONS = SupportedEventCategories.map(c => ({
  value: c,
  label: c.charAt(0).toUpperCase() + c.slice(1),
}))

const TYPE_OPTIONS = SupportedEventTypes.map(t => ({
  value: t,
  label: t.charAt(0).toUpperCase() + t.slice(1),
}))

const CATEGORY_COLORS: Record<string, string> = {
  music: 'violet', tech: 'blue', food: 'orange',
  sports: 'green', arts: 'pink', business: 'cyan',
}

// ── Review row helper ─────────────────────────────────────
function ReviewRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <span className="text-sm text-slate-500 dark:text-slate-400 shrink-0 w-32">{label}</span>
      <span className="text-sm font-medium text-slate-900 dark:text-slate-50 text-right">{value || '—'}</span>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────
function CreateEventPage() {
  const [active, setActive]   = useState(0)
  const [loading, setLoading] = useState(false)
  const router=useRouter()
  const createEventMut=CreateEventMutationOption()
  const form = useForm<CreateEventRequest>({
   validate: schemaResolver(CreateEventSchema, { sync: true }),
    validateInputOnBlur: true,
    initialValues: {
      title:       '',
      type:        'free',
      description: '',
      coverImage:  undefined,
      category:    undefined,
      isFeatured:  false,
      price:       0,
      capacity:    1,
      startsAt:    '',
      endsAt:      '',
      locationId:  undefined,
      location: {
        name:    '',
        coordinates: {
            x:0,
            y:0
        },
        city:    '',
      },
    },
  })

  // ── Step field validation before proceeding ──
  const STEP_FIELDS: Record<number, (keyof CreateEventRequest)[]> = {
    0: ['title', 'type', 'category'],
    1: ['description'],
    2: ['startsAt', 'endsAt', 'capacity', 'price'],
    3: ['location'],
  }

  const nextStep = () => {
    const fields = STEP_FIELDS[active]
    if (fields) {
      const result = form.validate()
      const hasErrors = fields.some(f => result.errors[f])
      if (hasErrors) return
    }
    setActive(s => Math.min(s + 1, STEPS.length - 1))
  }

  const prevStep = () => setActive(s => Math.max(s - 1, 0))

  const handleSubmit = form.onSubmit(async (values) => {
    setLoading(true)
    try {
      // call your server function here
      // await createEventFn({ data: values })
      await createEventMut.mutateAsync(values)
      console.log('Submitting:', values)
      await router.navigate({ to: '/events' })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  })

  const formatDate = (d: string) =>
    d ? new Date(d).toLocaleDateString('en-KE', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    }) : '—'

  return (
    <div className="mx-auto max-w-3xl space-y-6 py-8 px-4">

      {/* ── Header ── */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <CalendarDays size={22} className="text-blue-500" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Create Event</h1>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Fill in the details below to publish your event
        </p>
      </div>

      {/* ── Stepper ── */}
      <Stepper active={active} size="sm" radius="md" color="blue">
        {STEPS.map((step) => (
          <Stepper.Step
            key={step.label}
            label={step.label}
            description={step.description}
          />
        ))}
      </Stepper>

      {/* ── Form ── */}
      <form onSubmit={handleSubmit}>
        <Paper withBorder radius="lg" p="xl" className="shadow-sm">

          {/* ── STEP 0: Basics ── */}
          {active === 0 && (
            <Stack gap="md">
              <div className="flex items-center gap-2 mb-1">
                <Tag size={16} className="text-blue-500" />
                <p className="font-semibold text-slate-900 dark:text-slate-50">Event Basics</p>
              </div>

              <TextInput
                label="Event Title"
                placeholder="e.g. Nairobi Tech Summit 2026"
                required
                {...form.getInputProps('title')}
              />

              <Group grow>
                <Select
                  label="Event Type"
                  placeholder="Select type"
                  data={TYPE_OPTIONS}
                  required
                  {...form.getInputProps('type')}
                />
                <Select
                  label="Category"
                  placeholder="Select category"
                  data={CATEGORY_OPTIONS}
                  clearable
                  {...form.getInputProps('category')}
                />
              </Group>

              {/* Free/Paid toggle visual hint */}
              <Alert
                icon={<Info size={16} />}
                color={form.values.type === 'free' ? 'green' : 'blue'}
                radius="md"
                variant="light"
              >
                {form.values.type === 'free'
                  ? 'Free events allow anyone to register at no cost.'
                  : 'Paid events require attendees to pay before confirming their spot.'
                }
              </Alert>

              <Divider />

              <div className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-50">Feature this event</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Featured events appear prominently on the homepage
                  </p>
                </div>
                <Tooltip label="Admin approval may be required" position="left" withArrow>
                  <Switch
                    color="blue"
                    {...form.getInputProps('isFeatured', { type: 'checkbox' })}
                  />
                </Tooltip>
              </div>
            </Stack>
          )}

          {/* ── STEP 1: Details ── */}
          {active === 1 && (
            <Stack gap="md">
              <div className="flex items-center gap-2 mb-1">
                <Info size={16} className="text-blue-500" />
                <p className="font-semibold text-slate-900 dark:text-slate-50">Event Details</p>
              </div>

              <Textarea
                label="Description"
                placeholder="Tell attendees what your event is about..."
                required
                minRows={5}
                maxRows={10}
                autosize
                description={`${form.values.description.length} / 1000 characters`}
                {...form.getInputProps('description')}
              />

              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Cover Image URL
                  <span className="ml-1 text-xs text-slate-400">(optional)</span>
                </p>
                <TextInput
                  placeholder="https://example.com/image.jpg"
                  leftSection={<ImagePlus size={15} />}
                  {...form.getInputProps('coverImage')}
                />
                {form.values.coverImage && !form.errors.coverImage && (
                  <div className="mt-2 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
                    <img
                      src={form.values.coverImage}
                      alt="Cover preview"
                      className="h-40 w-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                  </div>
                )}
              </div>
            </Stack>
          )}

          {/* ── STEP 2: Schedule & Capacity ── */}
          {active === 2 && (
            <Stack gap="md">
              <div className="flex items-center gap-2 mb-1">
                <CalendarDays size={16} className="text-blue-500" />
                <p className="font-semibold text-slate-900 dark:text-slate-50">Schedule & Capacity</p>
              </div>

              <Group grow>
                <DateTimePicker
                  label="Start Date & Time"
                  placeholder="Pick start date"
                  required
                  minDate={new Date()}
                  valueFormat="DD MMM YYYY HH:mm"
                  {...form.getInputProps('startsAt')}
                />
                <DateTimePicker
                  label="End Date & Time"
                  placeholder="Pick end date"
                  required
                  minDate={form.values.startsAt ? new Date(form.values.startsAt) : new Date()}
                  valueFormat="DD MMM YYYY HH:mm"
                  {...form.getInputProps('endsAt')}
                />
              </Group>

              <Group grow>
                <NumberInput
                  label="Capacity"
                  description="Max number of attendees"
                  placeholder="e.g. 100"
                  required
                  min={1}
                  leftSection={<Users size={15} />}
                  {...form.getInputProps('capacity')}
                />

                <NumberInput
                  label="Price (KES)"
                  description={form.values.type === 'free' ? 'Free events must be 0' : 'Amount per ticket'}
                  placeholder="0"
                  min={0}
                  disabled={form.values.type === 'free'}
                  leftSection={<DollarSign size={15} />}
                  {...form.getInputProps('price')}
                />
              </Group>

              {form.values.type === 'free' && (
                <Alert icon={<Info size={15} />} color="green" variant="light" radius="md">
                  Price is automatically set to 0 for free events.
                </Alert>
              )}
            </Stack>
          )}

          {/* ── STEP 3: Location ── */}
          {active === 3 && (
            <Stack gap="md">
              <div className="flex items-center gap-2 mb-1">
                <MapPin size={16} className="text-blue-500" />
                <p className="font-semibold text-slate-900 dark:text-slate-50">Event Location</p>
              </div>

              <TextInput
                label="Venue Name"
                placeholder="e.g. KICC, Nairobi"
                required
                leftSection={<MapPin size={15} />}
                {...form.getInputProps('location.name')}
              />
{/* 
              <TextInput
                label="Address"
                placeholder="e.g. City Square, Nairobi"
                leftSection={<Globe size={15} />}
                {...form.getInputProps('location.address')}
              /> */}

              <TextInput
                label="City"
                placeholder="e.g. Nairobi"
                {...form.getInputProps('location.city')}
              />
            </Stack>
          )}

          {/* ── STEP 4: Review ── */}
          {active === 4 && (
            <Stack gap="md">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle size={16} className="text-blue-500" />
                <p className="font-semibold text-slate-900 dark:text-slate-50">Review & Publish</p>
              </div>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Please review your event details before publishing.
              </p>

              <Paper withBorder radius="md" p="md" className="bg-slate-50 dark:bg-slate-900/50">
                <Stack gap={0}>
                  <ReviewRow label="Title"       value={form.values.title} />
                  <ReviewRow
                    label="Type"
                    value={
                      <Badge color={form.values.type === 'free' ? 'green' : 'blue'} variant="light" size="sm">
                        {form.values.type}
                      </Badge>
                    }
                  />
                  <ReviewRow
                    label="Category"
                    value={
                      form.values.category
                        ? <Badge color={CATEGORY_COLORS[form.values.category] ?? 'gray'} variant="light" size="sm">
                            {form.values.category}
                          </Badge>
                        : '—'
                    }
                  />
                  <ReviewRow label="Description" value={
                    <span className="line-clamp-2">{form.values.description}</span>
                  } />
                  <ReviewRow label="Starts"      value={formatDate(form.values.startsAt)} />
                  <ReviewRow label="Ends"        value={formatDate(form.values.endsAt)} />
                  <ReviewRow label="Capacity"    value={`${form.values.capacity} attendees`} />
                  <ReviewRow
                    label="Price"
                    value={form.values.type === 'free' ? 'Free' : `KES ${Number(form.values.price).toLocaleString()}`}
                  />
                  <ReviewRow label="Venue"       value={form.values.location?.name} />
                  {/* <ReviewRow label="Address"     value={form.values.location?.} /> */}
                  <ReviewRow label="City"        value={form.values.location?.city} />
                  <ReviewRow
                    label="Featured"
                    value={
                      <Badge color={form.values.isFeatured ? 'yellow' : 'gray'} variant="light" size="sm">
                        {form.values.isFeatured ? 'Yes' : 'No'}
                      </Badge>
                    }
                  />
                  {form.values.coverImage && (
                    <ReviewRow
                      label="Cover Image"
                      value={
                        <img
                          src={form.values.coverImage}
                          alt="cover"
                          className="h-16 w-24 rounded-md object-cover"
                        />
                      }
                    />
                  )}
                </Stack>
              </Paper>

              {Object.keys(form.errors).length > 0 && (
                <Alert icon={<AlertCircle size={16} />} color="red" radius="md" variant="light">
                  Please go back and fix the errors before publishing.
                </Alert>
              )}
            </Stack>
          )}

        </Paper>

        {/* ── Navigation ── */}
        <Group justify="space-between" mt="lg">
          <Button
            variant="subtle"
            color="gray"
            leftSection={<ChevronLeft size={16} />}
            onClick={prevStep}
            disabled={active === 0}
          >
            Back
          </Button>

          {active < STEPS.length - 1 ? (
            <Button
              color="blue"
              rightSection={<ChevronRight size={16} />}
              onClick={nextStep}
            >
              Continue
            </Button>
          ) : (
            <Button
              type="submit"
              color="blue"
              loading={loading}
              leftSection={<Sparkles size={16} />}
            >
              Publish Event
            </Button>
          )}
        </Group>
      </form>
    </div>
  )
}