import { uuid, pgTable, numeric, text, timestamp, unique, index } from "drizzle-orm/pg-core";
import { profile } from "./profile.schema";
import { relations } from "drizzle-orm";
import { payment } from "./payment.schema";
import { nanoid } from 'nanoid'
import { event } from "./event.schema";
import { SupportedBookingStatus } from "../utils";

export const ticket = pgTable('ticket', {
  id: text('id').primaryKey().notNull().$default(() => nanoid(16)),
  userId: uuid('user_id').notNull().references(() => profile.id),
  amount:numeric('price', { precision: 10, scale: 2,mode:"number" }).notNull(),
  eventId: text('event_id').notNull().references(()=>event.id),
  status: text('status', { enum:SupportedBookingStatus }).default('pending'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().$onUpdate(() => new Date()),
}
, (table) => [
   unique('unique_user_event').on(table.eventId, table.userId),
   index("user_tickets").on(table.userId)
]
)

export const ticketRelations = relations(ticket, ({ one }) => ({
  user: one(profile, { fields: [ticket.userId], references: [profile.id] }),
  event: one(event, {
    fields: [ticket.eventId],
    references: [event.id]
  }),  // events are accessed through here
  payment: one(payment, { fields: [ticket.id], references: [payment.ticketId] }),
}))