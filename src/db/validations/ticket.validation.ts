// export const booking = pgTable('booking', {
//   id:          text('id').primaryKey().$default(()=>nanoid(16)),
//   userId:      uuid('user_id').notNull().references(() => profile.id),
//   totalAmount: numeric('total_amount', { precision: 10, scale: 2 }).notNull(),
//   status:      text('status', { enum: ['pending', 'confirmed', 'cancelled'] }).default('pending').notNull(),
//   createdAt:   timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
//   updatedAt:   timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().$onUpdate(() => new Date()),
// })

import { createSelectSchema } from "drizzle-zod";
import z from "zod"
import { PaginatorSchema } from "../utils";
import { ticket } from "../schema/ticket.schema";


const TicketSchema = createSelectSchema(ticket, {
  eventId: z.string().nonempty(),
  userId: z.string().nonempty(),
  amount: z.number().min(1)
})

export const CreateTicketSchema = TicketSchema
  .pick({
    eventId: true,
    userId: true,
    amount: true
  })
export type CreateTicketRequest = z.infer<typeof CreateTicketSchema>


export const GetUserTicketsSchema = TicketSchema.pick({ userId: true })
  .extend(PaginatorSchema.shape)
export type GetUserTicketsRequest = z.infer<typeof GetUserTicketsSchema>




