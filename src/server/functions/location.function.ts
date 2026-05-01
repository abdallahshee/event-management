import { db } from "#/db";
import { location } from "#/db/schema";
import { PaginatorSchema } from "#/db/utils";
import { CreateLocationSchema, UpdateLocationSchema } from "#/db/validations/location.validation";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";

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

            const [theLocations, total] = await Promise.all([
                db.query.location.findMany({ limit, offset }),
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
            const thelocation = await db.query.location.findFirst({ where: eq(location.id, data.locationId) })
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
                .where(eq(location.id, data.locationId)).returning()
            return thelocation
        } catch (err) {
            console.log("Error from UpdateLocationFn", err)
            throw err
        }
    })