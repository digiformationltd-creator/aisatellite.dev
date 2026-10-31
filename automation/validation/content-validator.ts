import type { ArticleDraft } from '../shared/types.js';
import { ConfigManager } from '../shared/config.js';

export interface ValidationReport {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class ContentValidator {
  private configManager: ConfigManager;

  constructor() {
    this.configManager = new ConfigManager();
  }

  /**
   * Performs technical and compliance validation on an article draft
   */
  validateDraft(draft: ArticleDraft): ValidationReport {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 1. Title and Description checks
    if (!draft.title || draft.title.length < 5) {
      errors.push('Title is missing or shorter than 5 characters.');
    }
    if (!draft.description || draft.description.length < 10) {
      errors.push('Description is missing or shorter than 10 characters.');
    }
    if (!draft.slug || !/^[a-z0-9-]+$/.test(draft.slug)) {
      errors.push(`Invalid slug format: "${draft.slug}". Must be lowercase alphanumeric with hyphens.`);
    }

    // 2. Evidence sufficiency check
    if (!draft.evidenceLedger || draft.evidenceLedger.length < 1) {
      errors.push('Draft fails evidence grounding: evidence ledger is empty.');
    } else {
      for (const record of draft.evidenceLedger) {
        if (!record.sourceUrl || !record.sourceUrl.startsWith('http')) {
          errors.push(`Invalid source URL in evidence claim ${record.claimId}: ${record.sourceUrl}`);
        }
      }
    }

    // 3. Markdown / MDX structure check
    const content = draft.mdxContent || '';
    if (content.length < 100) {
      errors.push('Article body is too short (under 100 characters).');
    }

    // Check code blocks balance
    const backtickCount = (content.match(/```/g) || []).length;
    if (backtickCount % 2 !== 0) {
      errors.push('Unbalanced code fences (```) detected in article body.');
    }

    // 4. Commercial disclosure check
    if (draft.partnerContext !== 'none') {
      const partners = this.configManager.getPartners();
      const partner = partners[draft.partnerContext];
      if (partner) {
        if (!content.includes('Partner Recommendation') && !content.includes('Commercial Relationship')) {
          errors.push(
            `Missing mandatory commercial disclosure for affiliated partner: ${partner.name}`
          );
        }
      }
    }

    // 5. Prohibited Pattern & Security scanning
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes('curl -s') && lowerContent.includes('| bash') && !lowerContent.includes('warning')) {
      warnings.push('Dangerous piped execution command (curl | bash) without prominent warning.');
    }
    if (lowerContent.includes('100% guaranteed') && lowerContent.includes('bank')) {
      errors.push('Prohibited claim: Never guarantee commercial or bank account approval.');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }
}
