import { relations } from 'drizzle-orm'
import { pgSchema, pgTable,  text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { ticket } from './ticket.schema'
import { review } from './review.schema'
import { notification } from './notification.schema'
import { payment } from './payment.schema'
import { SupportedUserRoles } from '../utils'
import { event } from './event.schema'

const authSchema = pgSchema('auth')
const authUsers = authSchema.table('users', {
  id: uuid('id').primaryKey(),
})

export const profile = pgTable('profile', {
  id: uuid('id').primaryKey().references(() => authUsers.id, { onDelete: 'cascade' }),         // same UUID as auth.users.id
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email:text('email').notNull().unique(),
  avatarUrl: text('avatar_url'),
  role: text("role", { enum:SupportedUserRoles }).default('user'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().$onUpdate(() => new Date()),
})


// ── Relations (for Drizzle query API) ────────────────────
export const profileRelations = relations(profile, ({ many }) => ({
  payments:many(payment),
    // events this user has CREATED (premium/admin only)
  createdEvents: many(event),
  reviews: many(review),
  tickets: many(ticket),
  notifications: many(notification),
}))