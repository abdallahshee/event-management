// export const profile = pgTable('profile', {
//   id: uuid('id').primaryKey().references(() => authUsers.id, { onDelete: 'cascade' }),         // same UUID as auth.users.id
//   firstName: text('first_name').notNull(),
//   lasttName: text('last_name').notNull(),
//   avatarUrl: text('avatar_url'),
//   role: text("role", { enum: ['admin', 'user'] }).default('user').notNull(),
//   createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
//   updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().$onUpdate(() => new Date()),
// })

import { createInsertSchema } from "drizzle-zod";
import { profile } from "../schema";
import z from "zod";

export const SignUpSchema = createInsertSchema(profile, {
  firstName: z.string().min(2, "First name must be at least 2 characters").max(50, "First name too long"),
  lastName: z.string().min(2, "Last name must be at least 2 characters").max(50, "Last name too long"),
  email: z.email().nonempty(),
})
  .pick({
    email: true,
    firstName: true,
    lastName: true,
  })  .extend({
    password: z.string(),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
export type SignUpRequest = z.infer<typeof SignUpSchema>


export const SignInSchema = z.object({
  email: z.email().nonempty(),
  password: z.string().min(1, "Password is required"),
})
export type SignInRequest = z.infer<typeof SignInSchema>


export const UpdateProfileSchema = createInsertSchema(profile, {
  firstName: z.string().min(2, "First name must be at least 2 characters").max(50),
  lastName: z.string().min(2, "Last name must be at least 2 characters").max(50),
  avatarUrl: z.url().optional(),
})
  .pick({
    firstName: true,
    lastName: true,
    avatarUrl: true,
  })
export type UpdateProfileRequest = z.infer<typeof UpdateProfileSchema>