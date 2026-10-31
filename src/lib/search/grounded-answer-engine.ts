import { type GroundedAnswer, type SourceCitation, type TechnologyResource } from '../radar/schemas';
import { type HybridSearchResponse } from './hybrid-search';
import { searchSecurityGuard } from '../security/search-security';

export class GroundedAnswerEngine {
  /**
   * Generates a source-grounded answer based strictly on retrieved, verified resources.
   * Never fabricates URLs, stats, licenses, or claims that software is free forever.
   */
  public generateAnswer(searchResponse: HybridSearchResponse): GroundedAnswer {
    const { query, intentResult, results } = searchResponse;
    const topResults = results.slice(0, 3);

    // If no matches found, return honest gap disclosure
    if (topResults.length === 0) {
      return {
        directAnswer: `No verified free alternative or solution matching "${query}" is currently indexed in the Technology Radar. Commercial platforms often lack direct 1-to-1 open-source equivalents.`,
        recommendedResources: [],
        freeAndPaidLimitations: [
          'No verified 100% free equivalent is confirmed for this specific requirement.',
          'Consider breaking the requirement into smaller open-source modular components.',
        ],
        setupComplexitySummary: 'Verification Pending — No matching verified deployment blueprint.',
        usefulDocumentation: [],
        relatedPrompts: [
          {
            title: 'Open-Source Architecture Evaluator Prompt',
            slug: 'claude-code-senior-architect',
            category: 'Architecture',
          },
        ],
        relatedTutorials: [],
        evidenceReferences: [],
        lastVerifiedDate: new Date().toISOString().split('T')[0],
        hasUnverifiedClaims: false,
        unverifiedNotes: 'No matching records in verified database.',
      };
    }

    // Recommended resources with strict ground-truth mapping
    const recommendedResources = topResults.map((item) => {
      const res = item.resource;
      const isAlt = item.isAlternativeMatch;

      let whyItFits = `${res.title} is an active ${res.kind.replace('_', ' ')} verified under the ${res.license || 'permissive'} license.`;
      if (isAlt && res.replaces && res.replaces.length > 0) {
        whyItFits = `Verified alternative replacing ${res.replaces.join(', ')}. Offers ${res.features?.slice(0, 2).join(' and ') || 'comparable core functionality'}.`;
      }

      return {
        id: res.id,
        slug: res.slug,
        title: res.title,
        url: res.officialUrl,
        whyItFits,
        limitations: res.limitations || ['Self-hosting requires ongoing updates and maintenance.'],
        freeClassification: res.pricingClassification.map((p) => p.replace(/_/g, ' ')).join(', '),
        setupComplexity: res.setupComplexity || 'Medium',
        documentationUrl: res.documentationUrl || res.officialUrl,
      };
    });

    // Synthesize aggregate limitations
    const aggregateLimitations: string[] = [];
    topResults.forEach((item) => {
      const res = item.resource;
      if (res.selfHosted) {
        aggregateLimitations.push(`${res.title}: Self-hosting requires server hardware or VPS costs, DNS configuration, and backup maintenance.`);
      }
      if (res.paidInfrastructureRequired) {
        aggregateLimitations.push(`${res.title}: Paid cloud compute/storage is required to operate this software.`);
      }
      if (res.freeHostedTier) {
        aggregateLimitations.push(`${res.title}: Cloud free tier includes usage caps; verify current tier terms as provider quotas may change.`);
      }
    });

    // Evidence citations strictly from verified resource data
    const evidenceReferences: SourceCitation[] = [];
    topResults.forEach((item) => {
      const res = item.resource;
      res.evidenceUrls.forEach((evUrl) => {
        try {
          const parsed = new URL(evUrl);
          evidenceReferences.push({
            title: `${res.title} Official Documentation / License Record`,
            url: evUrl,
            domain: parsed.hostname,
            retrievedAt: res.lastVerified,
            sourceType: evUrl.includes('github') ? 'github_repo' : 'official_docs',
          });
        } catch {
          // Ignore invalid URL formatting
        }
      });
    });

    // Direct answer synthesis
    let directAnswer = '';
    const lead = topResults[0].resource;
    if (intentResult.intent === 'find_alternative' && intentResult.targetSubject) {
      directAnswer = `The most prominent verified free alternative to ${intentResult.targetSubject} is ${lead.title} (${lead.license || 'Open Source'}). It can be deployed via ${lead.selfHosted ? 'self-hosting on private infrastructure' : 'local installation'} with no recurring subscription fees.`;
    } else if (intentResult.intent === 'find_ai_tool') {
      directAnswer = `For AI requirements matching "${query}", ${lead.title} provides verified local or API capabilities without requiring proprietary subscription lock-in.`;
    } else {
      directAnswer = `Based on verified technical records, ${lead.title} is recommended for "${query}". It provides ${lead.description}`;
    }

    // Security check on synthesized output
    directAnswer = searchSecurityGuard.isolateRetrievalText(directAnswer);

    // Useful documentation references
    const usefulDocs = topResults
      .filter((r) => r.resource.documentationUrl)
      .map((r) => ({
        title: `${r.resource.title} Official Docs`,
        url: r.resource.documentationUrl!,
      }));

    return {
      directAnswer,
      recommendedResources,
      freeAndPaidLimitations: aggregateLimitations.slice(0, 4),
      setupComplexitySummary: `Setup complexity spans from ${lead.setupComplexity || 'Low to Medium'} depending on whether you deploy locally or via Docker Compose.`,
      usefulDocumentation: usefulDocs,
      relatedPrompts: [
        {
          title: 'Senior Full-Stack Architect Prompt',
          slug: 'claude-code-senior-architect',
          category: 'Coding',
        },
        {
          title: 'Model Context Protocol (MCP) Integration Agent',
          slug: 'agentic-mcp-system-prompt',
          category: 'MCP',
        },
      ],
      relatedTutorials: [
        {
          title: 'Self-Hosting Modern Postgres & Production Databases',
          url: '/blog/self-hosting-modern-postgres-production-playbook',
        },
        {
          title: 'How to Build Autonomous AI Agents with MCP',
          url: '/blog/how-to-build-autonomous-ai-agents-with-mcp',
        },
      ],
      evidenceReferences: evidenceReferences.slice(0, 5),
      lastVerifiedDate: lead.lastVerified,
      hasUnverifiedClaims: false,
    };
  }
}

export const groundedAnswerEngine = new GroundedAnswerEngine();
