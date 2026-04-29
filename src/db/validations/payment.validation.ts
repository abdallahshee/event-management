// export const payment = pgTable('payment', {
//   id: text('id').primaryKey().$default(() => nanoid(16)),
//   bookingId: uuid('booking_id').notNull().references(() => booking.id),
//   amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
//   currency: text('currency').notNull().default('USD'),
//   provider: text('provider').notNull(),           // 'stripe' | 'mpesa' | etc.
//   transactionId: text('transaction_id'),             // provider's transaction ID
//   status: text('status', { enum: ['pending', 'paid', 'refunded'] }).default('pending').notNull(),
//   createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
//   updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().$onUpdate(() => new Date()),
// })

import { createInsertSchema } from "drizzle-zod";
import { payment } from "../schema";
import z from "zod"

const supportedCurrencies = ['USD', 'KES', 'EUR', 'GBP'] as const
const supportedProviders = ['stripe', 'mpesa', 'paypal', 'flutterwave'] as const

export const PaymentSchema = createInsertSchema(payment, {
  bookingId: z.string().uuid("Invalid booking ID"),
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
  currency: z.enum(supportedCurrencies, { message: "Unsupported currency" }).default('USD'),
  provider: z.enum(supportedProviders, { message: "Unsupported payment provider" }),
  transactionId: z.string().min(1, "Transaction ID is required").optional(),
})
.pick({
  bookingId: true,
  amount: true,
  currency: true,
  provider: true,
  transactionId: true,
})

export type PaymentRequest = z.infer<typeof PaymentSchema>