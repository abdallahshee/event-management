'use server'

import { db } from "#/db";
import { event, location } from "#/db/schema";
import { generateSlug, PaginatorSchema, type PaginatorRequest } from "#/db/utils";
import { CreateEventSchema, UpdateEventSchema, type CreateEventRequest, type UpdateEventRequest } from "#/db/validations/event.validation";
import { asc, eq } from "drizzle-orm";

// CreateEventFn
// GetEventsFn
// GetEventByIdFn

// Create an Event
export async function CreateEventFn(data: CreateEventRequest) {
    try {
        const parsed = CreateEventSchema.parse(data)
        let theId;
        const slug = generateSlug(parsed.title)
        if (!parsed.locationId) {
            // create the location if the location is not set,
            // ie the admin selected the existing location
            const [thelocationId] = await db.insert(location)
                .values({ ...parsed.location }).returning({ locationID: location.id })
            theId = thelocationId.locationID
        } else {
            theId = parsed.locationId
        }
        const [theEvents] = await db.insert(event)
            .values({ ...parsed, locationId: theId, slug, slotsRemaining: parsed.capacity }).returning()
        return theEvents
    } catch (err) {
        console.log('Error from CreateEventFn ', err)
        throw err
    }
}

// Get Events
export async function GetEventsFn(data: PaginatorRequest) {
    try {
        const parsed = PaginatorSchema.parse(data)
        const page = parsed.page ?? 1
        const limit = parsed.limit ?? 10
        const offset = (page - 1) * limit

        const [theEvents, total] = await Promise.all([
            db
                .select({
                    id: event.id,
                    title: event.title,
                    slug: event.slug,
                    type: event.type,
                    description: event.description,
                    coverImage: event.coverImage,
                    category: event.category,
                    price: event.price,
                    capacity: event.capacity,
                    slotsRemaining: event.slotsRemaining,
                    startsAt: event.startsAt,
                    endsAt: event.endsAt,
                    status: event.status,
                    isFeatured: event.isFeatured,
                    locationId: event.locationId,
                    createdAt: event.createdAt,
                    updatedAt: event.updatedAt,
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
}


// Getting one Event By ID
export async function GetEventBySlugFn(data: { slug: string }) {
    try {
        const theEvent = await db.query.event
            .findFirst({ with: { location: true }, where: eq(event.slug, data.slug) })
        return theEvent
    } catch (err) {
        console.log('Error from GetEventByIdFn ', err)
        throw err
    }
}

export async function UpdateEventFn(data: UpdateEventRequest) {
    try {
        const parsed = UpdateEventSchema.parse(data)
        const [theEvent] = await db.update(event).set({ ...parsed })
            .where(eq(event.id, parsed.slug)).returning({ slug: event.slug })
        const tEvent = await db.query.event
            .findFirst({ with: { location: true }, where: eq(event.slug, theEvent.slug) })
        return tEvent
    } catch (err) {
        console.log('Error from UpdateEventFn ', err)
        throw err
    }
}


// To be Implemented
// Get Events Near Me Function
