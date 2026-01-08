/**
 * Application configuration constants.
 * Centralized location for URLs, API endpoints, and other app-wide constants.
 */

export const appConfig = {
  /**
   * API Configuration
   */
  api: {
    baseUrl: process.env.EXPO_PUBLIC_API_URL || 'https://api.lifteller.com',
  },
  /**
   * External links and URLs
   */
  links: {
    termsOfUse: 'https://lifteller.com/terms',
    privacyPolicy: 'https://lifteller.com/privacy',
  },
  /**
   * Contact information
   */
  contact: {
    phone: '+234801 0987 918',
    email: 'ourEmailAddresGoesHere',
    x: 'x.com/lifteller',
    threads: 'thread.com/lifteller',
  },
} as const;
