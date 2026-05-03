import { pgTable, uuid, text, timestamp, boolean, index} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { profile } from "./profile.schema";
import { SupportedNotifications } from "../utils";

export const notification = pgTable('notification', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().references(() => profile.id),
    title: text('title').notNull(),
    body: text('body').notNull(),
    type: text('type', { enum: SupportedNotifications }),
    isRead: boolean('is_read').default(false).notNull(),
    readAt: timestamp('read_at', { withTimezone: true, mode: 'date' }),  // null until read
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
},
(table)=>[
    index("notification_userId").on(table.userId)
]
)

export const notificationRelations = relations(notification, ({ one }) => ({
    user: one(profile, { fields: [notification.userId], references: [profile.id] }),
}))