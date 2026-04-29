// rating:    integer('rating').notNull(),
//   comment:   text('comment'),

import { createInsertSchema } from "drizzle-zod";
import { review } from "../schema";
import z from "zod"

export const ReviewSchema = createInsertSchema(review, {
  rating: z.coerce.number().int().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
  comment: z.string().min(10, "Comment must be at least 10 characters").max(1000, "Comment too long").optional(),
})
.pick({
  rating: true,
  comment: true,
})

export type ReviewRequest = z.infer<typeof ReviewSchema>