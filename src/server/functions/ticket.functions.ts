'use server'

import { db } from "#/db";
import { ticket } from "#/db/schema/ticket.schema";
import { PaginatorSchema, type PaginatorRequest } from "#/db/utils";
import { CreateTicketSchema, GetUserTicketsSchema, type CreateTicketRequest, type GetUserTicketsRequest } from "#/db/validations/ticket.validation";
import { asc, eq } from "drizzle-orm";
// CreateBookingFn,
// GetBookingsFn,
// GetBookingByIdFn,
// GetUserBookingsFn,

// Creating a User Boking
export async function CreateTicketFn(data: CreateTicketRequest) {
    try {
        const parsed = CreateTicketSchema.parse(data)
        const [theTickets] = await db.insert(ticket).values({ ...parsed }).returning()
        return theTickets
    } catch (err) {
        console.log('Error from CreateBookingFn ', err)
        throw err
    }
}

// Get Bookings
export async function GetTicketsFn(data: PaginatorRequest) {
    try {
        const parsed = PaginatorSchema.parse(data)
        const page = parsed.page ?? 1
        const limit = parsed.limit ?? 10
        const offset = (page - 1) * limit

        const [theTickets, total] = await Promise.all([
            db.query.ticket
                .findMany({ with: { event: true, user: true }, limit, offset, orderBy: asc(ticket.createdAt) }),
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
}

// Get the Booking By Id
export async function GetTicketByIdFn(data: { bookingId: string }) {
    try {
        const theTicket = await db.query.ticket.
            findFirst({
                with: {
                    event: {
                        columns: {
                            title: true,
                            startsAt: true,
                            coverImage: true,
                            description: true
                        },
                        with: {
                            location: {
                                columns: { name: true }
                            }
                        }
                    }, user: {
                        columns: {
                            lastName: true,
                            firstName: true,
                            email: true,

                        }
                    }
                },
                where: eq(ticket.id, data.bookingId)
            })
        return theTicket
    } catch (err) {
        console.log('Error from GetBookingsByIdFn ', err)
        throw err
    }
}

// Getting the Bookings for a User
export async function GetUserTicketsFn(data: GetUserTicketsRequest) {
    try {
        const parsed = GetUserTicketsSchema.parse(data)
        const page = parsed.page ?? 1
        const limit = parsed.limit ?? 10
        const offset = (page - 1) * limit

        const [theTickets, total] = await Promise.all([
            db.query.ticket.findMany({
                with: { event: true },
                where: eq(ticket.userId, parsed.userId),
                limit,
                offset,
                orderBy: asc(ticket.createdAt)
            }),
            db.$count(ticket, eq(ticket.userId, parsed.userId))
        ])
        return {
            data: theTickets,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) }
        }
    } catch (err) {
        console.log('Error from GetUserBookingsFn ', err)
        throw err
    }
}
