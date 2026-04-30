import { db } from "#/db";
import { event, location } from "#/db/schema";
import { CreateEventSchema } from "#/db/validations/event.validation";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";

// Create an Event
export const CreateEventFn = createServerFn({ method: 'POST' })
    .middleware([])
    .inputValidator(CreateEventSchema)
    .handler(async ({ data }) => {
        try {
            let theId = ""
            if (typeof data.lacation !== null) {
                // create the locatio if the location is not set, 
                // ie the admin selected the existing location
                const [thelocationId] = await db.insert(location)
                    .values({ ...data.lacation }).returning({ locationID: location.id })
                theId = thelocationId.locationID
            } else {
                theId = data.locationId
            }
            const [theEvents] = await db.insert(event).values({ ...data, locationId: theId }).returning()
            return theEvents
        } catch (err) {
            console.log('Error from CreateEventFn ', err)
            throw err
        }
    })

//Get Events
export const GetEventsFn = createServerFn({ method: 'GET' })
    .middleware([])
    .inputValidator((data: { page?: number, limit?: number }) => data)
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