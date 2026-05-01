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
import { PaginatorSchema, SupportedCurrencies, SupportedProviders } from "../utils";

export const CreatePaymentSchema = createInsertSchema(payment, {
  bookingId: z.string().nonempty(),
  eventId: z.string().nonempty(),
  userId: z.string().nonempty(),
  amount: z.number().min(1, "Amount must be greater than 0"),
  currency: z.enum(SupportedCurrencies, { message: "Unsupported currency" }).default('USD'),
  provider: z.enum(SupportedProviders, { message: "Unsupported payment provider" }),
  referenceNumber: z.string().min(1, "Transaction ID is required"),
})
  .pick({
    bookingId: true,
    amount: true,
    eventId: true,
    currency: true,
    provider: true,
    referenceNumber: true,
    userId: true

  })
export type CreatePaymentRequest = z.infer<typeof CreatePaymentSchema>


export const GetPaymentsSchema = z.object({
  paginator: PaginatorSchema,
  provider: z.enum(SupportedProviders, "Invalid Payment Provider")
})
export type GetPaymentsRequest = z.infer<typeof GetPaymentsSchema>


export const GetUserPaymentsSchema = GetPaymentsSchema.extend({
  userId:z.string().min(1)
})
  

export type GetUserPaymentsRequest = z.infer<typeof GetUserPaymentsSchema>
