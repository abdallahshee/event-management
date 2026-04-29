// export const booking = pgTable('booking', {
//   id:          text('id').primaryKey().$default(()=>nanoid(16)),
//   userId:      uuid('user_id').notNull().references(() => profile.id),
//   totalAmount: numeric('total_amount', { precision: 10, scale: 2 }).notNull(),
//   status:      text('status', { enum: ['pending', 'confirmed', 'cancelled'] }).default('pending').notNull(),
//   createdAt:   timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
//   updatedAt:   timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().$onUpdate(() => new Date()),
// })

import { createInsertSchema } from "drizzle-zod";
import { booking } from "../schema";
import z from "zod"

export const BookingSchema = createInsertSchema(booking, {
  totalAmount: z.coerce.number().min(0, "Total amount cannot be negative"),
})
.pick({
  totalAmount: true,
})

export type BookingRequest = z.infer<typeof BookingSchema>