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