import { db } from "#/db";
import { event, location } from "#/db/schema";
import { generateSlug, PaginatorSchema } from "#/db/utils";
import { CreateEventSchema, UpdateEventSchema } from "#/db/validations/event.validation";
import { createServerFn } from "@tanstack/react-start";
import { asc, eq } from "drizzle-orm";
import { authMiddleware } from "../middleware";

// CreateEventFn
// GetEventsFn
// GetEventByIdFn

// Create an Event
export const CreateEventFn = createServerFn({ method: 'POST' })
    .middleware([authMiddleware])
    .inputValidator(CreateEventSchema)
    .handler(async ({ data,context}) => {
        try {
            let theId;
            const slug=generateSlug(data.title)
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
                .values({ ...data, locationId: theId,slug, slotsRemaining: data.capacity}).returning()
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
            const page   = data.page  ?? 1
            const limit  = data.limit ?? 10
            const offset = (page - 1) * limit

            const [theEvents, total] = await Promise.all([
                db
                    .select({
                        id:             event.id,
                        title:          event.title,
                        slug:           event.slug,
                        type:           event.type,
                        description:    event.description,
                        coverImage:     event.coverImage,
                        category:       event.category,
                        price:          event.price,
                        capacity:       event.capacity,
                        slotsRemaining: event.slotsRemaining,
                        startsAt:       event.startsAt,
                        endsAt:         event.endsAt,
                        status:         event.status,
                        isFeatured:     event.isFeatured,
                        locationId:     event.locationId,
                        createdAt:      event.createdAt,
                        updatedAt:      event.updatedAt,
                        location: {
                            name: location.name,
                        },
                    })
                    .from(event)
                    .leftJoin(location, eq(event.locationId, location.id))
                    .orderBy(asc(event.startsAt))
                    .limit(limit)
                    .offset(offset),
                db.$count(event),
            ])

            return {
                data: theEvents,
                meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
            }
        } catch (err) {
            console.log('Error from GetEventsFn ', err)
            throw err
        }
    })


// Getting one Event By ID
export const GetEventBySlugFn = createServerFn({ method: 'GET' })
    .inputValidator((data: { slug: string }) => data)
    .handler(async ({ data }) => {
        try {
            const theEvent = await db.query.event
            .findFirst({ with: { location: true }, where: eq(event.slug, data.slug) })
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
                .where(eq(event.id, data.slug)).returning({ slug: event.slug })
            const tEvent = await db.query.event
            .findFirst({ with: { location: true }, where: eq(event.slug, theEvent.slug) })
            return tEvent
        } catch (err) {
            console.log('Error from UpdateEventFn ', err)
            throw err
        }
    })


    // To be Implemented
    // Get Events Near Me Function