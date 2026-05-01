import { db } from "#/db";
import { booking } from "#/db/schema";
import { PaginatorSchema } from "#/db/utils";
import { CreateBookingSchema, GetUserBookingsSchema } from "#/db/validations/booking.validation";
import { createServerFn } from "@tanstack/react-start";
import { asc, eq } from "drizzle-orm";
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
    .handler(async ({ data }) => {
        try {
            const page = data.page ?? 1
            const limit = data.limit ?? 10
            const offset = (page - 1) * limit

            const [theBookings, total] = await Promise.all([
                db.query.booking.findMany({with:{event:true, user:true}, limit, offset,orderBy: asc(booking.createdAt) }),
                db.$count(booking)
            ])
            return {
                data: theBookings,
                meta: { page, limit, total, totalPages: Math.ceil(total / limit) }
            }
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
            const theBooking = await db.query.booking.findFirst({with:{event:true,user:true}, where: eq(booking.id, data.bookingId) })
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
            const page = data.paginator.page ?? 1
            const limit = data.paginator.limit ?? 10
            const offset = (page - 1) * limit

            const [theBookings, total] = await Promise.all([
                db.query.booking.findMany({
                    with:{event:true},
                    where: eq(booking.userId, data.userId),
                    limit,
                    offset,
                    orderBy: asc(booking.createdAt) 
                }),
                db.$count(booking, eq(booking.userId, data.userId))
            ])
            return {
                data: theBookings,
                meta: { page, limit,  total, totalPages: Math.ceil(total / limit) }
            }
        } catch (err) {
            console.log('Error from GetUserBookingsFn ', err)
            throw err
        }
    })
