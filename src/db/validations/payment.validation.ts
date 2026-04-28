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

import { createSelectSchema } from "drizzle-zod";
import { payment } from "../schema";

export const PaymentSchema=createSelectSchema(payment,{

}).pick({
    bookingId:true,
    amount:true,
    currency:true,
    provider:true,
    transactionId:true,
})