import { db } from "#/db";
import { booking } from "#/db/schema";
import { PaginatorSchema } from "#/db/utils";
import { CreateBookingSchema, GetUserBookingsSchema } from "#/db/validations/booking.validation";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
// CreateBookingFn,
// GetBookingsFn,
// GetBookingByIdFn,
// GetUserBookingsFn,

// Creating a User Boking
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

// Get Bookings
export const GetBookingsFn = createServerFn({ method: 'POST' })
    .middleware([])
    .inputValidator(PaginatorSchema)
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

// Getting the Bookings for a User
export const GetUserBookingsFn = createServerFn({ method: 'GET' })
    .middleware([])
    .inputValidator(GetUserBookingsSchema)
    .handler(async ({ data }) => {
        try {
            const theBookings = await db.query.booking.findMany({ where: eq(booking.userId, data.userId) })
            return theBookings
        } catch (err) {
            console.log('Error from GetUserBookingsFn ', err)
            throw err
        }
    })
