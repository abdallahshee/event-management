import { pgTable, uuid, integer, numeric, text } from "drizzle-orm/pg-core";
import { booking } from "./booking.schema";
import { event } from "./event.schema";
import { relations } from "drizzle-orm";
import { nanoid } from "nanoid";

export const bookingItem = pgTable('booking_item', {
    id: text('id').primaryKey().$default(() => nanoid(16)),
    bookingId: uuid('booking_id').notNull().references(() => booking.id),
    eventId: uuid('event_id').notNull().references(() => event.id),
    quantity: integer('quantity').notNull().default(1),
    unitPrice: numeric('unit_price', { precision: 10, scale: 2 }).notNull(), // price at time of booking
})


export const bookingItemRelations = relations(bookingItem, ({ one }) => ({
    booking: one(booking, { fields: [bookingItem.bookingId], references: [booking.id] }),
    event: one(event, { fields: [bookingItem.eventId], references: [event.id] }),
}))