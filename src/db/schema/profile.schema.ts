import { relations } from 'drizzle-orm'
import { pgSchema, pgTable,  text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { booking } from './booking.schema'
import { review } from './review.schema'
import { notification } from './notification.schema'
import { payment } from './payment.schema'
import { SupportedUserRoles } from '../utils'

const authSchema = pgSchema('auth')
const authUsers = authSchema.table('users', {
  id: uuid('id').primaryKey(),
})

export const profile = pgTable('profile', {
  id: uuid('id').primaryKey().references(() => authUsers.id, { onDelete: 'cascade' }),         // same UUID as auth.users.id
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email:text('email').notNull(),
  avatarUrl: text('avatar_url'),
  role: text("role", { enum:SupportedUserRoles }).default('user').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().$onUpdate(() => new Date()),
})


// ── Relations (for Drizzle query API) ────────────────────
export const profileRelations = relations(profile, ({ many }) => ({
  payments:many(payment),
  reviews: many(review),
  bookings: many(booking),
  notifications: many(notification),
}))