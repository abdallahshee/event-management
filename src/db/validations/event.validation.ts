import { createInsertSchema } from "drizzle-zod"
import { event } from "../schema"
import z from "zod"

export const EventSchema = createInsertSchema(event, {
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title too long"),
  description: z.string().max(1000, "Description too long").optional(),
  location: z.string().min(2, "Location is required").max(200).optional(),
  price: z.coerce.number().min(0, "Price cannot be negative").default(0),
  capacity: z.coerce.number().int().min(1, "Capacity must be at least 1"),
  slotsRemaining: z.coerce.number().int().min(0, "Slots cannot be negative"),
  startsAt: z.string().datetime({ message: "Invalid start date" }),
  endsAt: z.string().datetime({ message: "Invalid end date" }),
  coverImage: z.string().url("Invalid image URL").optional(),
  category: z.string().min(1, "Category is required").optional(),
  isFeatured: z.boolean().default(false),
})
.pick({
  title: true,
  description: true,
  coverImage: true,
  category: true,
  location: true,
  isFeatured: true,
  price: true,
  capacity: true,
  slotsRemaining: true,
  startsAt: true,
  endsAt: true,
})
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

export type EventRequest = z.infer<typeof EventSchema>