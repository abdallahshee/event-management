import { boolean, integer, pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { event } from "./event.schema";
import { profile } from "./profile.schema";
import { relations } from "drizzle-orm";

export const waitlist = pgTable('waitlist', {
  id:        uuid('id').primaryKey().defaultRandom(),
  eventId:   text('event_id').notNull().references(() => event.id),
  userId:    uuid('user_id').notNull().references(() => profile.id),
  position:  integer('position').notNull(), // their place in the queue
  notified:  boolean('notified').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
}, (table) => [
  unique('unique_waitlist_entry').on(table.eventId, table.userId),
])


export const waitlistRelations = relations(waitlist, ({ one }) => ({
  event: one(event,   { fields: [waitlist.eventId], references: [event.id] }),
  user:  one(profile, { fields: [waitlist.userId],  references: [profile.id] }),
}))