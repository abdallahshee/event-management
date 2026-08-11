'use server'

import { db } from "#/db";
import { review } from "#/db/schema";
import { CreateReviewSchema, GetEventReviewsSchema, type CreateReviewRequest, type GetEventReviewsRequest } from "#/db/validations/review.validation";
import { asc, eq } from "drizzle-orm";

// CreateReviewFn,
// GetReviewsByEventIdFn


// Creating Review
export async function CreateReviewFn(data: CreateReviewRequest) {
    try {
        const parsed = CreateReviewSchema.parse(data)
        const userId = "test"
        const [theReview] = await db.insert(review).values({ ...parsed, userId: userId })
            .returning({ reviewId: review.id })
        return theReview.reviewId
    } catch (err) {
        console.log('Error from CreateReviewFn ', err)
        throw err
    }
}

// Getting Event Reviews
export async function GetReviewsByEventIdFn(data: GetEventReviewsRequest) {
    try {
        const parsed = GetEventReviewsSchema.parse(data)
        const page = parsed.page ?? 1
        const limit = parsed.limit ?? 10
        const offset = (page - 1) * limit

        const [theReviews, total] = await Promise.all([
            db.query.review.findMany({
                with: {
                    user: {
                        columns: {
                            firstName: true,
                            email: true,
                            lastName: true,
                            avatarUrl: true
                        }
                    }, event: {
                        columns: {
                            title: true,
                        }
                    }
                },
                where: eq(review.eventId, parsed.eventId),
                limit,
                offset,
                orderBy: asc(review.createdAt)
            }),
            db.$count(review, eq(review.eventId, parsed.eventId))
        ])
        return {
            data: theReviews,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) }
        }
    } catch (err) {
        console.log('Error from GetReviewsByEventIdFn ', err)
        throw err
    }
}
