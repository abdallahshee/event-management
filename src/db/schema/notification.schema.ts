import { pgTable, uuid, text, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { profile } from "./profile.schema";

export const notification = pgTable('notification', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().references(() => profile.id),
    title: text('title').notNull(),
    body: text('body').notNull(),
    type: text('type', {
        enum: [
            'booking_confirmed',
            'booking_cancelled',
            'event_cancelled',
            'event_reminder',
            'refund_processed',
            'review_received',
        ]
    }).notNull(),
    isRead: boolean('is_read').default(false).notNull(),
    readAt: timestamp('read_at', { withTimezone: true, mode: 'date' }),  // null until read
    metadata: jsonb('metadata'),   // holds relevant IDs like bookingId, eventId
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
})

export const notificationRelations = relations(notification, ({ one }) => ({
    user: one(profile, { fields: [notification.userId], references: [profile.id] }),
}))