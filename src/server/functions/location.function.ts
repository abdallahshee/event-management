'use server'

import { db } from "#/db";
import { event, location } from "#/db/schema";
import { PaginatorSchema, type PaginatorRequest } from "#/db/utils";
import { CreateLocationSchema, UpdateLocationSchema, type CreateLocationRequest, type UpdateLocationRequest } from "#/db/validations/location.validation";
import { asc, count, eq } from "drizzle-orm";

// CreateLocationFn,
// GetLocationsFn,
// GetLocationByIdFn,
// UpdateLocationFn,


// Creating a Location
export async function CreateLocationFn(data: CreateLocationRequest) {
    try {
        const parsed = CreateLocationSchema.parse(data)
        const [thelocation] = await db.insert(location).values({ ...parsed }).returning()
        return thelocation.id
    } catch (err) {
        console.log("Error from CreateLocationFn", err)
        throw err
    }
}

// Getting all the locations
export async function GetLocationsFn(data: PaginatorRequest) {
    try {
        const parsed = PaginatorSchema.parse(data)
        const page = parsed.page ?? 1
        const limit = parsed.limit ?? 10
        const offset = (page - 1) * limit

        const eventCountSubquery = db
            .select({
                locationId: event.locationId,
                count: count(event.id).as('count')
            })
            .from(event)
            .groupBy(event.locationId)
            .as('eventCount')

        const [theLocations, total] = await Promise.all([
            db.select({
                name: location.name,
                eventCount: eventCountSubquery.count,
            })
                .from(location)
                .leftJoin(eventCountSubquery, eq(location.id, eventCountSubquery.locationId))
                .orderBy(asc(location.name))
                .limit(limit)
                .offset(offset),
            db.$count(location)
        ])

        return {
            data: theLocations,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) }
        }
    } catch (err) {
        console.log("Error from GetLocationsFn", err)
        throw err
    }
}

// Getting a single location by id
export async function GetLocationByIdFn(data: { locationId: string }) {
    try {
        const thelocation = await db.query.location
            .findFirst({
                with: { events: { columns: { title: true, capacity: true, slotsRemaining: true } } },
                where: eq(location.id, data.locationId)
            })
        return thelocation
    } catch (err) {
        console.log("Error from GetLocationByIdFn", err)
        throw err
    }
}

// Updating a location by the given id
export async function UpdateLocationFn(data: UpdateLocationRequest) {
    try {
        const parsed = UpdateLocationSchema.parse(data)
        const [thelocation] = await db.update(location).set({ ...parsed })
            .where(eq(location.id, parsed.locationId)).returning({ locationId: location.id })
        const thelocat = await db.query.location
            .findFirst({
                with: { events: { columns: { title: true, capacity: true, slotsRemaining: true } } }
                , where: eq(location.id, thelocation.locationId)
            })
        return thelocat
    } catch (err) {
        console.log("Error from UpdateLocationFn", err)
        throw err
    }
}
