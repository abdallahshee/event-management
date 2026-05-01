import { pgTable, uuid, text, timestamp, boolean} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { profile } from "./profile.schema";
import { SupportedNotifications } from "./utils.schema";


export const notification = pgTable('notification', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().references(() => profile.id),
    title: text('title').notNull(),
    body: text('body').notNull(),
    type: text('type', {enum: [...SupportedNotifications]}).notNull(),
    isRead: boolean('is_read').default(false).notNull(),
    readAt: timestamp('read_at', { withTimezone: true, mode: 'date' }),  // null until read
    // metadata: jsonb('metadata'),   // holds relevant IDs like bookingId, eventId
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
})

export const notificationRelations = relations(notification, ({ one }) => ({
    user: one(profile, { fields: [notification.userId], references: [profile.id] }),
}))