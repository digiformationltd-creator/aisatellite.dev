import fs from 'node:fs';
import path from 'node:path';
import type {
  SEOAuditFinding,
  SearchPerformanceRecord,
  ContentOpportunity,
  ContentCluster,
  InternalLinkRecommendation,
  DistributionJob,
  RepoHealthAudit,
  NewsletterSubscriber,
  NewsletterCampaign,
  CommunitySubmission,
  AnalyticsEvent,
  ConnectedAccount,
} from '../schemas/index.js';

export class GrowthStorage {
  private baseDir: string;
  private dataDir: string;

  constructor(baseDir = process.cwd()) {
    this.baseDir = baseDir;
    this.dataDir = path.join(baseDir, 'data', 'growth');
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  private readJson<T>(filename: string, defaultValue: T): T {
    const filePath = path.join(this.dataDir, filename);
    if (!fs.existsSync(filePath)) {
      this.writeJson(filename, defaultValue);
      return defaultValue;
    }
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content) as T;
    } catch {
      return defaultValue;
    }
  }

  private writeJson<T>(filename: string, data: T): void {
    const filePath = path.join(this.dataDir, filename);
    const tempPath = `${filePath}.tmp.${Date.now()}`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf8');
    fs.renameSync(tempPath, filePath);
  }

  // SEO Findings
  getSEOFindings(): SEOAuditFinding[] {
    return this.readJson<SEOAuditFinding[]>('seo-findings.json', []);
  }

  saveSEOFindings(findings: SEOAuditFinding[]): void {
    this.writeJson('seo-findings.json', findings);
  }

  // Search Performance
  getSearchPerformance(): SearchPerformanceRecord[] {
    return this.readJson<SearchPerformanceRecord[]>('search-performance.json', []);
  }

  saveSearchPerformance(records: SearchPerformanceRecord[]): void {
    this.writeJson('search-performance.json', records);
  }

  // Opportunities
  getOpportunities(): ContentOpportunity[] {
    return this.readJson<ContentOpportunity[]>('opportunities.json', []);
  }

  saveOpportunities(opps: ContentOpportunity[]): void {
    this.writeJson('opportunities.json', opps);
  }

  // Content Clusters
  getClusters(): ContentCluster[] {
    return this.readJson<ContentCluster[]>('clusters.json', []);
  }

  saveClusters(clusters: ContentCluster[]): void {
    this.writeJson('clusters.json', clusters);
  }

  // Internal Links
  getInternalLinks(): InternalLinkRecommendation[] {
    return this.readJson<InternalLinkRecommendation[]>('internal-links.json', []);
  }

  saveInternalLinks(links: InternalLinkRecommendation[]): void {
    this.writeJson('internal-links.json', links);
  }

  // Distribution Queue
  getDistributionQueue(): DistributionJob[] {
    return this.readJson<DistributionJob[]>('distribution-queue.json', []);
  }

  saveDistributionQueue(jobs: DistributionJob[]): void {
    this.writeJson('distribution-queue.json', jobs);
  }

  // GitHub Repo Health
  getRepoHealth(): RepoHealthAudit[] {
    return this.readJson<RepoHealthAudit[]>('github-health.json', []);
  }

  saveRepoHealth(audits: RepoHealthAudit[]): void {
    this.writeJson('github-health.json', audits);
  }

  // Newsletter Subscribers
  getSubscribers(): NewsletterSubscriber[] {
    return this.readJson<NewsletterSubscriber[]>('subscribers.json', []);
  }

  saveSubscribers(subscribers: NewsletterSubscriber[]): void {
    this.writeJson('subscribers.json', subscribers);
  }

  // Suppression List
  getSuppressionList(): string[] {
    return this.readJson<string[]>('suppression-list.json', []);
  }

  saveSuppressionList(suppressedEmails: string[]): void {
    this.writeJson('suppression-list.json', suppressedEmails);
  }

  // Newsletter Campaigns
  getCampaigns(): NewsletterCampaign[] {
    return this.readJson<NewsletterCampaign[]>('campaigns.json', []);
  }

  saveCampaigns(campaigns: NewsletterCampaign[]): void {
    this.writeJson('campaigns.json', campaigns);
  }

  // Community Submissions
  getSubmissions(): CommunitySubmission[] {
    return this.readJson<CommunitySubmission[]>('submissions.json', []);
  }

  saveSubmissions(submissions: CommunitySubmission[]): void {
    this.writeJson('submissions.json', submissions);
  }

  // Analytics Events
  getAnalyticsEvents(): AnalyticsEvent[] {
    return this.readJson<AnalyticsEvent[]>('analytics-events.json', []);
  }

  saveAnalyticsEvents(events: AnalyticsEvent[]): void {
    this.writeJson('analytics-events.json', events);
  }

  appendAnalyticsEvent(event: AnalyticsEvent): void {
    const events = this.getAnalyticsEvents();
    events.push(event);
    this.saveAnalyticsEvents(events);
  }

  // Connected Accounts
  getConnectedAccounts(): ConnectedAccount[] {
    return this.readJson<ConnectedAccount[]>('connected-accounts.json', [
      {
        platform: 'github',
        accountHandle: 'aisatellite',
        isActive: true,
        authStatus: process.env.GITHUB_TOKEN ? 'connected' : 'unconfigured',
        lastCheckedAt: new Date().toISOString(),
      },
      {
        platform: 'linkedin',
        accountHandle: 'ai-satellite',
        isActive: false,
        authStatus: process.env.LINKEDIN_TOKEN ? 'connected' : 'unconfigured',
        lastCheckedAt: new Date().toISOString(),
      },
      {
        platform: 'x',
        accountHandle: '@aisatellite_dev',
        isActive: false,
        authStatus: process.env.X_API_KEY ? 'connected' : 'unconfigured',
        lastCheckedAt: new Date().toISOString(),
      },
      {
        platform: 'mastodon',
        accountHandle: '@satellite@fosstodon.org',
        isActive: false,
        authStatus: process.env.MASTODON_TOKEN ? 'connected' : 'unconfigured',
        lastCheckedAt: new Date().toISOString(),
      },
      {
        platform: 'bluesky',
        accountHandle: 'aisatellite.bsky.social',
        isActive: false,
        authStatus: process.env.BLUESKY_APP_PASSWORD ? 'connected' : 'unconfigured',
        lastCheckedAt: new Date().toISOString(),
      },
      {
        platform: 'reddit',
        accountHandle: 'u/aisatellite',
        isActive: false,
        authStatus: process.env.REDDIT_CLIENT_ID ? 'connected' : 'unconfigured',
        lastCheckedAt: new Date().toISOString(),
      },
      {
        platform: 'devto',
        accountHandle: 'aisatellite',
        isActive: false,
        authStatus: process.env.DEVTO_API_KEY ? 'connected' : 'unconfigured',
        lastCheckedAt: new Date().toISOString(),
      },
      {
        platform: 'hashnode',
        accountHandle: 'aisatellite',
        isActive: false,
        authStatus: process.env.HASHNODE_KEY ? 'connected' : 'unconfigured',
        lastCheckedAt: new Date().toISOString(),
      },
    ]);
  }

  saveConnectedAccounts(accounts: ConnectedAccount[]): void {
    this.writeJson('connected-accounts.json', accounts);
  }
}

export const growthStorage = new GrowthStorage();
