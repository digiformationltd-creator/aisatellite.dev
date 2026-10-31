/**
 * AI Satellite — Community Analytics Service (Phase 13)
 * Calculates verified, evidence-grounded metrics for the developer community ecosystem.
 * Strictly avoids artificial engagement inflation or synthetic stats.
 */

import { communityDatabase } from './database';
import { workspaceDatabase } from '../workspace/database';

export interface CommunityMetrics {
  totalRegisteredUsers: number;
  optInPublicProfiles: number;
  approvedContributionsCount: number;
  activeDiscussionsCount: number;
  resolvedDiscussionsCount: number;
  totalQuestionsCount: number;
  resolvedQuestionsCount: number;
  approvedProjectsCount: number;
  pendingReviewCount: number;
  collaborativeCollectionsCount: number;
  publicCollectionsCount: number;
  openReportsCount: number;
  moderationActionsCount: number;
  lastCalculatedAt: string;
}

export class CommunityAnalyticsService {
  /**
   * Aggregates real metrics directly from the underlying relational stores.
   */
  public getMetrics(): CommunityMetrics {
    const users = workspaceDatabase.getUsers();
    const profiles = communityDatabase.getProfiles();
    const optInProfiles = profiles.filter((p) => p.isPublicProfile);

    const discussions = communityDatabase.getDiscussions().filter((d) => !d.isHidden);
    const resolvedDiscussions = discussions.filter((d) => d.isResolved);

    const questions = communityDatabase.getQuestions();
    const resolvedQuestions = questions.filter((q) => q.isAnswered);

    const projects = communityDatabase.getProjects();
    const approvedProjects = projects.filter((p) => p.status === 'approved');
    const pendingProjects = projects.filter((p) => p.status === 'pending');

    const submissions = communityDatabase.getSubmissions();
    const pendingSubmissions = submissions.filter((s) => s.status === 'pending');

    const collections = communityDatabase.getCollaborativeCollections();
    const publicCollections = collections.filter((c) => c.isPublic);

    const contributions = communityDatabase.getContributionRecords();
    const reports = communityDatabase.getReports().filter((r) => r.status === 'open');
    const moderationActions = communityDatabase.getModerationActions();

    return {
      totalRegisteredUsers: users.length,
      optInPublicProfiles: optInProfiles.length,
      approvedContributionsCount: contributions.length,
      activeDiscussionsCount: discussions.length,
      resolvedDiscussionsCount: resolvedDiscussions.length,
      totalQuestionsCount: questions.length,
      resolvedQuestionsCount: resolvedQuestions.length,
      approvedProjectsCount: approvedProjects.length,
      pendingReviewCount: pendingProjects.length + pendingSubmissions.length,
      collaborativeCollectionsCount: collections.length,
      publicCollectionsCount: publicCollections.length,
      openReportsCount: reports.length,
      moderationActionsCount: moderationActions.length,
      lastCalculatedAt: new Date().toISOString(),
    };
  }
}

export const communityAnalyticsService = new CommunityAnalyticsService();
