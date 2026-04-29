// export const notification = pgTable('notification', {
//   id:        uuid('id').primaryKey().defaultRandom(),
//   userId:    uuid('user_id').notNull().references(() => profile.id),
//   title:     text('title').notNull(),
//   body:      text('body').notNull(),
//   type:      text('type', { 
//     enum: [
//       'booking_confirmed', 
//       'booking_cancelled',
//       'event_cancelled', 
//       'event_reminder', 
//       'refund_processed',
//       'review_received',
//     ] 
//   }).notNull(),
//   isRead:    boolean('is_read').default(false).notNull(),
//   readAt:    timestamp('read_at', { withTimezone: true, mode: 'date' }),  // null until read
//   metadata:  jsonb('metadata'),   // holds relevant IDs like bookingId, eventId
//   createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
// })

import { createInsertSchema } from "drizzle-zod";
import { notification } from "../schema";
import z from "zod"

const notificationTypes = [
  'booking_confirmed',
  'booking_cancelled',
  'event_cancelled',
  'event_reminder',
  'refund_processed',
  'review_received',
] as const

export const NotificationSchema = createInsertSchema(notification, {
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  body: z.string().min(1, "Body is required").max(500, "Body too long"),
  type: z.enum(notificationTypes, { message: "Invalid notification type" }),
  metadata: z.record(z.string(), z.unknown()).optional(),
})
.pick({
  title: true,
  body: true,
  type: true,
  metadata: true,
})

export type NotificationRequest = z.infer<typeof NotificationSchema>