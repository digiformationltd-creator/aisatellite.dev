import crypto from 'node:crypto';
import type { NewsletterSubscriber, SubscriberStatus } from '../schemas/index.js';
import { GrowthLogger } from '../monitoring/growth-logger.js';
import { growthStorage } from '../storage/growth-storage.js';

const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com',
  '10minutemail.com',
  'tempmail.com',
  'throwawaymail.com',
  'guerrillamail.com',
  'sharklasers.com',
  'trashmail.com',
]);

export class SubscriberManager {
  private logger: GrowthLogger;

  constructor(baseDir = process.cwd()) {
    this.logger = new GrowthLogger('SubscriberManager', baseDir);
  }

  private hashString(str: string): string {
    return crypto.createHash('sha256').update(str).digest('hex').substring(0, 16);
  }

  /**
   * Validates an email address against syntax, RFC rules, and disposable domains
   */
  validateEmail(email: string): { isValid: boolean; error?: string } {
    if (!email || typeof email !== 'string') {
      return { isValid: false, error: 'Email address is required' };
    }

    const trimmed = email.trim().toLowerCase();
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

    if (!emailRegex.test(trimmed)) {
      return { isValid: false, error: 'Invalid email syntax format' };
    }

    const parts = trimmed.split('@');
    const domain = parts[1];
    if (DISPOSABLE_DOMAINS.has(domain)) {
      return { isValid: false, error: 'Disposable email addresses are not permitted' };
    }

    return { isValid: true };
  }

  /**
   * Initiates double opt-in subscription
   */
  subscribe(email: string, rawIp = '127.0.0.1', consentVersion = 'v1.0'): { subscriber: NewsletterSubscriber; confirmationToken: string } {
    const val = this.validateEmail(email);
    if (!val.isValid) {
      throw new Error(val.error);
    }

    const normalizedEmail = email.trim().toLowerCase();
    const suppressionList = growthStorage.getSuppressionList();

    if (suppressionList.includes(normalizedEmail)) {
      throw new Error('Address is on the permanent suppression list and cannot be subscribed');
    }

    const subscribers = growthStorage.getSubscribers();
    const existingIndex = subscribers.findIndex((s) => s.email === normalizedEmail);

    const token = crypto.randomBytes(24).toString('hex');
    const ipHash = this.hashString(rawIp + '-' + new Date().toISOString().slice(0, 10));

    if (existingIndex !== -1) {
      const existing = subscribers[existingIndex];
      if (existing.status === 'active') {
        return { subscriber: existing, confirmationToken: existing.optInToken || token };
      }

      // Re-subscribe unconfirmed or previously unsubscribed
      existing.status = 'unconfirmed';
      existing.optInToken = token;
      existing.consentTimestamp = new Date().toISOString();
      existing.consentVersion = consentVersion;
      existing.ipHash = ipHash;

      subscribers[existingIndex] = existing;
      growthStorage.saveSubscribers(subscribers);
      return { subscriber: existing, confirmationToken: token };
    }

    const newSubscriber: NewsletterSubscriber = {
      id: `sub-${Date.now()}-${this.hashString(normalizedEmail).substring(0, 6)}`,
      email: normalizedEmail,
      status: 'unconfirmed',
      consentTimestamp: new Date().toISOString(),
      consentVersion,
      ipHash,
      optInToken: token,
      preferences: {
        weeklyDigest: true,
        securityAdvisories: false,
        productReleases: true,
      },
    };

    subscribers.push(newSubscriber);
    growthStorage.saveSubscribers(subscribers);
    this.logger.info(`Double opt-in initiated for new subscriber`, { id: newSubscriber.id });

    return { subscriber: newSubscriber, confirmationToken: token };
  }

  /**
   * Confirms double opt-in with verification token
   */
  confirmSubscription(token: string): NewsletterSubscriber {
    const subscribers = growthStorage.getSubscribers();
    const subscriber = subscribers.find((s) => s.optInToken === token);

    if (!subscriber) {
      throw new Error('Invalid or expired confirmation token');
    }

    subscriber.status = 'active';
    subscriber.confirmedAt = new Date().toISOString();
    subscriber.optInToken = undefined;

    growthStorage.saveSubscribers(subscribers);
    this.logger.info(`Subscriber confirmed double opt-in`, { id: subscriber.id });
    return subscriber;
  }

  /**
   * Immediately honors unsubscribe requests and adds email to suppression list
   */
  unsubscribe(email: string): void {
    const normalizedEmail = email.trim().toLowerCase();
    const subscribers = growthStorage.getSubscribers();
    const sub = subscribers.find((s) => s.email === normalizedEmail);

    if (sub) {
      sub.status = 'unsubscribed';
      sub.unsubscribedAt = new Date().toISOString();
      growthStorage.saveSubscribers(subscribers);
    }

    // Add to suppression list
    const suppressionList = growthStorage.getSuppressionList();
    if (!suppressionList.includes(normalizedEmail)) {
      suppressionList.push(normalizedEmail);
      growthStorage.saveSuppressionList(suppressionList);
    }

    this.logger.info(`Unsubscribed and permanently suppressed: ${normalizedEmail}`);
  }

  /**
   * Handles delivery bounce
   */
  handleBounce(email: string): void {
    const normalizedEmail = email.trim().toLowerCase();
    const subscribers = growthStorage.getSubscribers();
    const sub = subscribers.find((s) => s.email === normalizedEmail);

    if (sub) {
      sub.status = 'bounced';
      growthStorage.saveSubscribers(subscribers);
    }

    const suppressionList = growthStorage.getSuppressionList();
    if (!suppressionList.includes(normalizedEmail)) {
      suppressionList.push(normalizedEmail);
      growthStorage.saveSuppressionList(suppressionList);
    }

    this.logger.warn(`Email bounced and added to suppression list: ${normalizedEmail}`);
  }

  /**
   * Retrieves active, non-suppressed subscribers eligible to receive campaigns
   */
  getActiveRecipients(): NewsletterSubscriber[] {
    const subscribers = growthStorage.getSubscribers();
    const suppressionList = new Set(growthStorage.getSuppressionList());

    return subscribers.filter(
      (s) => s.status === 'active' && !suppressionList.has(s.email)
    );
  }
}

export const subscriberManager = new SubscriberManager();
