import { db } from "#/db";
import { event, location } from "#/db/schema";
import { PaginatorSchema } from "#/db/utils";
import { CreateLocationSchema, UpdateLocationSchema } from "#/db/validations/location.validation";
import { createServerFn } from "@tanstack/react-start";
import { asc, count, eq } from "drizzle-orm";

// CreateLocationFn,
// GetLocationsFn,
// GetLocationByIdFn,
// UpdateLocationFn,


// Creating a Location
export const CreateLocationFn = createServerFn({ method: 'POST' })
    .middleware([])
    .inputValidator(CreateLocationSchema)
    .handler(async ({ data }) => {
        try {
            const [thelocation] = await db.insert(location).values({ ...data }).returning()
            return thelocation.id
        } catch (err) {
            console.log("Error from CreateLocationFn", err)
            throw err
        }
    })

// Getting all the locations
export const GetLocationsFn = createServerFn({ method: "GET" })
    .middleware([])
    .inputValidator(PaginatorSchema)
    .handler(async ({ data }) => {
        try {
            const page = data.page ?? 1
            const limit = data.limit ?? 10
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
    })

// Getting a single location by id
export const GetLocationByIdFn = createServerFn({ method: 'GET' })
    .middleware([])
    .inputValidator((data: { locationId: string }) => data)
    .handler(async ({ data }) => {
        try {
            const thelocation = await db.query.location
            .findFirst({with:{events:{columns:{title:true,capacity:true,slotsRemaining:true}}},
                 where: eq(location.id, data.locationId) })
            return thelocation
        } catch (err) {
            console.log("Error from GetLocationByIdFn", err)
            throw err
        }
    })

// Updating a location by the given id
export const UpdateLocationFn = createServerFn({ method: "POST" })
    .middleware([])
    .inputValidator(UpdateLocationSchema)
    .handler(async ({ data }) => {
        try {
            const [thelocation] = await db.update(location).set({ ...data })
                .where(eq(location.id, data.locationId)).returning({locationId:location.id})
            const thelocat=await db.query.location
            .findFirst({with:{events:{columns:{title:true,capacity:true,slotsRemaining:true}}}
                ,where:eq(location.id,thelocation.locationId)})
                    return  thelocat      
        } catch (err) {
            console.log("Error from UpdateLocationFn", err)
            throw err
        }
    })