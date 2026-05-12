import z from "zod"
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
export const SupportedUserRoles=['admin', 'user'] as const



