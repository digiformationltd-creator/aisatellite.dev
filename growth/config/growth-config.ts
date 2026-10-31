/**
 * AI Satellite — Growth Engine Central Configuration
 * Strictly adheres to Brand Separation & Operational Independence.
 */

export const GROWTH_CONFIG = {
  brand: {
    name: 'AI Satellite',
    tagline: 'Explore the Free Universe of AI, Open Source & Development',
    productionDomain: 'https://aisatellite.pages.dev',
    canonicalBase: 'https://aisatellite.pages.dev',
    senderIdentity: {
      fromName: 'AI Satellite Dispatch',
      fromEmail: process.env.NEWSLETTER_FROM_EMAIL || 'dispatch@aisatellite.pages.dev',
      supportEmail: process.env.SUPPORT_EMAIL || 'contact@aisatellite.pages.dev',
    },
    newsletter: {
      title: 'AI Satellite Weekly Orbit',
      privacyPolicyUrl: 'https://aisatellite.pages.dev/privacy',
      unsubscribeBaseUrl: 'https://aisatellite.pages.dev/api/growth/unsubscribe',
      confirmBaseUrl: 'https://aisatellite.pages.dev/api/growth/confirm',
    },
  },
  admin: {
    // Shared admin access token for Growth Control Center API
    adminToken: process.env.GROWTH_ADMIN_TOKEN || 'satellite-growth-dev-token-2026',
    sessionExpiryHours: 24,
  },
  seo: {
    sitemapUrl: 'https://aisatellite.pages.dev/sitemap-index.xml',
    robotsUrl: 'https://aisatellite.pages.dev/robots.txt',
    staleThresholdDays: 90,
    maxInternalLinkDepth: 3,
  },
  searchConsole: {
    siteUrl: 'sc-domain:aisatellite.pages.dev',
    credentialsConfigured: Boolean(process.env.GOOGLE_SEARCH_CONSOLE_KEY || process.env.GOOGLE_APPLICATION_CREDENTIALS),
  },
  distribution: {
    maxRetries: 3,
    retryDelayMs: 1000,
    rateLimitBackoffMultiplier: 2,
    autoPublishEnabled: false, // Strict human approval gate required
  },
  privacy: {
    saltDailyRotation: true,
    respectDoNotTrack: true,
    collectIp: false, // Never collect raw IPs
  },
};
