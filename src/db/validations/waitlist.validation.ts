import { createSelectSchema } from "drizzle-zod";
import { waitlist } from "../schema";
import z from "zod";
import { PaginatorSchema } from "../utils";

export const WaitlistSchema = createSelectSchema(waitlist, {
    userId: z.string().min(1),
    eventId: z.string().min(1)
})


export const EventWaitlistSchema = WaitlistSchema.
    pick({
        eventId: true
    }).extend(PaginatorSchema.shape)
export type EventWaitlistRequest = z.infer<typeof EventWaitlistSchema>


export const UserWaitlistSchema = WaitlistSchema.
    pick({
        userId: true
    }).extend(PaginatorSchema.shape)
export type UserWaitlistRequest = z.infer<typeof UserWaitlistSchema>


export const RemoveAddWaitlistSchema = WaitlistSchema.pick({
    userId: true,
    eventId: true
})
export type RemoveAddWaitlistRequest = z.infer<typeof RemoveAddWaitlistSchema>