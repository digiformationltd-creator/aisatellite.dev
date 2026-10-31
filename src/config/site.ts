export type DeploymentEnvironment = 'production' | 'staging' | 'preview' | 'development';

export interface SiteConfig {
  siteUrl: string;
  siteName: string;
  siteDescription: string;
  canonicalOrigin: string;
  deploymentEnvironment: DeploymentEnvironment;
  isProduction: boolean;
  isIndexingAllowed: boolean;
}

// Environment detection
const rawSiteUrl =
  (typeof process !== 'undefined' && (process.env.PUBLIC_SITE_URL || process.env.SITE_URL || process.env.CANONICAL_ORIGIN)) ||
  'https://aisatellite.dev';

const cleanSiteUrl = rawSiteUrl.replace(/\/+$/, '');

let deploymentEnvironment: DeploymentEnvironment = 'production';
if (process.env.DEPLOYMENT_ENVIRONMENT === 'staging') {
  deploymentEnvironment = 'staging';
} else if (process.env.DEPLOYMENT_ENVIRONMENT === 'preview' || (process.env.CF_PAGES_BRANCH && process.env.CF_PAGES_BRANCH !== 'main' && process.env.CF_PAGES_BRANCH !== 'master')) {
  deploymentEnvironment = 'preview';
} else if (process.env.DEPLOYMENT_ENVIRONMENT === 'development' || process.env.NODE_ENV === 'development') {
  deploymentEnvironment = 'development';
} else {
  deploymentEnvironment = 'production';
}

const isProduction = deploymentEnvironment === 'production';
// Staging and preview deployments are strictly protected from search indexing
const isIndexingAllowed = isProduction;

export const siteConfig: SiteConfig = {
  siteUrl: cleanSiteUrl,
  siteName:
    (typeof process !== 'undefined' && process.env.PUBLIC_SITE_NAME) ||
    'AI Satellite',
  siteDescription:
    (typeof process !== 'undefined' && process.env.PUBLIC_SITE_DESCRIPTION) ||
    'Explore free alternatives, AI tools, open-source software, developer prompts and practical technology solutions.',
  canonicalOrigin: cleanSiteUrl,
  deploymentEnvironment,
  isProduction,
  isIndexingAllowed,
};

/**
 * Builds a strictly canonical URL based on verified canonical origin
 */
export function getCanonicalUrl(pathname: string = '/'): string {
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${siteConfig.canonicalOrigin}${normalizedPath === '/' ? '' : normalizedPath.replace(/\/+$/, '')}`;
}

/**
 * Returns absolute Open Graph image URL
 */
export function getOgImageUrl(imagePath: string = '/og-default.png'): string {
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  const normalized = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${siteConfig.canonicalOrigin}${normalized}`;
}
