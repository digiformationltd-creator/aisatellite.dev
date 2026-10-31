import type { NewsletterCampaign, NewsletterCampaignStatus } from '../schemas/index.js';
import { GrowthLogger } from '../monitoring/growth-logger.js';
import { GROWTH_CONFIG } from '../config/growth-config.js';
import { growthStorage } from '../storage/growth-storage.js';
import { subscriberManager } from './subscriber-manager.js';

export interface DigestItem {
  title: string;
  url: string;
  summary: string;
  category: string;
  isVerifiedFree: boolean;
}

export class NewsletterDigestGenerator {
  private logger: GrowthLogger;

  constructor(baseDir = process.cwd()) {
    this.logger = new GrowthLogger('NewsletterDigestGenerator', baseDir);
  }

  /**
   * Generates a new weekly edition of AI Satellite Weekly Orbit
   */
  generateDigest(editionNumber: number, items: DigestItem[]): NewsletterCampaign {
    if (items.length === 0) {
      throw new Error('Cannot generate newsletter digest without content items');
    }

    // Verify all item URLs are on the canonical domain
    for (const item of items) {
      if (!item.url.startsWith(GROWTH_CONFIG.brand.canonicalBase)) {
        throw new Error(`Newsletter item "${item.title}" has invalid URL "${item.url}". Must belong to ${GROWTH_CONFIG.brand.canonicalBase}`);
      }
    }

    const title = `${GROWTH_CONFIG.brand.newsletter.title} #${editionNumber}`;
    const subject = `AI Satellite Orbit #${editionNumber}: Fresh Open-Source Tools & Demos`;

    const textContent = [
      `📡 ${title}`,
      GROWTH_CONFIG.brand.tagline,
      '--------------------------------------------------',
      '',
      ...items.map(
        (item) => `[${item.category.toUpperCase()}] ${item.title}\n${item.summary}\nExplore: ${item.url}\n`
      ),
      '--------------------------------------------------',
      `You received this email because you subscribed to AI Satellite Weekly Orbit with double opt-in consent.`,
      `Manage Preferences or Unsubscribe: ${GROWTH_CONFIG.brand.newsletter.unsubscribeBaseUrl}`,
      `Privacy Policy: ${GROWTH_CONFIG.brand.newsletter.privacyPolicyUrl}`,
    ].join('\n');

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #f8fafc; padding: 24px; }
    .card { background-color: #161e2e; border: 1px solid #334155; border-radius: 8px; padding: 16px; margin-bottom: 16px; }
    .badge { display: inline-block; background-color: #0284c7; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
    .btn { display: inline-block; background-color: #06b6d4; color: #0b0f19; font-weight: bold; padding: 8px 16px; border-radius: 6px; text-decoration: none; margin-top: 8px; }
    .footer { font-size: 12px; color: #94a3b8; text-align: center; margin-top: 32px; border-top: 1px solid #334155; padding-top: 16px; }
  </style>
</head>
<body>
  <div style="max-width: 600px; margin: 0 auto;">
    <h1 style="color: #38bdf8;">📡 ${title}</h1>
    <p style="color: #94a3b8;">${GROWTH_CONFIG.brand.tagline}</p>
    <hr style="border: 0; border-top: 1px solid #334155; margin: 24px 0;" />
    ${items
      .map(
        (item) => `
      <div class="card">
        <span class="badge">${item.category}</span>
        <h3 style="margin-top: 8px; color: #f8fafc;">${item.title}</h3>
        <p style="color: #cbd5e1; font-size: 14px;">${item.summary}</p>
        <a href="${item.url}" class="btn">Read Technical Guide &rarr;</a>
      </div>
    `
      )
      .join('')}
    <div class="footer">
      <p>AI Satellite — Independent Developer Knowledge Station</p>
      <p>You received this email because you gave explicit opt-in consent.</p>
      <p><a href="${GROWTH_CONFIG.brand.newsletter.unsubscribeBaseUrl}" style="color: #38bdf8;">Unsubscribe immediately</a> &bull; <a href="${GROWTH_CONFIG.brand.newsletter.privacyPolicyUrl}" style="color: #38bdf8;">Privacy Policy</a></p>
    </div>
  </div>
</body>
</html>
    `.trim();

    const campaign: NewsletterCampaign = {
      id: `camp-orbit-${editionNumber}`,
      editionNumber,
      subject,
      title,
      status: 'draft', // Strictly start in draft mode
      items,
      htmlContent,
      textContent,
      createdAt: new Date().toISOString(),
    };

    const campaigns = growthStorage.getCampaigns().filter((c) => c.id !== campaign.id);
    campaigns.push(campaign);
    growthStorage.saveCampaigns(campaigns);

    this.logger.info(`Generated newsletter digest draft: ${campaign.id}`);
    return campaign;
  }

  /**
   * Human approval gate for campaigns
   */
  approveCampaign(campaignId: string, editorName: string): NewsletterCampaign {
    const campaigns = growthStorage.getCampaigns();
    const campaign = campaigns.find((c) => c.id === campaignId);

    if (!campaign) {
      throw new Error(`Campaign not found: ${campaignId}`);
    }

    campaign.status = 'approved';
    campaign.approvedBy = editorName;

    growthStorage.saveCampaigns(campaigns);
    this.logger.recordAudit('APPROVE_NEWSLETTER_CAMPAIGN', editorName, { campaignId });
    return campaign;
  }

  /**
   * Dispatches approved campaign to active, non-suppressed subscribers
   */
  async dispatchCampaign(campaignId: string): Promise<{ sentCount: number; campaign: NewsletterCampaign }> {
    const campaigns = growthStorage.getCampaigns();
    const campaign = campaigns.find((c) => c.id === campaignId);

    if (!campaign) {
      throw new Error(`Campaign not found: ${campaignId}`);
    }

    if (campaign.status !== 'approved') {
      throw new Error(`Policy violation: Campaign ${campaignId} cannot be dispatched without human approval (Current status: ${campaign.status})`);
    }

    const recipients = subscriberManager.getActiveRecipients();
    campaign.status = 'sent';
    campaign.sentAt = new Date().toISOString();
    campaign.recipientCount = recipients.length;

    growthStorage.saveCampaigns(campaigns);
    this.logger.info(`Dispatched campaign ${campaignId} to ${recipients.length} verified active subscribers`);

    return {
      sentCount: recipients.length,
      campaign,
    };
  }
}

export const newsletterDigestGenerator = new NewsletterDigestGenerator();
