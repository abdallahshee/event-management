import { relations } from "drizzle-orm";
import { pgTable, point, text } from "drizzle-orm/pg-core";
import { event } from "./event.schema";
import { nanoid } from "nanoid";

export const location=pgTable('location',{
    id:text("id").primaryKey().notNull().$default(()=>nanoid(12)),
    name:text('name').notNull(),
    city:text('city'),
    coordinates:point('coordinates',{mode:"xy"}).notNull()
})

export const locationRelations=relations(location,({many})=>({
    events:many(event)
}))