/**
 * AI SATELLITE — PHASE 23 INTERNAL LINKING & FREE RESOURCE RECOMMENDATION AGENT
 * Validates internal navigation links against verified site routes and curates directory resources.
 * Canonical Domain: https://aisatellite.dev
 */

export interface InternalLinkValidationResult {
  allLinksValid: boolean;
  validLinks: string[];
  brokenLinks: string[];
  excessiveLinkingFlag: boolean;
  linkCount: number;
}

export class InternalLinkingAgent {
  private static instance: InternalLinkingAgent;

  // Verified platform routes
  private validPlatformRoutes = new Set([
    '/',
    '/blog',
    '/tools',
    '/alternatives',
    '/solutions',
    '/topics',
    '/research',
    '/workflows',
    '/radar',
    '/workspace',
    '/community',
    '/trending',
    '/new-releases',
    '/partner-disclosure',
  ]);

  public static getInstance(): InternalLinkingAgent {
    if (!InternalLinkingAgent.instance) {
      InternalLinkingAgent.instance = new InternalLinkingAgent();
    }
    return InternalLinkingAgent.instance;
  }

  /**
   * Validates internal links referenced in an article draft.
   */
  public validateInternalLinks(links: string[]): InternalLinkValidationResult {
    const validLinks: string[] = [];
    const brokenLinks: string[] = [];

    for (const link of links) {
      const cleanPath = link.replace(/^https:\/\/aisatellite\.dev/i, '').split('?')[0].split('#')[0];
      const baseRoute = '/' + cleanPath.split('/')[1];

      if (this.validPlatformRoutes.has(cleanPath) || this.validPlatformRoutes.has(baseRoute)) {
        validLinks.push(link);
      } else {
        brokenLinks.push(link);
      }
    }

    const linkCount = links.length;
    // Excessive linking check: flag if more than 15 links per article
    const excessiveLinkingFlag = linkCount > 15;

    return {
      allLinksValid: brokenLinks.length === 0,
      validLinks,
      brokenLinks,
      excessiveLinkingFlag,
      linkCount,
    };
  }

  /**
   * Identifies verified free AI Satellite resources for a topic.
   */
  public recommendFreeResources(category: string, keywords: string[]): string[] {
    const text = `${category} ${keywords.join(' ')}`.toLowerCase();
    const recommendations: string[] = [];

    if (text.includes('database') || text.includes('postgres') || text.includes('sql')) {
      recommendations.push('postgresql', 'sqlite', 'supabase');
    }
    if (text.includes('ai') || text.includes('agent') || text.includes('llm') || text.includes('rag')) {
      recommendations.push('ollama', 'digi-labs');
    }
    if (text.includes('cloud') || text.includes('hosting') || text.includes('docker') || text.includes('vps')) {
      recommendations.push('coolify', 'minio');
    }
    if (text.includes('office') || text.includes('crm') || text.includes('productivity')) {
      recommendations.push('digioffice-suite', 'chatwoot');
    }

    if (recommendations.length === 0) {
      recommendations.push('coolify', 'postgresql');
    }

    return Array.from(new Set(recommendations));
  }
}

export const internalLinkingAgent = InternalLinkingAgent.getInstance();
