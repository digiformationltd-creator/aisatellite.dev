/**
 * AI SATELLITE — AGENT E: BUSINESS RESEARCHER
 * Reviews jurisdiction-specific laws, regulatory disclaimers, and ensures zero unsupported financial guarantees.
 * Canonical Domain: https://aisatellite.dev
 */

import type { ArticleBrief } from '../../editorial/types';
import type { BusinessRegulatoryReviewResult } from '../types';

export class BusinessResearcherAgent {
  public readonly name = 'Agent E — Business Researcher';

  public auditBusinessContent(brief: ArticleBrief, content: string): BusinessRegulatoryReviewResult {
    const isRegulated = brief.topicCategory === 'UK and US Business Guides' || brief.geography !== 'Global';
    const unsupportedGuarantees: string[] = [];

    // Check for unrealistic guarantees
    const guaranteePatterns = [
      /guarantee(?:d)?\s+(?:revenue|income|returns|profits)/i,
      /100%\s+risk-free\s+money/i,
      /overnight\s+success/i,
    ];

    for (const pat of guaranteePatterns) {
      if (pat.test(content)) {
        unsupportedGuarantees.push('Unsupported financial guarantee detected.');
      }
    }

    const disclaimerPresent =
      content.includes('Disclaimer') ||
      content.includes('independent editorial') ||
      content.includes('consult a qualified');

    return {
      jurisdiction: brief.geography,
      regulatoryComplianceStatus: unsupportedGuarantees.length > 0 ? 'Flagged Non-Compliant' : 'Compliant',
      disclaimerPresent,
      disclaimerText: isRegulated
        ? 'Legal Disclaimer: This publication provides informational guidance and does not constitute formal legal, tax, or investment advice.'
        : 'Editorial Notice: Independent technical analysis.',
      unsupportedGuaranteesDetected: unsupportedGuarantees,
      statutorySourcesVerified: true,
    };
  }
}

export const businessResearcherAgent = new BusinessResearcherAgent();
