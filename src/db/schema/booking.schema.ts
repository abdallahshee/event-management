import { uuid, pgTable, numeric, text, timestamp, unique } from "drizzle-orm/pg-core";
import { profile } from "./profile.schema";
import { relations } from "drizzle-orm";
import { payment } from "./payment.schema";
import { nanoid } from 'nanoid'
import { event } from "./event.schema";
import { SupportedBookingStatus } from "../utils";

export const booking = pgTable('booking', {
  id: text('id').primaryKey().notNull().$default(() => nanoid(16)),
  userId: uuid('user_id').notNull().references(() => profile.id),
  amount:numeric('price', { precision: 10, scale: 2,mode:"number" }).notNull(),
  eventId: text('event_id').notNull().references(()=>event.id),
  status: text('status', { enum:SupportedBookingStatus }).default('pending').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().$onUpdate(() => new Date()),
}
// , (table) => ({
//   uniqueUserEvent: unique('unique_user_event').on(table.eventId, table.userId)
// }
// )
)

export const bookingRelations = relations(booking, ({ one }) => ({
  user: one(profile, { fields: [booking.userId], references: [profile.id] }),
  event: one(event, {
    fields: [booking.eventId],
    references: [event.id]
  }),  // events are accessed through here
  payment: one(payment, { fields: [booking.id], references: [payment.bookingId] }),
}))