import { createInsertSchema } from "drizzle-zod"
import { event } from "../schema"

import z from "zod"
import type { InferSelectModel } from "drizzle-orm"
import { CreateLocationSchema } from "./location.validation"

export const CreateEventSchema = createInsertSchema(event, {
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title too long"),
  description: z.string().max(1000, "Description too long").optional(),
  price: z.number().min(0, "Price cannot be negative").default(0),
  capacity: z.number().int().min(1, "Capacity must be at least 1"),
  slotsRemaining: z.number().int().min(0, "Slots cannot be negative"),
  startsAt: z.string().min(1,"Invalid start date" ),
  endsAt: z.string().min(1,"Invalid end date" ),
  coverImage: z.url("Invalid image URL").optional(),
  locationId: z.string().optional(),
  category: z.enum(['music', 'tech', 'food', 'sports', 'arts', 'business'],"thereyy"),
  isFeatured: z.boolean().default(false),
})
  .pick({
    title: true,
    description: true,
    coverImage: true,
    category: true,
    isFeatured: true,
    price: true,
    capacity: true,
    slotsRemaining: true,
    startsAt: true,
    endsAt: true,
    locationId: true
  }).extend({ location: CreateLocationSchema })
  .refine(data => data.endsAt > data.startsAt, {
    message: "End date must be after start date",
    path: ["endsAt"],
  })
  .refine(data => new Date(data.startsAt) > new Date(), {
    message: "Start date must be in the future",
    path: ["startsAt"],
  })
  .refine(data => data.slotsRemaining <= data.capacity, {
    message: "Slots remaining cannot exceed capacity",
    path: ["slotsRemaining"],
  })
  export type CreateEventRequest = z.infer<typeof CreateEventSchema>


  export const UpdateEventSchema=CreateEventSchema
  export type UpdateEventRequest=z.infer<typeof CreateEventSchema>


  export type Event = InferSelectModel<typeof event>