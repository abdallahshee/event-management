import { db } from "#/db";
import { event, location } from "#/db/schema";
import { PaginatorSchema } from "#/db/utils";
import { CreateEventSchema } from "#/db/validations/event.validation";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";

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
                // create the locatio if the location is not set, 
                // ie the admin selected the existing location
                const [thelocationId] = await db.insert(location)
                    .values({ ...data.location }).returning({ locationID: location.id })
                theId = thelocationId.locationID
            } else {
                theId = data.locationId
            }
            const [theEvents] = await db.insert(event)
            .values({ ...data, locationId: theId,slotsRemaining:data.capacity }).returning()
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
            const theEvents = await db.query.event.findMany({
                with: {
                    location: true,
                }
            })
            return theEvents
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
            const theEvent = await db.query.event.findFirst({ where: eq(event.id, data.eventId) })
            return theEvent
        } catch (err) {
            console.log('Error from GetEventByIdFn ', err)
            throw err
        }
    })