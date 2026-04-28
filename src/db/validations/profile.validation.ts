// export const profile = pgTable('profile', {
//   id: uuid('id').primaryKey().references(() => authUsers.id, { onDelete: 'cascade' }),         // same UUID as auth.users.id
//   firstName: text('first_name').notNull(),
//   lasttName: text('last_name').notNull(),
//   avatarUrl: text('avatar_url'),
//   role: text("role", { enum: ['admin', 'user'] }).default('user').notNull(),
//   createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
//   updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().$onUpdate(() => new Date()),
// })

import { createSelectSchema } from "drizzle-zod";
import { profile } from "../schema";
import z from "zod";

export const ProfileSignUpSchema=createSelectSchema(profile)
.extend({
    email:z.string(),
    password:z.string(),
    confirmPassword:z.string()
})
.pick({
    email:true,
    password:true,
    confirmPassword:true,
    firstName:true,
    lastName:true,
})

export const ProfileSignInSchema=createSelectSchema(profile)
.extend({
    email:z.string(),
    password:z.string()
})
.pick({
    email:true,
    password:true
})

export const EmailSchema=ProfileSignInSchema.pick({email:true})

export type ProfileSignUpRequest=z.infer<typeof ProfileSignUpSchema>

export type ProfileSignInRequest=z.infer<typeof ProfileSignInSchema>

export type EmailRequest=z.infer<typeof EmailSchema>