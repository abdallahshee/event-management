import {  createSelectSchema } from "drizzle-zod"
import { event } from "../schema"

import z from "zod"
import type { InferSelectModel } from "drizzle-orm"
import { CreateLocationSchema } from "./location.validation"
import { SupportedEventCategories, SupportedEventTypes } from "../utils"

const EventSchema = createSelectSchema(event, {
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title too long"),
  type: z.enum(SupportedEventTypes, "Invalid Event Type"),
  description: z.string().max(1000, "Description too long").nonempty(),
  price: z.number().min(0, "Price cannot be negative").default(0),
  capacity: z.number().int().min(1, "Capacity must be at least 1"),
  startsAt: z.string().min(1, "Invalid start date"),
  endsAt: z.string().min(1, "Invalid end date"),
  coverImage: z.url("Invalid image URL").optional(),
  locationId: z.string().optional(),
  
  category: z.enum(SupportedEventCategories, "Invalid Event Category").optional(),
  isFeatured: z.boolean().default(false),
})


export const CreateEventSchema = EventSchema.pick({
  title: true,
  type: true,
  description: true,
  coverImage: true,
  category: true,
  isFeatured: true,
  price: true,
  capacity: true,
  startsAt: true,
  endsAt: true,
  locationId: true,
}).extend({ location: CreateLocationSchema })
  .refine(data => data.endsAt > data.startsAt, {
    message: "End date must be after start date",
    path: ["endsAt"],
  })
  .refine(data => new Date(data.startsAt) > new Date(), {
    message: "Start date must be in the future",
    path: ["startsAt"],
  })
export type CreateEventRequest = z.infer<typeof CreateEventSchema>


export const UpdateEventSchema = CreateEventSchema.extend({
  slug: z.string().min(1)
})
export type UpdateEventRequest = z.infer<typeof UpdateEventSchema>


export type Event = InferSelectModel<typeof event>
export type EventCategory = Event['category']