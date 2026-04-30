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

export const CreateBookingSchema = createInsertSchema(booking, {
  eventId: z.string().min(1),
  userId:z.string().min(1),
  amount:z.number().min(1)
})
.pick({
  eventId: true,
  userId:true,
  amount:true
})

export type UpdateBookingRequest = z.infer<typeof CreateBookingSchema>