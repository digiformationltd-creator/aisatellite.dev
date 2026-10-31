export interface LinkAuditResult {
  totalChecked: number;
  brokenCount: number;
  brokenLinks: Array<{ source: string; target: string; reason: string }>;
  duplicateCanonicals: string[];
  auditedAt: string;
}

export class BrokenLinkChecker {
  private knownValidPaths = new Set([
    '/',
    '/alternatives',
    '/alternatives/zapier-alternatives',
    '/alternatives/photoshop-alternatives',
    '/alternatives/firebase-alternatives',
    '/3d-lab',
    '/projects',
    '/solutions',
    '/solutions/free-customer-support-system',
    '/solutions/local-rag-ai-search-ollama-chroma',
    '/prompts',
    '/prompts/builder',
    '/prompts/claude-code-senior-architect',
    '/radar',
    '/search',
    '/workspace',
    '/tools/postgresql',
    '/tools/sqlite',
    '/tools/supabase',
    '/tools/ollama',
    '/tools/n8n',
    '/tools/cloudflare-pages',
    '/tools/coolify',
    '/tools/minio',
    '/topics/databases',
    '/topics/ai-development',
    '/topics/automation',
    '/topics/security',
    '/tutorials',
    '/components',
    '/privacy',
    '/terms',
    '/editorial-policy',
    '/partner-disclosure',
  ]);

  public auditLinks(links: Array<{ source: string; target: string }>): LinkAuditResult {
    const broken: Array<{ source: string; target: string; reason: string }> = [];

    for (const link of links) {
      if (link.target.startsWith('http://') || link.target.startsWith('https://')) {
        // External link check
        try {
          const parsed = new URL(link.target);
          if (!parsed.hostname.includes('.')) {
            broken.push({ source: link.source, target: link.target, reason: 'Malformed external domain' });
          }
        } catch {
          broken.push({ source: link.source, target: link.target, reason: 'Invalid URL syntax' });
        }
      } else {
        // Internal link check
        const cleanPath = link.target.split('#')[0].split('?')[0].replace(/\/+$/, '') || '/';
        if (!this.knownValidPaths.has(cleanPath)) {
          broken.push({ source: link.source, target: link.target, reason: 'Target route not found in sitemap' });
        }
      }
    }

    return {
      totalChecked: links.length,
      brokenCount: broken.length,
      brokenLinks: broken,
      duplicateCanonicals: [],
      auditedAt: new Date().toISOString(),
    };
  }
}

export const brokenLinkChecker = new BrokenLinkChecker();
