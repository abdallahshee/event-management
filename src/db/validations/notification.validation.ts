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

import { createSelectSchema } from "drizzle-zod";
import { notification } from "../schema";
import z from "zod"
import { PaginatorSchema, SupportedNotifications } from "../utils";

const NotificationSchema = createSelectSchema(notification, {
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  body: z.string().min(1, "Body is required").max(500, "Body too long"),
  type: z.enum(SupportedNotifications, "Invalid notification type").optional(),
  userId: z.string().min(1)
})

export const CreateNotificationSchema = NotificationSchema.pick({
  title: true,
  body: true,
  type: true,
  userId: true
})
export type CreateNotificationRequest = z.infer<typeof CreateNotificationSchema>


export const GetNotificationByIdSchema = NotificationSchema.pick({
  type: true
}).extend({
  notificationId: z.string().min(1)
})
export type GetNotificationByIdRequest = z.infer<typeof GetNotificationByIdSchema>


export const GetUserNotificationsSchema = NotificationSchema.pick({
  type: true,
  userId: true,
}).extend(PaginatorSchema.shape)
export type GetUserNotificationsRequest = z.infer<typeof GetUserNotificationsSchema>


export const GetNotificationsSchema = NotificationSchema.pick({
  type: true,
}).extend(PaginatorSchema.shape)
export type GetNotificationsRequest = z.infer<typeof GetNotificationsSchema>
