import { uuid, pgTable, numeric, text, timestamp } from "drizzle-orm/pg-core";
import { booking } from "./booking.schema";
import { relations } from "drizzle-orm";
import { nanoid } from "nanoid";

export const payment = pgTable('payment', {
  id: text('id').primaryKey().$default(() => nanoid(16)),
  bookingId: uuid('booking_id').notNull().references(() => booking.id),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').notNull().default('USD'),
  provider: text('provider').notNull(),           // 'stripe' | 'mpesa' | etc.
  transactionId: text('transaction_id'),             // provider's transaction ID
  status: text('status', { enum: ['pending', 'paid', 'refunded'] }).default('pending').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().$onUpdate(() => new Date()),
})

export const paymentRelations = relations(payment, ({ one }) => ({
  booking: one(booking, { fields: [payment.bookingId], references: [booking.id] }),
}))