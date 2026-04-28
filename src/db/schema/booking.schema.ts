import { uuid, pgTable, numeric, text, timestamp } from "drizzle-orm/pg-core";
import { profile } from "./profile.schema";
import { relations } from "drizzle-orm";
import { payment } from "./payment.schema";
import { bookingItem } from "./booking-item.schema";
import { nanoid } from 'nanoid'

export const booking = pgTable('booking', {
  id: text('id').primaryKey().$default(() => nanoid(16)),
  userId: uuid('user_id').notNull().references(() => profile.id),
  totalAmount: numeric('total_amount', { precision: 10, scale: 2 }).notNull(),
  status: text('status', { enum: ['pending', 'confirmed', 'cancelled'] }).default('pending').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().$onUpdate(() => new Date()),
})

export const bookingRelations = relations(booking, ({ one, many }) => ({
  user: one(profile, { fields: [booking.userId], references: [profile.id] }),
  bookingItems: many(bookingItem),  // events are accessed through here
  payment: one(payment, { fields: [booking.id], references: [payment.bookingId] }),
}))