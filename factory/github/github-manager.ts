import crypto from 'node:crypto';
import { auditLogger } from '../monitoring/audit-logger';

export interface GitHubRepoOptions {
  name: string;
  description: string;
  isPrivate?: boolean;
  licenseTemplate?: string;
  autoInit?: boolean;
}

export interface GitHubPROptions {
  title: string;
  body: string;
  head: string;
  base: string;
}

export interface GitHubReleaseOptions {
  tagName: string;
  name: string;
  body: string;
  draft?: boolean;
  prerelease?: boolean;
  assets?: Array<{ name: string; path: string; size?: number }>;
}

export class GitHubManager {
  private token: string | null;
  private organization: string;
  private isMockMode: boolean;

  constructor(token?: string, organization = 'aisatellite-org') {
    this.token = token || process.env.GITHUB_TOKEN || null;
    this.organization = organization;
    this.isMockMode = !this.token || process.env.FACTORY_MOCK_GITHUB === 'true';
  }

  public setMockMode(enabled: boolean): void {
    this.isMockMode = enabled;
  }

  public getMockMode(): boolean {
    return this.isMockMode;
  }

  /**
   * Create repository proposal or actual repository
   */
  public async createRepository(options: GitHubRepoOptions): Promise<{
    success: boolean;
    repoUrl: string;
    repoFullName: string;
    id: string;
  }> {
    const fullName = `${this.organization}/${options.name}`;
    const repoUrl = `https://github.com/${fullName}`;

    auditLogger.log({
      actor: 'github-manager',
      action: 'create_repository',
      details: {
        repoFullName: fullName,
        isPrivate: options.isPrivate ?? false,
        mockMode: this.isMockMode,
      },
    });

    if (this.isMockMode) {
      return {
        success: true,
        repoUrl,
        repoFullName: fullName,
        id: `mock-repo-${crypto.randomBytes(4).toString('hex')}`,
      };
    }

    // In live mode with token
    const res = await fetch(`https://api.github.com/orgs/${this.organization}/repos`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${this.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'AI-Satellite-Factory',
      },
      body: JSON.stringify({
        name: options.name,
        description: options.description,
        private: options.isPrivate ?? false,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`GitHub createRepository failed: ${res.status} ${err}`);
    }

    const data = (await res.json()) as { html_url: string; full_name: string; id: number };
    return {
      success: true,
      repoUrl: data.html_url,
      repoFullName: data.full_name,
      id: String(data.id),
    };
  }

  /**
   * Create pull request
   */
  public async createPullRequest(repoFullName: string, options: GitHubPROptions): Promise<{
    success: boolean;
    prNumber: number;
    prUrl: string;
  }> {
    auditLogger.log({
      actor: 'github-manager',
      action: 'create_pull_request',
      details: {
        repoFullName,
        title: options.title,
        head: options.head,
        base: options.base,
        mockMode: this.isMockMode,
      },
    });

    if (this.isMockMode) {
      const prNumber = Math.floor(Math.random() * 100) + 1;
      return {
        success: true,
        prNumber,
        prUrl: `https://github.com/${repoFullName}/pull/${prNumber}`,
      };
    }

    const res = await fetch(`https://api.github.com/repos/${repoFullName}/pulls`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${this.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'AI-Satellite-Factory',
      },
      body: JSON.stringify(options),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`GitHub createPullRequest failed: ${res.status} ${err}`);
    }

    const data = (await res.json()) as { number: number; html_url: string };
    return {
      success: true,
      prNumber: data.number,
      prUrl: data.html_url,
    };
  }

  /**
   * Create tagged GitHub release
   */
  public async createRelease(repoFullName: string, options: GitHubReleaseOptions): Promise<{
    success: boolean;
    releaseId: string;
    htmlUrl: string;
    tagName: string;
    assetCount: number;
  }> {
    auditLogger.log({
      actor: 'github-manager',
      action: 'create_release',
      details: {
        repoFullName,
        tagName: options.tagName,
        releaseName: options.name,
        assetCount: options.assets?.length ?? 0,
        mockMode: this.isMockMode,
      },
    });

    if (this.isMockMode) {
      return {
        success: true,
        releaseId: `rel_${crypto.randomBytes(6).toString('hex')}`,
        htmlUrl: `https://github.com/${repoFullName}/releases/tag/${options.tagName}`,
        tagName: options.tagName,
        assetCount: options.assets?.length ?? 0,
      };
    }

    const res = await fetch(`https://api.github.com/repos/${repoFullName}/releases`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${this.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'AI-Satellite-Factory',
      },
      body: JSON.stringify({
        tag_name: options.tagName,
        name: options.name,
        body: options.body,
        draft: options.draft ?? false,
        prerelease: options.prerelease ?? false,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`GitHub createRelease failed: ${res.status} ${err}`);
    }

    const data = (await res.json()) as { id: number; html_url: string; tag_name: string };
    return {
      success: true,
      releaseId: String(data.id),
      htmlUrl: data.html_url,
      tagName: data.tag_name,
      assetCount: options.assets?.length ?? 0,
    };
  }
}

export const githubManager = new GitHubManager();
