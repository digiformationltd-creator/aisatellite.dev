/**
 * AI Satellite — Community Database Layer (Phase 13)
 * Relational storage engine for developer community profiles, discussions,
 * Q&A, open-source project showcases, contributions, reputation, collaborative collections,
 * and moderation workflows.
 * Backed by data/community/community-store.json.
 */

import fs from 'node:fs';
import path from 'node:path';
import type {
  PublicProfile,
  GitHubConnection,
  CommunityDiscussion,
  DiscussionReply,
  CommunityQuestion,
  QuestionAnswer,
  ProjectShowcase,
  ResourceSubmission,
  ContributionRecord,
  ReputationEvent,
  CollaborativeCollection,
  CommunityReport,
  ModerationAction,
  ModerationAppeal,
} from './types';

export interface CommunityStoreSchema {
  profiles: PublicProfile[];
  githubConnections: GitHubConnection[];
  discussions: CommunityDiscussion[];
  discussionReplies: DiscussionReply[];
  questions: CommunityQuestion[];
  questionAnswers: QuestionAnswer[];
  projectShowcases: ProjectShowcase[];
  resourceSubmissions: ResourceSubmission[];
  contributionRecords: ContributionRecord[];
  reputationEvents: ReputationEvent[];
  collaborativeCollections: CollaborativeCollection[];
  reports: CommunityReport[];
  moderationActions: ModerationAction[];
  appeals: ModerationAppeal[];
}

export class CommunityDatabase {
  private dataDir: string;
  private storeFile: string;
  private data: CommunityStoreSchema;

  constructor(customDataDir?: string) {
    this.dataDir = customDataDir || path.join(process.cwd(), 'data', 'community');
    this.storeFile = path.join(this.dataDir, 'community-store.json');
    this.data = this.loadState();
  }

  private loadState(): CommunityStoreSchema {
    const empty: CommunityStoreSchema = {
      profiles: [],
      githubConnections: [],
      discussions: [],
      discussionReplies: [],
      questions: [],
      questionAnswers: [],
      projectShowcases: [],
      resourceSubmissions: [],
      contributionRecords: [],
      reputationEvents: [],
      collaborativeCollections: [],
      reports: [],
      moderationActions: [],
      appeals: [],
    };

    try {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }

      if (fs.existsSync(this.storeFile)) {
        const raw = fs.readFileSync(this.storeFile, 'utf8');
        return { ...empty, ...JSON.parse(raw) };
      }
    } catch {
      // Fallback to in-memory state
    }
    return empty;
  }

  private persistState(): void {
    try {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }
      fs.writeFileSync(this.storeFile, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (e) {
      console.error('[CommunityDatabase] Error persisting community store:', e);
    }
  }

  // --- Public Profiles ---
  public getProfiles(): PublicProfile[] {
    return [...this.data.profiles];
  }

  public findProfileByUserId(userId: string): PublicProfile | undefined {
    return this.data.profiles.find((p) => p.userId === userId);
  }

  public findProfileByUsername(username: string): PublicProfile | undefined {
    return this.data.profiles.find((p) => p.username.toLowerCase() === username.toLowerCase());
  }

  public saveProfile(profile: PublicProfile): void {
    const index = this.data.profiles.findIndex((p) => p.userId === profile.userId);
    if (index >= 0) {
      this.data.profiles[index] = profile;
    } else {
      this.data.profiles.push(profile);
    }
    this.persistState();
  }

  public deleteProfile(userId: string): void {
    this.data.profiles = this.data.profiles.filter((p) => p.userId !== userId);
    this.persistState();
  }

  // --- GitHub Connections ---
  public findGitHubConnectionByUserId(userId: string): GitHubConnection | undefined {
    return this.data.githubConnections.find((c) => c.userId === userId);
  }

  public saveGitHubConnection(conn: GitHubConnection): void {
    const index = this.data.githubConnections.findIndex((c) => c.userId === conn.userId);
    if (index >= 0) {
      this.data.githubConnections[index] = conn;
    } else {
      this.data.githubConnections.push(conn);
    }
    this.persistState();
  }

  public deleteGitHubConnection(userId: string): void {
    this.data.githubConnections = this.data.githubConnections.filter((c) => c.userId !== userId);
    this.persistState();
  }

  // --- Discussions ---
  public getDiscussions(): CommunityDiscussion[] {
    return [...this.data.discussions];
  }

  public findDiscussionById(id: string): CommunityDiscussion | undefined {
    return this.data.discussions.find((d) => d.id === id);
  }

  public saveDiscussion(discussion: CommunityDiscussion): void {
    const index = this.data.discussions.findIndex((d) => d.id === discussion.id);
    if (index >= 0) {
      this.data.discussions[index] = discussion;
    } else {
      this.data.discussions.push(discussion);
    }
    this.persistState();
  }

  public getRepliesForDiscussion(discussionId: string): DiscussionReply[] {
    return this.data.discussionReplies.filter((r) => r.discussionId === discussionId && !r.isHidden);
  }

  public saveReply(reply: DiscussionReply): void {
    this.data.discussionReplies.push(reply);
    const disc = this.findDiscussionById(reply.discussionId);
    if (disc) {
      disc.replyCount = this.data.discussionReplies.filter((r) => r.discussionId === reply.discussionId).length;
    }
    this.persistState();
  }

  public findReplyById(id: string): DiscussionReply | undefined {
    return this.data.discussionReplies.find((r) => r.id === id);
  }

  // --- Q&A Questions & Answers ---
  public getQuestions(): CommunityQuestion[] {
    return [...this.data.questions];
  }

  public findQuestionById(id: string): CommunityQuestion | undefined {
    return this.data.questions.find((q) => q.id === id);
  }

  public saveQuestion(question: CommunityQuestion): void {
    const index = this.data.questions.findIndex((q) => q.id === question.id);
    if (index >= 0) {
      this.data.questions[index] = question;
    } else {
      this.data.questions.push(question);
    }
    this.persistState();
  }

  public getAnswersForQuestion(questionId: string): QuestionAnswer[] {
    return this.data.questionAnswers.filter((a) => a.questionId === questionId);
  }

  public findAnswerById(id: string): QuestionAnswer | undefined {
    return this.data.questionAnswers.find((a) => a.id === id);
  }

  public saveAnswer(answer: QuestionAnswer): void {
    const index = this.data.questionAnswers.findIndex((a) => a.id === answer.id);
    if (index >= 0) {
      this.data.questionAnswers[index] = answer;
    } else {
      this.data.questionAnswers.push(answer);
    }
    const q = this.findQuestionById(answer.questionId);
    if (q) {
      q.answerCount = this.data.questionAnswers.filter((a) => a.questionId === answer.questionId).length;
    }
    this.persistState();
  }

  // --- Project Showcases ---
  public getProjects(): ProjectShowcase[] {
    return [...this.data.projectShowcases];
  }

  public findProjectById(id: string): ProjectShowcase | undefined {
    return this.data.projectShowcases.find((p) => p.id === id);
  }

  public findProjectByRepoUrl(url: string): ProjectShowcase | undefined {
    const normalized = url.trim().toLowerCase().replace(/\/+$/, '');
    return this.data.projectShowcases.find((p) => p.repoUrl.trim().toLowerCase().replace(/\/+$/, '') === normalized);
  }

  public saveProject(project: ProjectShowcase): void {
    const index = this.data.projectShowcases.findIndex((p) => p.id === project.id);
    if (index >= 0) {
      this.data.projectShowcases[index] = project;
    } else {
      this.data.projectShowcases.push(project);
    }
    this.persistState();
  }

  // --- Resource Submissions ---
  public getSubmissions(): ResourceSubmission[] {
    return [...this.data.resourceSubmissions];
  }

  public findSubmissionById(id: string): ResourceSubmission | undefined {
    return this.data.resourceSubmissions.find((s) => s.id === id);
  }

  public findSubmissionByUrl(url: string): ResourceSubmission | undefined {
    const normalized = url.trim().toLowerCase().replace(/\/+$/, '');
    return this.data.resourceSubmissions.find((s) => s.url.trim().toLowerCase().replace(/\/+$/, '') === normalized);
  }

  public saveSubmission(sub: ResourceSubmission): void {
    const index = this.data.resourceSubmissions.findIndex((s) => s.id === sub.id);
    if (index >= 0) {
      this.data.resourceSubmissions[index] = sub;
    } else {
      this.data.resourceSubmissions.push(sub);
    }
    this.persistState();
  }

  // --- Contributions & Reputation ---
  public getContributionRecords(userId?: string): ContributionRecord[] {
    if (userId) {
      return this.data.contributionRecords.filter((c) => c.userId === userId);
    }
    return [...this.data.contributionRecords];
  }

  public recordContribution(record: ContributionRecord): void {
    this.data.contributionRecords.push(record);
    this.persistState();
  }

  public getReputationEvents(userId?: string): ReputationEvent[] {
    if (userId) {
      return this.data.reputationEvents.filter((e) => e.userId === userId);
    }
    return [...this.data.reputationEvents];
  }

  public recordReputationEvent(event: ReputationEvent): void {
    this.data.reputationEvents.push(event);
    this.persistState();
  }

  // --- Collaborative Collections ---
  public getCollaborativeCollections(): CollaborativeCollection[] {
    return [...this.data.collaborativeCollections];
  }

  public findCollectionById(id: string): CollaborativeCollection | undefined {
    return this.data.collaborativeCollections.find((c) => c.id === id);
  }

  public saveCollaborativeCollection(collection: CollaborativeCollection): void {
    const index = this.data.collaborativeCollections.findIndex((c) => c.id === collection.id);
    if (index >= 0) {
      this.data.collaborativeCollections[index] = collection;
    } else {
      this.data.collaborativeCollections.push(collection);
    }
    this.persistState();
  }

  public deleteCollaborativeCollection(id: string): void {
    this.data.collaborativeCollections = this.data.collaborativeCollections.filter((c) => c.id !== id);
    this.persistState();
  }

  // --- Reports & Moderation ---
  public getReports(): CommunityReport[] {
    return [...this.data.reports];
  }

  public findReportById(id: string): CommunityReport | undefined {
    return this.data.reports.find((r) => r.id === id);
  }

  public saveReport(report: CommunityReport): void {
    const index = this.data.reports.findIndex((r) => r.id === report.id);
    if (index >= 0) {
      this.data.reports[index] = report;
    } else {
      this.data.reports.push(report);
    }
    this.persistState();
  }

  public getModerationActions(): ModerationAction[] {
    return [...this.data.moderationActions];
  }

  public logModerationAction(action: ModerationAction): void {
    this.data.moderationActions.push(action);
    this.persistState();
  }

  public getAppeals(): ModerationAppeal[] {
    return [...this.data.appeals];
  }

  public findAppealById(id: string): ModerationAppeal | undefined {
    return this.data.appeals.find((a) => a.id === id);
  }

  public saveAppeal(appeal: ModerationAppeal): void {
    const index = this.data.appeals.findIndex((a) => a.id === appeal.id);
    if (index >= 0) {
      this.data.appeals[index] = appeal;
    } else {
      this.data.appeals.push(appeal);
    }
    this.persistState();
  }

  // --- Cascade User Deletion (GDPR / Privacy) ---
  public cascadeDeleteUserCommunityData(userId: string): void {
    // 1. Remove profile and github connection
    this.data.profiles = this.data.profiles.filter((p) => p.userId !== userId);
    this.data.githubConnections = this.data.githubConnections.filter((c) => c.userId !== userId);

    // 2. Anonymize or remove user discussions & replies
    this.data.discussions.forEach((d) => {
      if (d.authorId === userId) {
        d.authorUsername = '[deleted-developer]';
      }
    });

    this.data.discussionReplies.forEach((r) => {
      if (r.authorId === userId) {
        r.authorUsername = '[deleted-developer]';
      }
    });

    // 3. Questions and answers
    this.data.questions.forEach((q) => {
      if (q.authorId === userId) {
        q.authorUsername = '[deleted-developer]';
      }
    });

    this.data.questionAnswers.forEach((a) => {
      if (a.authorId === userId) {
        a.authorUsername = '[deleted-developer]';
      }
    });

    // 4. Collaborative collections owned by user
    this.data.collaborativeCollections = this.data.collaborativeCollections.filter((c) => c.ownerId !== userId);
    // Remove user from memberships of others' collections
    this.data.collaborativeCollections.forEach((c) => {
      c.members = c.members.filter((m) => m.userId !== userId);
    });

    // 5. Purge appeals & reports by user
    this.data.appeals = this.data.appeals.filter((a) => a.userId !== userId);
    this.data.reports = this.data.reports.filter((r) => r.reporterId !== userId);

    this.persistState();
  }

  // --- Reset database for testing ---
  public resetDatabase(): void {
    this.data = {
      profiles: [],
      githubConnections: [],
      discussions: [],
      discussionReplies: [],
      questions: [],
      questionAnswers: [],
      projectShowcases: [],
      resourceSubmissions: [],
      contributionRecords: [],
      reputationEvents: [],
      collaborativeCollections: [],
      reports: [],
      moderationActions: [],
      appeals: [],
    };
    this.persistState();
  }
}

export const communityDatabase = new CommunityDatabase();
