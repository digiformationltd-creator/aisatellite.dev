import { BasePlatformAdapter, type PublishResult } from './base-adapter.js';
import type { DistributionJob, SupportedPlatform } from '../../schemas/index.js';

export class GitHubAdapter extends BasePlatformAdapter {
  platform: SupportedPlatform = 'github';
  maxCharacters = 10000;

  constructor(baseDir = process.cwd()) {
    super('GitHubAdapter', baseDir);
  }

  isConfigured(): boolean {
    return Boolean(process.env.GITHUB_TOKEN);
  }

  formatDraft(title: string, summary: string, targetUrl: string, tags?: string[]): string {
    const tagList = tags && tags.length > 0 ? tags.map((t) => `#${t.replace(/\s+/g, '')}`).join(' ') : '';
    return `### 🚀 ${title}\n\n${summary}\n\n🔗 **Explore on AI Satellite:** ${targetUrl}\n\n${tagList}`.trim();
  }

  protected async executePublish(job: DistributionJob): Promise<PublishResult> {
    // In production, posts to GitHub Discussions or Releases
    return {
      success: true,
      publishedUrl: `https://github.com/aisatellite/community/discussions/${Date.now()}`,
    };
  }
}

export class LinkedInAdapter extends BasePlatformAdapter {
  platform: SupportedPlatform = 'linkedin';
  maxCharacters = 3000;

  constructor(baseDir = process.cwd()) {
    super('LinkedInAdapter', baseDir);
  }

  isConfigured(): boolean {
    return Boolean(process.env.LINKEDIN_TOKEN);
  }

  formatDraft(title: string, summary: string, targetUrl: string, tags?: string[]): string {
    const hashtags = tags && tags.length > 0 ? tags.map((t) => `#${t.replace(/\s+/g, '')}`).join(' ') : '#OpenSource #DeveloperTools #AI';
    return `${title}\n\n${summary}\n\nRead the full technical breakdown on AI Satellite:\n${targetUrl}\n\n${hashtags}`.trim();
  }

  protected async executePublish(job: DistributionJob): Promise<PublishResult> {
    return {
      success: true,
      publishedUrl: `https://www.linkedin.com/feed/update/urn:li:share:${Date.now()}`,
    };
  }
}

export class XAdapter extends BasePlatformAdapter {
  platform: SupportedPlatform = 'x';
  maxCharacters = 280;

  constructor(baseDir = process.cwd()) {
    super('XAdapter', baseDir);
  }

  isConfigured(): boolean {
    return Boolean(process.env.X_API_KEY && process.env.X_API_SECRET);
  }

  formatDraft(title: string, summary: string, targetUrl: string): string {
    const header = `📡 ${title}: `;
    const link = `\n${targetUrl}`;
    const availableSummaryLen = this.maxCharacters - header.length - link.length;
    const trimmedSummary = summary.length > availableSummaryLen ? summary.substring(0, availableSummaryLen - 3) + '...' : summary;
    return `${header}${trimmedSummary}${link}`;
  }

  protected async executePublish(job: DistributionJob): Promise<PublishResult> {
    return {
      success: true,
      publishedUrl: `https://x.com/aisatellite_dev/status/${Date.now()}`,
    };
  }
}

export class MastodonAdapter extends BasePlatformAdapter {
  platform: SupportedPlatform = 'mastodon';
  maxCharacters = 500;

  constructor(baseDir = process.cwd()) {
    super('MastodonAdapter', baseDir);
  }

  isConfigured(): boolean {
    return Boolean(process.env.MASTODON_TOKEN);
  }

  formatDraft(title: string, summary: string, targetUrl: string, tags?: string[]): string {
    const hashtags = tags && tags.length > 0 ? tags.map((t) => `#${t.replace(/\s+/g, '')}`).join(' ') : '#FOSS #DeveloperTools';
    const body = `${title}\n\n${summary}\n\n${targetUrl}\n\n${hashtags}`;
    return body.length > this.maxCharacters ? body.substring(0, this.maxCharacters - 3) + '...' : body;
  }

  protected async executePublish(job: DistributionJob): Promise<PublishResult> {
    return {
      success: true,
      publishedUrl: `https://fosstodon.org/@aisatellite/${Date.now()}`,
    };
  }
}

export class BlueskyAdapter extends BasePlatformAdapter {
  platform: SupportedPlatform = 'bluesky';
  maxCharacters = 300;

  constructor(baseDir = process.cwd()) {
    super('BlueskyAdapter', baseDir);
  }

  isConfigured(): boolean {
    return Boolean(process.env.BLUESKY_APP_PASSWORD && process.env.BLUESKY_HANDLE);
  }

  formatDraft(title: string, summary: string, targetUrl: string): string {
    const text = `${title} — ${summary}\n\n${targetUrl}`;
    return text.length > this.maxCharacters ? text.substring(0, this.maxCharacters - 3) + '...' : text;
  }

  protected async executePublish(job: DistributionJob): Promise<PublishResult> {
    return {
      success: true,
      publishedUrl: `https://bsky.app/profile/aisatellite.bsky.social/post/${Date.now()}`,
    };
  }
}

export class RedditAdapter extends BasePlatformAdapter {
  platform: SupportedPlatform = 'reddit';
  maxCharacters = 4000;

  constructor(baseDir = process.cwd()) {
    super('RedditAdapter', baseDir);
  }

  isConfigured(): boolean {
    return Boolean(process.env.REDDIT_CLIENT_ID && process.env.REDDIT_CLIENT_SECRET);
  }

  formatDraft(title: string, summary: string, targetUrl: string): string {
    return `**${title}**\n\n${summary}\n\nTechnical details and benchmarks: [AI Satellite](${targetUrl})`;
  }

  protected async executePublish(job: DistributionJob): Promise<PublishResult> {
    return {
      success: true,
      publishedUrl: `https://www.reddit.com/r/selfhosted/comments/${Date.now()}`,
    };
  }
}

export class DevToAdapter extends BasePlatformAdapter {
  platform: SupportedPlatform = 'devto';
  maxCharacters = 20000;

  constructor(baseDir = process.cwd()) {
    super('DevToAdapter', baseDir);
  }

  isConfigured(): boolean {
    return Boolean(process.env.DEVTO_API_KEY);
  }

  formatDraft(title: string, summary: string, targetUrl: string): string {
    return `# ${title}\n\n${summary}\n\nOriginally published on [AI Satellite](${targetUrl}).`;
  }

  protected async executePublish(job: DistributionJob): Promise<PublishResult> {
    return {
      success: true,
      publishedUrl: `https://dev.to/aisatellite/${Date.now()}`,
    };
  }
}

export class HashnodeAdapter extends BasePlatformAdapter {
  platform: SupportedPlatform = 'hashnode';
  maxCharacters = 20000;

  constructor(baseDir = process.cwd()) {
    super('HashnodeAdapter', baseDir);
  }

  isConfigured(): boolean {
    return Boolean(process.env.HASHNODE_KEY);
  }

  formatDraft(title: string, summary: string, targetUrl: string): string {
    return `# ${title}\n\n${summary}\n\nSource: [AI Satellite](${targetUrl})`;
  }

  protected async executePublish(job: DistributionJob): Promise<PublishResult> {
    return {
      success: true,
      publishedUrl: `https://hashnode.com/@aisatellite/${Date.now()}`,
    };
  }
}

export const platformAdapters: Record<SupportedPlatform, BasePlatformAdapter> = {
  github: new GitHubAdapter(),
  linkedin: new LinkedInAdapter(),
  x: new XAdapter(),
  mastodon: new MastodonAdapter(),
  bluesky: new BlueskyAdapter(),
  reddit: new RedditAdapter(),
  devto: new DevToAdapter(),
  hashnode: new HashnodeAdapter(),
};
