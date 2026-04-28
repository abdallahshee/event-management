// title: text('title').notNull(),
//   description: text('description'),
//   location: text('location'),
//   price: numeric('price', { precision: 10, scale: 2 }).notNull().default('0'),
//   capacity: integer('capacity').notNull(),
//   slotsRemaining: integer('slots_remaining').notNull(),
//   startsAt: timestamp('starts_at', { withTimezone: true }).notNull(),
//   endsAt: timestamp('ends_at', { withTimezone: true }).notNull(),

import {createSelectSchema} from "drizzle-zod"
import { event } from "../schema"
import z from "zod"
export const EventSchema=createSelectSchema(event,{
    
})
.pick({
    title:true,
    description:true,
    imageUrl:true,
    location:true,
    price:true,
    capacity:true,
    startsAt:true,
    endsAt:true
})
export type EventRequest=z.infer<typeof EventSchema>