/**
 * AI Satellite — Phase 14 Autonomous Global Technology Discovery & Intelligence Network
 * Engine C: GitHub Intelligence Engine
 * 
 * Analyzes repository metadata, verifies OSI compliance, checks maintenance/archival status,
 * tracks release tags, documentation health, and issue/advisory activity.
 */

import { uuidv4 } from './id-generator';
import type { GitHubIntelligenceRecord } from './types';
import { discoveryDatabase, DiscoveryDatabase } from './database';

export const OSI_APPROVED_LICENSES = new Set([
  'MIT',
  'Apache-2.0',
  'BSD-2-Clause',
  'BSD-3-Clause',
  'GPL-3.0',
  'GPL-2.0',
  'AGPL-3.0',
  'LGPL-3.0',
  'LGPL-2.1',
  'MPL-2.0',
  'ISC',
  'Unlicense',
  'CC0-1.0',
  'EPL-2.0',
]);

export class GitHubIntelligenceEngine {
  private db: DiscoveryDatabase;

  constructor(db?: DiscoveryDatabase) {
    this.db = db || discoveryDatabase;
    this.seedDefaultRecords();
  }

  /**
   * Evaluates if a given license string represents an OSI-approved open source license
   */
  public isOsiApproved(licenseSpdx: string): boolean {
    if (!licenseSpdx) return false;
    const clean = licenseSpdx.trim();
    return OSI_APPROVED_LICENSES.has(clean);
  }

  /**
   * Processes raw repository metadata and stores a standardized intelligence record
   */
  public processRepoMetadata(input: {
    repoUrl: string;
    owner: string;
    repoName: string;
    description: string;
    license: string;
    latestReleaseTag?: string;
    latestReleaseDate?: string;
    isArchived?: boolean;
    supportedLanguages: string[];
    hasDocumentation?: boolean;
    documentationUrl?: string;
    openIssueCount?: number;
    securityAdvisoriesCount?: number;
    installInstructions?: string;
  }): GitHubIntelligenceRecord {
    const isOsi = this.isOsiApproved(input.license);
    const existing = this.db.findGitHubRecordByUrl(input.repoUrl);
    const now = new Date().toISOString();

    const record: GitHubIntelligenceRecord = {
      id: existing ? existing.id : `gh-${uuidv4().slice(0, 8)}`,
      repoUrl: input.repoUrl,
      owner: input.owner,
      repoName: input.repoName,
      description: input.description,
      license: input.license || 'Unknown',
      isOsiLicense: isOsi,
      latestReleaseTag: input.latestReleaseTag,
      latestReleaseDate: input.latestReleaseDate,
      isArchived: input.isArchived ?? false,
      supportedLanguages: input.supportedLanguages,
      hasDocumentation: input.hasDocumentation ?? true,
      documentationUrl: input.documentationUrl,
      openIssueCount: input.openIssueCount ?? 0,
      securityAdvisoriesCount: input.securityAdvisoriesCount ?? 0,
      installInstructions: input.installInstructions,
      lastCheckedAt: now,
    };

    this.db.saveGitHubRecord(record);
    return record;
  }

  public getRecords(): GitHubIntelligenceRecord[] {
    return this.db.getGitHubRecords();
  }

  public getRecordByUrl(url: string): GitHubIntelligenceRecord | undefined {
    return this.db.findGitHubRecordByUrl(url);
  }

  public getActiveOsiRecords(): GitHubIntelligenceRecord[] {
    return this.db.getGitHubRecords().filter((r) => r.isOsiLicense && !r.isArchived);
  }

  public getArchivedRecords(): GitHubIntelligenceRecord[] {
    return this.db.getGitHubRecords().filter((r) => r.isArchived);
  }

  public seedDefaultRecords(): void {
    const existing = this.db.getGitHubRecords();
    if (existing.length > 0) return;

    const defaults: Array<{
      repoUrl: string;
      owner: string;
      repoName: string;
      description: string;
      license: string;
      latestReleaseTag: string;
      latestReleaseDate: string;
      isArchived: boolean;
      supportedLanguages: string[];
      hasDocumentation: boolean;
      documentationUrl: string;
      openIssueCount: number;
      securityAdvisoriesCount: number;
      installInstructions: string;
    }> = [
      {
        repoUrl: 'https://github.com/ollama/ollama',
        owner: 'ollama',
        repoName: 'ollama',
        description: 'Get up and running with Llama 3.3, Mistral, Gemma 2, and other large language models locally.',
        license: 'MIT',
        latestReleaseTag: 'v0.5.7',
        latestReleaseDate: '2025-01-20T10:00:00Z',
        isArchived: false,
        supportedLanguages: ['Go', 'C++', 'Python'],
        hasDocumentation: true,
        documentationUrl: 'https://ollama.com',
        openIssueCount: 240,
        securityAdvisoriesCount: 0,
        installInstructions: 'curl -fsSL https://ollama.com/install.sh | sh',
      },
      {
        repoUrl: 'https://github.com/supabase/supabase',
        owner: 'supabase',
        repoName: 'supabase',
        description: 'The open source Firebase alternative. Supabase provides Postgres database, Auth, APIs, realtime subscriptions and storage.',
        license: 'Apache-2.0',
        latestReleaseTag: 'v1.189.0',
        latestReleaseDate: '2025-01-25T14:30:00Z',
        isArchived: false,
        supportedLanguages: ['TypeScript', 'Elixir', 'Go'],
        hasDocumentation: true,
        documentationUrl: 'https://supabase.com/docs',
        openIssueCount: 380,
        securityAdvisoriesCount: 0,
        installInstructions: 'npx supabase init && npx supabase start',
      },
      {
        repoUrl: 'https://github.com/vllm-project/vllm',
        owner: 'vllm-project',
        repoName: 'vllm',
        description: 'A high-throughput and memory-efficient inference and serving engine for LLMs.',
        license: 'Apache-2.0',
        latestReleaseTag: 'v0.6.6',
        latestReleaseDate: '2025-01-18T18:00:00Z',
        isArchived: false,
        supportedLanguages: ['Python', 'C++', 'CUDA'],
        hasDocumentation: true,
        documentationUrl: 'https://docs.vllm.ai',
        openIssueCount: 420,
        securityAdvisoriesCount: 0,
        installInstructions: 'pip install vllm',
      },
      {
        repoUrl: 'https://github.com/n8n-io/n8n',
        owner: 'n8n-io',
        repoName: 'n8n',
        description: 'Free and source-available fair-code workflow automation tool with extensive self-hosting support.',
        license: 'Sustainable-Use-License', // Fair-code / non-OSI
        latestReleaseTag: 'v1.75.2',
        latestReleaseDate: '2025-01-26T12:00:00Z',
        isArchived: false,
        supportedLanguages: ['TypeScript', 'Vue'],
        hasDocumentation: true,
        documentationUrl: 'https://docs.n8n.io',
        openIssueCount: 190,
        securityAdvisoriesCount: 0,
        installInstructions: 'docker run -it --rm --name n8n -p 5678:5678 n8nio/n8n',
      },
    ];

    for (const d of defaults) {
      this.processRepoMetadata(d);
    }
  }
}

export const gitHubIntelligenceEngine = new GitHubIntelligenceEngine();
