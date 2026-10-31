import type { SupportedPlatform } from '../../schemas/index.js';
import { GROWTH_CONFIG } from '../../config/growth-config.js';
import { platformAdapters } from '../adapters/index.js';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

const CLICKBAIT_PATTERNS = [
  /\b(you won't believe|shocking|secret trick|mind blown|insane hack)\b/i,
  /\b(completely free forever with zero costs guaranteed)\b/i,
  /\b(destroying competitors overnight)\b/i,
];

export class DistributionContentValidator {
  validateDraft(platform: SupportedPlatform, text: string, targetUrl: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 1. Text presence
    if (!text || !text.trim()) {
      errors.push('Post content text cannot be empty');
      return { isValid: false, errors, warnings };
    }

    // 2. Length check
    const adapter = platformAdapters[platform];
    if (adapter && text.length > adapter.maxCharacters) {
      errors.push(`Content exceeds maximum character limit for ${platform} (${text.length} / ${adapter.maxCharacters})`);
    }

    // 3. Target URL check
    try {
      const parsedUrl = new URL(targetUrl);
      if (!targetUrl.startsWith(GROWTH_CONFIG.brand.canonicalBase)) {
        errors.push(`Target URL must belong to ${GROWTH_CONFIG.brand.canonicalBase}, got ${parsedUrl.origin}`);
      }
    } catch {
      errors.push(`Invalid target URL: "${targetUrl}"`);
    }

    // 4. Clickbait check
    for (const pattern of CLICKBAIT_PATTERNS) {
      if (pattern.test(text)) {
        errors.push(`Content contains sensationalist clickbait phrasing matching ${pattern}`);
      }
    }

    // 5. Accuracy check regarding "free" claims
    if (/\b100% free\b/i.test(text) && /\b(requires api key|bring your own key|openai|anthropic)\b/i.test(text)) {
      warnings.push('Draft claims "100% free" but references paid external API keys. Clarify self-hosting vs model API costs.');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }
}

export const distributionContentValidator = new DistributionContentValidator();
