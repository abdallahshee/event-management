import { pgTable, uuid, text, timestamp, integer, unique } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { profile } from "./profile.schema";
import { event } from "./event.schema";
import { nanoid } from "nanoid";

export const review = pgTable('review', {
    id: text('id').primaryKey().$default(() => nanoid(16)),
    eventId: text('event_id').notNull().references(() => event.id),
    userId: uuid('user_id').notNull().references(() => profile.id),
    rating: integer('rating').notNull(),
    comment: text('comment'),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().$onUpdate(() => new Date()),
}, 
(table)=>[
    unique('unique_user_review').on(table.userId, table.eventId)
]
)

export const reviewRelations = relations(review, ({ one }) => ({
    event: one(event, { fields: [review.eventId], references: [event.id] }),
    user: one(profile, { fields: [review.userId], references: [profile.id] }),
}))