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

export const GetPaymentsSchema=z.object({
  page:z.number().nullable(),
  limit:z.number().nullable(),
  provider:z.string().nullable()
})

export const CreatePaymentSchema = createInsertSchema(payment, {
  bookingId: z.string(),
  userId:z.string(),
  amount: z.number().min(1, "Amount must be greater than 0"),
  currency: z.enum(supportedCurrencies, { message: "Unsupported currency" }).default('USD'),
  provider: z.enum(supportedProviders, { message: "Unsupported payment provider" }),
  referenceNumber: z.string().min(1, "Transaction ID is required"),
})
.pick({
  bookingId: true,
  amount: true,
  currency: true,
  provider: true,
  referenceNumber: true,
  userId:true
  
})

export type CreatePaymentRequest = z.infer<typeof CreatePaymentSchema>