/**
 * AI Satellite — Free API Directory Engine (Phase 11)
 * Curated registry of verified developer APIs with official documentation, rate limits,
 * commercial terms, and safe code snippets strictly utilizing placeholders.
 */

import type { FreeAPIResource } from './types';

export class FreeAPIDirectory {
  private apis: FreeAPIResource[] = [
    {
      id: 'api-open-meteo',
      title: 'Open-Meteo Weather Forecast API',
      slug: 'open-meteo-weather-api',
      summary: 'Open-source weather API offering hourly forecasts, historical climate data, and solar radiation metrics with zero API key requirement.',
      category: 'free_apis',
      tags: ['weather', 'climate', 'rest-api', 'no-auth', 'open-source'],
      authorOrMaintainer: 'Open-Meteo GmbH',
      sourceReferences: [
        { title: 'Open-Meteo Documentation', url: 'https://open-meteo.com/en/docs' },
        { title: 'GitHub Repository', url: 'https://github.com/open-meteo/open-meteo' },
      ],
      verificationStatus: 'verified',
      lastVerifiedDate: '2026-10-31',
      publishedDate: '2026-10-31',
      updatedDate: '2026-10-31',
      relatedResourceIds: ['tutorial-cloudflare-worker-api-proxy'],
      editorialStatus: 'published',
      searchKeywords: ['weather api', 'free weather', 'no key api', 'open-meteo'],
      endpointBaseUrl: 'https://api.open-meteo.com/v1',
      documentationUrl: 'https://open-meteo.com/en/docs',
      authenticationType: 'None',
      freeTierQuota: 'Up to 10,000 daily API calls for non-commercial and commercial open-source projects',
      rateLimitsVerified: '10,000 daily calls, max 600 calls/minute',
      commercialUsageAllowed: true,
      exampleRequestSnippet: `// Example: Fetch 7-day temperature forecast using native fetch
const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m');
const data = await res.json();
console.log('Hourly temperatures:', data.hourly.temperature_2m);`,
      supportedLanguages: ['JavaScript', 'TypeScript', 'Python', 'Go', 'Rust', 'cURL'],
      knownLimitations: ['High-volume enterprise commercial use requires a paid subscription or self-hosting the open-source model engine.'],
    },
    {
      id: 'api-rest-countries',
      title: 'REST Countries v3.1',
      slug: 'rest-countries-api',
      summary: 'Get comprehensive information about world nations, currencies, capitals, languages, and coordinates via REST endpoints.',
      category: 'free_apis',
      tags: ['countries', 'geography', 'currencies', 'no-auth', 'public-data'],
      authorOrMaintainer: 'REST Countries Community & GitLab',
      sourceReferences: [
        { title: 'REST Countries Docs', url: 'https://restcountries.com/' },
      ],
      verificationStatus: 'verified',
      lastVerifiedDate: '2026-10-31',
      publishedDate: '2026-10-31',
      updatedDate: '2026-10-31',
      relatedResourceIds: ['tutorial-cloudflare-worker-api-proxy'],
      editorialStatus: 'published',
      searchKeywords: ['countries api', 'currency api', 'world geography', 'rest countries'],
      endpointBaseUrl: 'https://restcountries.com/v3.1',
      documentationUrl: 'https://restcountries.com/',
      authenticationType: 'None',
      freeTierQuota: 'Unlimited fair-use requests',
      rateLimitsVerified: 'Fair use; rate limiting applies to excessive scraping (>100 req/sec)',
      commercialUsageAllowed: true,
      exampleRequestSnippet: `// Example: Fetch country details by name with safe placeholder
const countryName = 'canada';
const res = await fetch(\`https://restcountries.com/v3.1/name/\${encodeURIComponent(countryName)}\`);
const [country] = await res.json();
console.log(\`Capital: \${country.capital[0]}, Region: \${country.region}\`);`,
      supportedLanguages: ['JavaScript', 'Python', 'cURL', 'PHP', 'Swift'],
      knownLimitations: ['Data is cached at edge; real-time political boundary shifts may have slight propagation lag.'],
    },
    {
      id: 'api-github-rest',
      title: 'GitHub REST API v3 (Public Tier)',
      slug: 'github-rest-api',
      summary: 'Query open-source repositories, release artifacts, commits, and issue trackers directly from GitHub Edge.',
      category: 'free_apis',
      tags: ['github', 'open-source', 'git', 'developer-tools'],
      authorOrMaintainer: 'GitHub, Inc.',
      sourceReferences: [
        { title: 'GitHub REST API Documentation', url: 'https://docs.github.com/en/rest' },
      ],
      verificationStatus: 'verified',
      lastVerifiedDate: '2026-10-31',
      publishedDate: '2026-10-31',
      updatedDate: '2026-10-31',
      relatedResourceIds: ['open-source-coolify', 'open-source-ollama'],
      editorialStatus: 'published',
      searchKeywords: ['github api', 'git api', 'repo info', 'github releases'],
      endpointBaseUrl: 'https://api.github.com',
      documentationUrl: 'https://docs.github.com/en/rest',
      authenticationType: 'API Key (Free)',
      freeTierQuota: '60 requests/hr unauthenticated; 5,000 requests/hr with free Personal Access Token',
      rateLimitsVerified: '5,000 requests per hour per authenticated token',
      commercialUsageAllowed: true,
      exampleRequestSnippet: `// Example: Fetch latest release for repository using safe token placeholder
const token = process.env.GITHUB_TOKEN || 'YOUR_GITHUB_PERSONAL_ACCESS_TOKEN_HERE';
const res = await fetch('https://api.github.com/repos/ollama/ollama/releases/latest', {
  headers: {
    'Accept': 'application/vnd.github+json',
    'Authorization': \`Bearer \${token}\`,
    'X-GitHub-Api-Version': '2022-11-28',
  },
});
const release = await res.json();
console.log('Latest Ollama release:', release.tag_name);`,
      supportedLanguages: ['JavaScript', 'TypeScript', 'Python', 'Go', 'cURL'],
      knownLimitations: ['Primary rate limit resets hourly; search API has a stricter 30 requests/minute limit.'],
    },
  ];

  public getAllAPIs(): FreeAPIResource[] {
    return [...this.apis];
  }

  public getAPIBySlug(slug: string): FreeAPIResource | undefined {
    return this.apis.find((a) => a.slug === slug);
  }

  public getAPIsByTag(tag: string): FreeAPIResource[] {
    return this.apis.filter((a) => a.tags.includes(tag.toLowerCase()));
  }
}

export const freeAPIDirectory = new FreeAPIDirectory();
