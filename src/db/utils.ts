import z from "zod"
import type { Role } from "./validations/profile.validation"
import slugify from 'slugify'
import { nanoid } from "nanoid"

export const PaginatorSchema=z.object({
    page:z.number().optional(),
    limit:z.number().optional()
})
export type PaginatorRequest=z.infer<typeof PaginatorSchema>


export const SupportedNotifications = [
  'booking_confirmed',
  'booking_cancelled',
  'event_cancelled',
  'event_reminder',
  'refund_processed',
  'review_received',
] as const 

export const SupportedCurrencies = ['USD', 'KES', 'EUR', 'GBP'] as const
export const SupportedProviders = ['stripe', 'mpesa', 'paypal', 'flutterwave'] as const
export const SupportedEventCategories=['music', 'tech', 'food', 'sports', 'arts', 'business'] as const
export const SupportedEventStatus=['draft', 'published', 'cancelled'] as const
export const SupportedBookingStatus=['pending', 'confirmed', 'cancelled'] as const
export const SupportedPaymentStatus=['pending', 'paid', 'refunded'] as const
export const SupportedUserRoles=['admin', 'user',"premium"] as const




export type UserMetadata = {
  role: Role
  first_name: string
  last_name: string
  avatar_url?: string | null
}

// Extend Supabase's default types
declare module '@supabase/supabase-js' {
  interface UserMetadata {
    role: Role
    first_name: string
    last_name: string
    avatar_url?: string | null
  }
}



export function generateSlug(title: string): string {
  const base = slugify(title, { lower: true, strict: true })
  const uid  = nanoid(5)
  return `${base}-${uid}` // "nairobi-tech-summit-2026-abc123"
}


