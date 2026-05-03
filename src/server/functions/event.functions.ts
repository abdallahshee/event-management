import { db } from "#/db";
import { event, location } from "#/db/schema";
import { PaginatorSchema } from "#/db/utils";
import { CreateEventSchema, UpdateEventSchema } from "#/db/validations/event.validation";
import { createServerFn } from "@tanstack/react-start";
import { asc, eq } from "drizzle-orm";

// CreateEventFn
// GetEventsFn
// GetEventByIdFn

// Create an Event
export const CreateEventFn = createServerFn({ method: 'POST' })
    .middleware([])
    .inputValidator(CreateEventSchema)
    .handler(async ({ data }) => {
        try {
            let theId;
            if (!data.locationId) {
                // create the location if the location is not set, 
                // ie the admin selected the existing location
                const [thelocationId] = await db.insert(location)
                    .values({ ...data.location }).returning({ locationID: location.id })
                theId = thelocationId.locationID
            } else {
                theId = data.locationId
            }
            const [theEvents] = await db.insert(event)
                .values({ ...data, locationId: theId, slotsRemaining: data.capacity }).returning()
            return theEvents
        } catch (err) {
            console.log('Error from CreateEventFn ', err)
            throw err
        }
    })

// Get Events
export const GetEventsFn = createServerFn({ method: 'GET' })
    .middleware([])
    .inputValidator(PaginatorSchema)
    .handler(async ({ data }) => {
        try {
            const page = data.page ?? 1
            const limit = data.limit ?? 10
            const offset = (page - 1) * limit

            const [theEvents, total] = await Promise.all([
                db.query.event.findMany({
                    with: { location: {columns:{name:true}} },
                    limit,
                    offset,
                    orderBy: asc(event.startsAt)
                }),
                db.$count(event)
            ])
            return {
                data: theEvents,
                meta: { page, limit, total, totalPages: Math.ceil(total / limit) }
            }
        } catch (err) {
            console.log('Error from GetEventsFn ', err)
            throw err
        }
    })

// Getting one Event By ID
export const GetEventByIdFn = createServerFn({ method: 'GET' })
    .inputValidator((data: { eventId: string }) => data)
    .handler(async ({ data }) => {
        try {
            const theEvent = await db.query.event
            .findFirst({ with: { location: true }, where: eq(event.id, data.eventId) })
            return theEvent
        } catch (err) {
            console.log('Error from GetEventByIdFn ', err)
            throw err
        }
    })

export const UpdateEventFn = createServerFn({ method: 'POST' })
    .middleware([])
    .inputValidator(UpdateEventSchema)
    .handler(async ({ data }) => {
        try {
            const [theEvent] = await db.update(event).set({ ...data })
                .where(eq(event.id, data.eventId)).returning({ eventId: event.id })
            const tEvent = await db.query.event
            .findFirst({ with: { location: true }, where: eq(event.id, theEvent.eventId) })
            return tEvent
        } catch (err) {
            console.log('Error from UpdateEventFn ', err)
            throw err
        }
    })