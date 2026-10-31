import type { FreeClassification } from '../shared/types.js';

export interface PricingEvaluationOptions {
  isOpenSource: boolean;
  hasPerpetualFreeTier?: boolean;
  isFreeTrialOnly?: boolean;
  requiresCreditCard?: boolean;
  hasPaidTiers?: boolean;
  pricingPageText?: string;
}

export interface PricingEvaluationResult {
  classification: FreeClassification;
  requiresCreditCard: boolean;
  limitations: string[];
  reasons: string[];
}

export class PricingVerifier {
  /**
   * Deterministically determines the free classification
   */
  static evaluate(options: PricingEvaluationOptions): PricingEvaluationResult {
    const limitations: string[] = [];
    const reasons: string[] = [];

    const text = (options.pricingPageText || '').toLowerCase();

    // Check for trial indicators
    const isTrialOnly =
      options.isFreeTrialOnly ||
      text.includes('14-day trial') ||
      text.includes('30-day trial') ||
      text.includes('free trial for');

    // Check credit card requirement
    const requiresCreditCard =
      options.requiresCreditCard ||
      text.includes('credit card required') ||
      text.includes('billing information required to start');

    if (requiresCreditCard) {
      limitations.push('Credit card required during sign-up');
      reasons.push('Provider requires credit card upfront.');
    }

    // 1. Fully open source
    if (options.isOpenSource) {
      return {
        classification: 'open_source',
        requiresCreditCard: false,
        limitations: limitations.length > 0 ? limitations : ['Self-hosting infrastructure required'],
        reasons: ['Verified OSI-compliant open-source license allows self-hosting.'],
      };
    }

    // 2. Free trial only (MUST NOT be classified as free_forever)
    if (isTrialOnly) {
      return {
        classification: 'free_trial',
        requiresCreditCard,
        limitations: ['Time-limited access only', ...limitations],
        reasons: ['Access expires after trial period; not eligible as a perpetual free tier.'],
      };
    }

    // 3. Freemium (has free tier and paid tiers)
    if (options.hasPaidTiers && options.hasPerpetualFreeTier) {
      return {
        classification: 'freemium',
        requiresCreditCard,
        limitations: ['Usage limits apply (bandwidth, API calls, or storage)', ...limitations],
        reasons: ['Perpetual free tier available with optional paid tier upgrades.'],
      };
    }

    // 4. Free forever
    if (options.hasPerpetualFreeTier && !options.hasPaidTiers) {
      return {
        classification: 'free_forever',
        requiresCreditCard,
        limitations: limitations,
        reasons: ['Service offers completely free access with no paid plan tiers.'],
      };
    }

    // 5. Paid only
    if (options.hasPaidTiers && !options.hasPerpetualFreeTier) {
      return {
        classification: 'paid',
        requiresCreditCard: true,
        limitations: ['Paid subscription required'],
        reasons: ['No verified free tier or open-source distribution found.'],
      };
    }

    return {
      classification: 'unknown',
      requiresCreditCard,
      limitations: ['Free tier status unverified'],
      reasons: ['Insufficient pricing evidence to classify.'],
    };
  }
}
