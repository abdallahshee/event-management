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
import { PaginatorSchema } from "./utils.validation";
import { SupportedNotifications } from "../schema/utils.schema";


export const CreateNotificationSchema = createInsertSchema(notification, {
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  body: z.string().min(1, "Body is required").max(500, "Body too long"),
  type: z.enum(SupportedNotifications, { message: "Invalid notification type" }),
})
.pick({
  title: true,
  body: true,
  type: true,
  userId:true
})
export type CreateNotificationRequest = z.infer<typeof CreateNotificationSchema>


export const NoteByIdSchema=z.object({
    type:z.enum([...SupportedNotifications]),
    notificationId:z.string().min(1)
})
export type NotesByIdRequest=z.infer<typeof NoteByIdSchema>


export const NotesByUserIdSchema=z.object({
    type:z.enum([...SupportedNotifications]),
    userId:z.string().min(1),
    paginator:PaginatorSchema
})
export type NotesByUserIdRequest=z.infer<typeof NotesByUserIdSchema>


export const NotesSchema=z.object({
    type:z.enum([...SupportedNotifications]),
    paginator:PaginatorSchema
})
export type NotesRequest=z.infer<typeof NotesSchema>
