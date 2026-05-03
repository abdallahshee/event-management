import { db } from "#/db";
import { review } from "#/db/schema";
import { CreateReviewSchema, GetEventReviewsSchema } from "#/db/validations/review.validation";
import { createServerFn } from "@tanstack/react-start";
import { asc, eq } from "drizzle-orm";

// CreateReviewFn,
// GetReviewsByEventIdFn


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
    .inputValidator(GetEventReviewsSchema)
    .handler(async ({ data }) => {
        try {
            const page = data.page ?? 1
            const limit = data.limit ?? 10
            const offset = (page - 1) * limit
            
            const [theReviews, total] = await Promise.all([
                db.query.review.findMany({
                    with: { user:{
                        columns:{
                            firstName:true,
                            email:true,
                            lastName:true,
                            avatarUrl:true
                        }
                    }, event: {
                        columns:{
                            title:true,
                        }
                    } },
                    where: eq(review.eventId, data.eventId),
                    limit,
                    offset,
                    orderBy:asc(review.createdAt)
                }),
                db.$count(review, eq(review.eventId, data.eventId))
            ])
            return {
                data: theReviews,
                meta: { page, limit, total, totalPages: Math.ceil(total / limit) }
            }
        } catch (err) {
            console.log('Error from GetReviewsByEventIdFn ', err)
            throw err
        }
    })