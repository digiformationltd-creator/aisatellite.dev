import { describe, it, expect } from 'vitest';
import { SubscriberManager } from '../../growth/newsletter/subscriber-manager.js';
import { NewsletterDigestGenerator } from '../../growth/newsletter/digest-generator.js';

describe('Acceptance Tests 19-23: Consent-Based Developer Newsletter', () => {
  const subscriberManager = new SubscriberManager();
  const digestGenerator = new NewsletterDigestGenerator();

  it('Test 19: Newsletter signup validates email addresses and rejects disposable domains', () => {
    // Valid email
    const valid = subscriberManager.validateEmail('eng.lead@example.com');
    expect(valid.isValid).toBe(true);

    // Invalid syntax
    const invalidSyntax = subscriberManager.validateEmail('not-an-email');
    expect(invalidSyntax.isValid).toBe(false);

    // Disposable domain
    const disposable = subscriberManager.validateEmail('test@mailinator.com');
    expect(disposable.isValid).toBe(false);
    expect(disposable.error).toContain('Disposable email');
  });

  it('Test 20: Double opt-in workflow requires token confirmation before activation', () => {
    const testEmail = `dev-${Date.now()}@testcompany.org`;
    const { subscriber, confirmationToken } = subscriberManager.subscribe(testEmail);

    expect(subscriber.status).toBe('unconfirmed');
    expect(confirmationToken).toBeDefined();

    // Confirm with token
    const confirmed = subscriberManager.confirmSubscription(confirmationToken);
    expect(confirmed.status).toBe('active');
    expect(confirmed.confirmedAt).toBeDefined();
    expect(confirmed.optInToken).toBeUndefined();
  });

  it('Test 21: Unsubscribe requests are honored immediately', () => {
    const testEmail = `unsub-${Date.now()}@example.org`;
    const { confirmationToken } = subscriberManager.subscribe(testEmail);
    subscriberManager.confirmSubscription(confirmationToken);

    // Unsubscribe
    subscriberManager.unsubscribe(testEmail);

    const activeList = subscriberManager.getActiveRecipients();
    const isPresent = activeList.some((s) => s.email === testEmail);
    expect(isPresent).toBe(false);
  });

  it('Test 22: Suppressed addresses cannot receive campaigns or re-subscribe', () => {
    const suppressedEmail = `bounced-${Date.now()}@example.com`;
    subscriberManager.handleBounce(suppressedEmail);

    // Cannot re-subscribe once on suppression list
    expect(() => {
      subscriberManager.subscribe(suppressedEmail);
    }).toThrow(/suppression list/);
  });

  it('Test 23: Newsletter drafts require editorial approval before dispatch', async () => {
    const campaign = digestGenerator.generateDigest(101, [
      {
        title: 'Weekly Orbit Highlights',
        url: 'https://aisatellite.pages.dev/tools/coolify',
        summary: 'Self-hosting PaaS overview',
        category: 'devops',
        isVerifiedFree: true,
      },
    ]);

    expect(campaign.status).toBe('draft');

    // Attempting to dispatch unapproved campaign throws error
    await expect(digestGenerator.dispatchCampaign(campaign.id)).rejects.toThrow(
      /cannot be dispatched without human approval/
    );

    // Approve and dispatch
    digestGenerator.approveCampaign(campaign.id, 'Editor-Aisha');
    const result = await digestGenerator.dispatchCampaign(campaign.id);
    expect(result.campaign.status).toBe('sent');
  });
});
