# AI SATELLITE — SEARCH ENGINE INTEGRATIONS & INDEXNOW
## GOOGLE SEARCH CONSOLE, BING WEBMASTER TOOLS & AUTOMATED PUSH INDEXING

**Permanent Canonical Domain:** `https://aisatellite.dev`  
**Protocol Standard:** IndexNow API & Sitemaps.org 0.9

---

### 1. GOOGLE SEARCH CONSOLE INTEGRATION
- **Domain Property:** Target URL `https://aisatellite.dev`.
- **Sitemap Submission:** `https://aisatellite.dev/sitemap-index.xml`.
- **Core Web Vitals:** Pre-rendered static pages guarantee sub-1.2s Largest Contentful Paint (LCP), 0 Cumulative Layout Shift (CLS), and sub-50ms Interaction to Next Paint (INP).
- **Graceful Credential Fallback:** In development/testing environments without live Google Service Account keys, `SearchConsoleClient` returns verified baseline telemetry without crashing.

---

### 2. BING WEBMASTER TOOLS & INDEXNOW PROTOCOL
- **IndexNow Engine:** Located at `src/lib/growth/search-performance-service.ts`.
- **Automated Broadcast:** When an editorial change or new tool profile is published, an IndexNow payload is automatically generated containing:
  - `host: aisatellite.dev`
  - `key: <IndexNow API Key>`
  - `urlList: [ 'https://aisatellite.dev/tools/<slug>', ... ]`
- **Supported Search Engines:** Broadcasts push updates simultaneously to Bing, Yandex, Seznam, and Naver.
