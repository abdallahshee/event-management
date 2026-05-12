import { pgTable, numeric, text, timestamp, uuid, unique, index } from "drizzle-orm/pg-core";
import { ticket } from "./ticket.schema";
import { relations } from "drizzle-orm";
import { profile } from "./profile.schema";
import { event } from "./event.schema";
import { SupportedCurrencies, SupportedPaymentStatus, SupportedProviders } from "../utils";
// import { nanoid } from "nanoid";

export const payment = pgTable('payment', {
  // id: text('id').primaryKey().$default(() => nanoid(16)),
  userId:uuid("user_id").notNull().references(()=>profile.id),
  ticketId: text('ticket_id').notNull().references(() => ticket.id),
  eventId:text('event_id').notNull().references(()=>event.id),
  amount: numeric('amount', { precision: 10, scale: 2 ,mode:'number'}).notNull(),
  currency: text('currency',{ enum:SupportedCurrencies }).default('USD'),
  provider: text('provider',{ enum:SupportedProviders }),           // 'stripe' | 'mpesa' | etc.
  referenceNumber: text('reference_number').primaryKey().notNull(),             // provider's transaction ID
  status: text('status', { enum: SupportedPaymentStatus }).default('pending'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().$onUpdate(() => new Date()),
},
(table)=>[
  unique("user_payment_reference").on(table.userId, table.eventId),
  index("payment_event_id").on(table.eventId),
  index("payment_user_id").on(table.userId),
]
)

export const paymentRelations = relations(payment, ({ one }) => ({
  event:one(event,{
    fields:[payment.eventId],
    references:[event.id]
  }),
  ticket: one(ticket, { fields: [payment.ticketId], references: [ticket.id] }),
}))