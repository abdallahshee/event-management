import { db } from "#/db";
import { review } from "#/db/schema";
import { CreateReviewSchema, EventReviewsSchema } from "#/db/validations/review.validation";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";


// Creating Review
export const CreateReviewFn = createServerFn({ method: 'POST' })
    .middleware([])
    .inputValidator(CreateReviewSchema)
    .handler(async ({ data }) => {
        try {
            const userId = "test"
            const [theReview] = await db.insert(review).values({ ...data, userId: userId })
                .returning({ reviewId: review.id })
            return theReview.reviewId
        } catch (err) {
            console.log('Error from CreateReviewFn ', err)
            throw err
        }
    })

// Getting Event Reviews
export const GetReviewsByEventIdFn = createServerFn({ method: 'GET' })
    .middleware([])
    .inputValidator(EventReviewsSchema)
    .handler(async ({ data }) => {
        try {
            const theReviews = await db.query.review.findMany(
            {with:{
                user:true,
                event:true
                
            }, where: eq(review.eventId, data.eventId) })
            return theReviews
        } catch (err) {
            console.log('Error from GetReviewsByEventIdF ', err)
            throw err
        }
    })