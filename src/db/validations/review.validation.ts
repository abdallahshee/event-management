// rating:    integer('rating').notNull(),
//   comment:   text('comment'),

import { createSelectSchema } from "drizzle-zod";
import { review } from "../schema";

export const ReviewSchema = createSelectSchema(review, {

})
    .pick({
        rating: true,
        comment: true
    }
    )