// export const location=pgTable('location',{
//     id:text("id").primaryKey().notNull().$default(()=>nanoid(12)),
//     name:text('name').notNull(),
//     coordinates:point('coordinates').notNull()
// })

import { createSelectSchema } from "drizzle-zod";
import { location } from "../schema";
import z from "zod"


const coordinateSchema = z.object({
    x: z.number().min(-180, "Longitude must be between -180 and 180")
        .max(180, "Longitude must be between -180 and 180"),
    y: z.number().min(-90, "Latitude must be between -90 and 90")
        .max(90, "Latitude must be between -90 and 90")
})

const LocationSchema = createSelectSchema(location, {
    name: z.string().min(3, "Please Provide a name fo this Location"),
    city: z.string().min(1),
    coordinates: coordinateSchema
})

export const CreateLocationSchema = LocationSchema.pick({
    name: true,
    coordinates: true,
    city: true
})
export type CreateLocationRequest = z.infer<typeof CreateLocationSchema>


export const UpdateLocationSchema = CreateLocationSchema.extend({
    locationId: z.string().min(1)
})
export type UpdateLocationRequest = z.infer<typeof UpdateLocationSchema>


