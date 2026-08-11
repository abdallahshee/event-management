import { text, numeric, integer, timestamp, pgTable, boolean, uuid } from "drizzle-orm/pg-core";

import { relations } from "drizzle-orm";

// import { bookingItem } from "./booking-item.schema";
import { nanoid } from "nanoid";
import { review } from "./review.schema";
import { location } from "./location.schema";
import { ticket } from "./ticket.schema";
import { payment } from "./payment.schema";
import { SupportedEventCategories, SupportedEventStatus, SupportedEventTypes } from "../utils";
import { waitlist } from "./waitlist.schema";


export const event = pgTable('event', {
  id: text('id').primaryKey().$default(() => nanoid(16)),
  title: text('title').notNull(),
  description: text('description'),
  locationId: text('location_id').notNull().references(()=>location.id),
  coverImage: text('cover_image'),
  isFeatured: boolean('is_featured').default(false).notNull(),
  type:text('type',{enum:SupportedEventTypes}).notNull(),
  price: numeric('price', { precision: 10, scale: 2,mode:"number" }).notNull().default(0),
  capacity: integer('capacity').notNull(),
  slug: text('slug').notNull().unique(),
  slotsRemaining: integer('slots_remaining').notNull(),
  startsAt: timestamp('starts_at', { withTimezone: true,mode:"string" }).notNull(),
  endsAt: timestamp('ends_at', { withTimezone: true,mode:"string" }).notNull(),
  category: text('category', { enum:SupportedEventCategories }),
  status: text('status', { enum:SupportedEventStatus }).default('draft'),
  createdAt: timestamp('created_at', { withTimezone: true,mode:"string" }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true,mode:"string" }).notNull().$onUpdate(() => new Date().toISOString()),
},
)

export const eventRelations = relations(event, ({one, many }) => ({
  location:one(location,{
    fields:[event.locationId],
    references:[location.id]
  }),
  payments:many(payment),
  reviews: many(review),
  tickets: many(ticket),
  waitlist: many(waitlist),
}))