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
import type { InferSelectModel } from "drizzle-orm";

const ProfileSchema = createSelectSchema(profile, {
  firstName: z.string().min(2, "First name must be at least 2 characters").max(50, "First name too long"),
  lastName: z.string().min(2, "Last name must be at least 2 characters").max(50, "Last name too long"),
  email: z.email().nonempty(),
  avatarUrl: z.url().optional()
}).extend({
  password: z.string()
})

export const SignUpSchema = ProfileSchema
  .pick({
    email: true,
    firstName: true,
    lastName: true,
    password: true
  }).extend({ confirmPassword: z.string().min(1, "Please confirm your password") })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
export type SignUpRequest = z.infer<typeof SignUpSchema>


export const SignInSchema = ProfileSchema.pick({
  email: true,
  password: true
})
export type SignInRequest = z.infer<typeof SignInSchema>


export const UpdateProfileSchema = ProfileSchema.pick({
  firstName: true,
  lastName: true,
  avatarUrl: true
})
export type UpdateProfileRequest = z.infer<typeof UpdateProfileSchema>

export type Role = InferSelectModel<typeof profile>["role"]