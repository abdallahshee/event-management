
// export const bookingItem = pgTable('booking_item', {
//     id: text('id').primaryKey().$default(() => nanoid(16)),
//     bookingId: uuid('booking_id').notNull().references(() => booking.id),
//     eventId: uuid('event_id').notNull().references(() => event.id),
//     quantity: integer('quantity').notNull().default(1),
//     unitPrice: numeric('unit_price', { precision: 10, scale: 2 }).notNull(), // price at time of booking
// })

import { createInsertSchema } from "drizzle-zod";
import { bookingItem } from "../schema";
import z from "zod"

export const BookingItemSchema = createInsertSchema(bookingItem, {
  eventId: z.string().uuid("Invalid event ID"),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1").max(100, "Quantity cannot exceed 100"),
  unitPrice: z.coerce.number().min(0, "Price cannot be negative"),
})
.pick({
  eventId: true,
  quantity: true,
  unitPrice: true,
})

export type BookingItemRequest = z.infer<typeof BookingItemSchema>