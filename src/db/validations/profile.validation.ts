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

export const ProfileSignUpSchema = createInsertSchema(profile, {
  firstName: z.string().min(2, "First name must be at least 2 characters").max(50, "First name too long"),
  lastName: z.string().min(2, "Last name must be at least 2 characters").max(50, "Last name too long"),
  avatarUrl: z.string().url("Invalid avatar URL").optional(),
})
.extend({
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
})
.pick({
  email: true,
  password: true,
  confirmPassword: true,
  firstName: true,
  lastName: true,
})
.refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

export const ProfileSignInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export const EmailSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export const UpdateProfileSchema = createInsertSchema(profile, {
  firstName: z.string().min(2, "First name must be at least 2 characters").max(50).optional(),
  lastName: z.string().min(2, "Last name must be at least 2 characters").max(50).optional(),
  avatarUrl: z.string().url("Invalid avatar URL").optional(),
})
.pick({
  firstName: true,
  lastName: true,
  avatarUrl: true,
})

export type ProfileSignUpRequest = z.infer<typeof ProfileSignUpSchema>
export type ProfileSignInRequest = z.infer<typeof ProfileSignInSchema>
export type EmailRequest = z.infer<typeof EmailSchema>
export type UpdateProfileRequest = z.infer<typeof UpdateProfileSchema>