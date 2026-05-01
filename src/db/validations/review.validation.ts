// export const review = pgTable('review', {
//     id: text('id').primaryKey().$default(() => nanoid(16)),
//     eventId: text('event_id').notNull().references(() => event.id),
//     userId: uuid('user_id').notNull().references(() => profile.id),
//     rating: integer('rating').notNull(),
//     comment: text('comment'),
//     createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
//     updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().$onUpdate(() => new Date()),
// }, (table) => ({
//     uniqueUserEvent: unique().on(table.userId, table.eventId), // one review per user per event
// }))

import { createInsertSchema } from "drizzle-zod";
import { review } from "../schema";
import z from "zod"
import { PaginatorSchema } from "../utils";

export const CreateReviewSchema = createInsertSchema(review, {
  eventId:z.string().nonempty(),
  rating: z.coerce.number().int().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
  comment: z.string().min(10, "Comment must be at least 10 characters").max(1000, "Comment too long"),
})
.pick({
  rating: true,
  comment: true,
  eventId:true,
})
export type CreateReviewRequest = z.infer<typeof CreateReviewSchema>


export const GetEventReviewsSchema=z.object({
  eventId:z.string().nonempty(),
  paginator:PaginatorSchema
})
export type GetEventReviewsRequest=z.infer<typeof GetEventReviewsSchema>