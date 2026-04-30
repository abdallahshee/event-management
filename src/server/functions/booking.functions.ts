import { db } from "#/db";
import { booking } from "#/db/schema";
import { CreateBookingSchema } from "#/db/validations/booking.validation";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";

//Create a Booking
export const CreateBookingFn = createServerFn({ method: 'POST' })
    .middleware([])
    .inputValidator(CreateBookingSchema)
    .handler(async ({ data }) => {
        try {
            const [theBooking] = await db.insert(booking).values({ ...data }).returning()
            return theBooking
        } catch (err) {
            console.log('Error from CreateBookingFn ', err)
            throw err
        }
    })

//Get Bookings
export const GetBookingsFn = createServerFn({ method: 'POST' })
    .middleware([])
    .inputValidator((data: { page?: number, limit?: number }) => data)
    .handler(async () => {
        try {
            const theBookings = await db.query.booking.findMany()
            return theBookings

        } catch (err) {
            console.log('Error from GetBookingsFn ', err)
            throw err
        }
    })
// Get the Booking By Id
export const GetBookingByIdFn = createServerFn({ method: 'POST' })
    .middleware([])
    .inputValidator((data: { bookingId: string }) => data)
    .handler(async ({ data }) => {
        try {
            const theBooking = await db.query.booking.findFirst({ where: eq(booking.id, data.bookingId) })
            return theBooking
        } catch (err) {
            console.log('Error from GetBookingsByIdFn ', err)
            throw err
        }
    })

export const GetUserBookingsFn = createServerFn({ method: 'GET' })
    .middleware([])
    .inputValidator((data: { userId: string, page?: number, limit?: number }) => data)
    .handler(async ({ data }) => {
        try {
            const theBookings = await db.query.booking.findMany({ where: eq(booking.userId, data.userId) })
            return theBookings
        } catch (err) {
            console.log('Error from GetUserBookingsFn ', err)
            throw err
        }
    })