import { db } from "#/db";
import { ticket } from "#/db/schema/ticket.schema";
import { PaginatorSchema } from "#/db/utils";
import { CreateTicketSchema, GetUserTicketsSchema } from "#/db/validations/ticket.validation";
import { createServerFn } from "@tanstack/react-start";
import { asc, eq } from "drizzle-orm";
// CreateBookingFn,
// GetBookingsFn,
// GetBookingByIdFn,
// GetUserBookingsFn,

// Creating a User Boking
export const CreateTicketFn = createServerFn({ method: 'POST' })
    .middleware([])
    .inputValidator(CreateTicketSchema)
    .handler(async ({ data }) => {
        try {
            const [theTickets] = await db.insert(ticket).values({ ...data }).returning()
            return theTickets
        } catch (err) {
            console.log('Error from CreateBookingFn ', err)
            throw err
        }
    })

// Get Bookings
export const GetTicketsFn = createServerFn({ method: 'POST' })
    .middleware([])
    .inputValidator(PaginatorSchema)
    .handler(async ({ data }) => {
        try {
            const page = data.page ?? 1
            const limit = data.limit ?? 10
            const offset = (page - 1) * limit

            const [theTickets, total] = await Promise.all([
                db.query.ticket
                .findMany({with:{event:true, user:true}, limit, offset,orderBy: asc(ticket.createdAt) }),
                db.$count(ticket)
            ])
            return {
                data: theTickets,
                meta: { page, limit, total, totalPages: Math.ceil(total / limit) }
            }
        } catch (err) {
            console.log('Error from GetBookingsFn ', err)
            throw err
        }
    })

// Get the Booking By Id
export const GetTicketByIdFn = createServerFn({ method: 'POST' })
    .middleware([])
    .inputValidator((data: { bookingId: string }) => data)
    .handler(async ({ data }) => {
        try {
            const theTicket = await db.query.ticket.
            findFirst({with:{event:{
                columns:{
                    title:true,
                    startsAt:true,
                    coverImage:true,
                    description:true
                },
                 with:{location:{
                    columns:{name:true}
                 }}
            },user:{
                columns:{
                    lastName:true,
                    firstName:true,
                    email:true,

                }
            }},
                 where: eq(ticket.id, data.bookingId) })
            return theTicket
        } catch (err) {
            console.log('Error from GetBookingsByIdFn ', err)
            throw err
        }
    })

// Getting the Bookings for a User
export const GetUserTicketsFn = createServerFn({ method: 'GET' })
    .middleware([])
    .inputValidator(GetUserTicketsSchema)
    .handler(async ({ data }) => {
        try {
            const page = data.page ?? 1
            const limit = data.limit ?? 10
            const offset = (page - 1) * limit

            const [theTickets, total] = await Promise.all([
                db.query.ticket.findMany({
                    with:{event:true},
                    where: eq(ticket.userId, data.userId),
                    limit,
                    offset,
                    orderBy: asc(ticket.createdAt) 
                }),
                db.$count(ticket, eq(ticket.userId, data.userId))
            ])
            return {
                data: theTickets,
                meta: { page, limit,  total, totalPages: Math.ceil(total / limit) }
            }
        } catch (err) {
            console.log('Error from GetUserBookingsFn ', err)
            throw err
        }
    })
