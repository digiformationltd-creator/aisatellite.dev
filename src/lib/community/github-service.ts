/**
 * AI Satellite — GitHub Account Connection & Link Service (Phase 13)
 * Manages minimal-scope OAuth connections, account linking, repository verification,
 * and clean disconnection.
 */

import { communityDatabase } from './database';
import type { GitHubConnection } from './types';
import { spamPreventionService } from './spam-prevention';

export class GitHubService {
  /**
   * Connects a verified GitHub account with minimal permitted scopes (read:user).
   * Does NOT request repo write or automated action scopes.
   */
  public connectGitHubAccount(
    userId: string,
    data: {
      githubUserId: string;
      githubUsername: string;
      avatarUrl?: string;
      publicRepoCount?: number;
    }
  ): { success: boolean; connection?: GitHubConnection; error?: string } {
    if (!data.githubUsername || !data.githubUserId) {
      return { success: false, error: 'Invalid GitHub credentials or verification payload' };
    }

    const cleanUsername = data.githubUsername.trim().toLowerCase();
    const now = new Date().toISOString();

    const connection: GitHubConnection = {
      userId,
      githubUserId: data.githubUserId,
      githubUsername: cleanUsername,
      profileUrl: `https://github.com/${cleanUsername}`,
      avatarUrl: data.avatarUrl || `https://github.com/${cleanUsername}.png`,
      publicRepoCount: data.publicRepoCount || 0,
      linkedRepoUrls: [],
      connectedAt: now,
      lastSyncedAt: now,
    };

    communityDatabase.saveGitHubConnection(connection);

    // Sync github username to profile if exists
    const profile = communityDatabase.findProfileByUserId(userId);
    if (profile) {
      profile.githubUsername = cleanUsername;
      profile.updatedAt = now;
      communityDatabase.saveProfile(profile);
    }

    return { success: true, connection };
  }

  /**
   * Disconnects a GitHub account and revokes associated links.
   */
  public disconnectGitHubAccount(userId: string): { success: boolean } {
    communityDatabase.deleteGitHubConnection(userId);

    const profile = communityDatabase.findProfileByUserId(userId);
    if (profile) {
      profile.githubUsername = undefined;
      profile.updatedAt = new Date().toISOString();
      communityDatabase.saveProfile(profile);
    }

    return { success: true };
  }

  /**
   * Links an official public repository to the user's profile.
   * Validates repository URL and ensures safe HTTPS GitHub URL format.
   */
  public linkRepository(
    userId: string,
    repoUrl: string
  ): { success: boolean; linkedUrls?: string[]; error?: string } {
    const connection = communityDatabase.findGitHubConnectionByUserId(userId);
    if (!connection) {
      return { success: false, error: 'No connected GitHub account found for this user.' };
    }

    const trimmedUrl = repoUrl.trim();
    const githubRepoPattern = /^https:\/\/github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+$/;

    if (!githubRepoPattern.test(trimmedUrl)) {
      return { success: false, error: 'Invalid GitHub repository URL. Must be in https://github.com/owner/repo format.' };
    }

    const urlSafety = spamPreventionService.isSafeExternalUrl(trimmedUrl);
    if (!urlSafety.safe) {
      return { success: false, error: urlSafety.reason || 'Unsafe repository URL' };
    }

    if (!connection.linkedRepoUrls.includes(trimmedUrl)) {
      connection.linkedRepoUrls.push(trimmedUrl);
      connection.lastSyncedAt = new Date().toISOString();
      communityDatabase.saveGitHubConnection(connection);
    }

    return { success: true, linkedUrls: connection.linkedRepoUrls };
  }

  /**
   * Unlinks a repository
   */
  public unlinkRepository(userId: string, repoUrl: string): { success: boolean; linkedUrls?: string[] } {
    const connection = communityDatabase.findGitHubConnectionByUserId(userId);
    if (!connection) return { success: false };

    connection.linkedRepoUrls = connection.linkedRepoUrls.filter((u) => u !== repoUrl.trim());
    connection.lastSyncedAt = new Date().toISOString();
    communityDatabase.saveGitHubConnection(connection);

    return { success: true, linkedUrls: connection.linkedRepoUrls };
  }

  public getConnection(userId: string): GitHubConnection | undefined {
    return communityDatabase.findGitHubConnectionByUserId(userId);
  }
}

export const gitHubService = new GitHubService();
