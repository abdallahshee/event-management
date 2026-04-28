import { uuid, text, numeric, integer, timestamp, pgTable } from "drizzle-orm/pg-core";

import { relations } from "drizzle-orm";

import { bookingItem } from "./booking-item.schema";
import { nanoid } from "nanoid";
import { review } from "./review.schema";


export const event = pgTable('event', {
  id: text('id').primaryKey().$default(() => nanoid(16)),
  title: text('title').notNull(),
  description: text('description'),
  location: text('location'),
  price: numeric('price', { precision: 10, scale: 2 }).notNull().default('0'),
  capacity: integer('capacity').notNull(),
  slotsRemaining: integer('slots_remaining').notNull(),
  startsAt: timestamp('starts_at', { withTimezone: true }).notNull(),
  endsAt: timestamp('ends_at', { withTimezone: true }).notNull(),
  status: text('status', { enum: ['draft', 'published', 'cancelled'] }).default('draft').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().$onUpdate(() => new Date()),
})

export const eventRelations = relations(event, ({ many }) => ({
  reviews: many(review),
  bookingItems: many(bookingItem), // events are booked through bookingItems
}))