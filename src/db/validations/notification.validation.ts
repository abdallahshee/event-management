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

export const NotificationTypes = [
  'booking_confirmed',
  'booking_cancelled',
  'event_cancelled',
  'event_reminder',
  'refund_processed',
  'review_received',
] as const


export const CreateNotificationSchema = createInsertSchema(notification, {
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  body: z.string().min(1, "Body is required").max(500, "Body too long"),
  type: z.enum(NotificationTypes, { message: "Invalid notification type" }),
})
.pick({
  title: true,
  body: true,
  type: true,
  userId:true
})
export const NoteByIdSchema=z.object({
    type:z.enum([...NotificationTypes]),
    notificationId:z.string().min(1)
})

export const NotesByUserIdSchema=z.object({
    type:z.enum([...NotificationTypes]),
    userId:z.string().min(1),
    page:z.number(),
    limit:z.number()
})

export const NotesSchema=z.object({
    type:z.enum([...NotificationTypes]),
    page:z.number(),
    limit:z.number()
})

export type CreateNotificationRequest = z.infer<typeof CreateNotificationSchema>