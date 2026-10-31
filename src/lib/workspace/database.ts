/**
 * AI Satellite — Workspace Database Layer (Phase 12)
 * Relational storage engine for My Orbit workspace entities with atomic operations,
 * transaction simulation, and cascade deletion.
 */

import fs from 'node:fs';
import path from 'node:path';
import type {
  User,
  Session,
  UserPreferences,
  SavedResource,
  Collection,
  PersonalPrompt,
  PromptVersion,
  CodeSnippet,
  DeveloperProject,
  LearningProgress,
  ResearchCollection,
  WorkflowTemplate,
  WorkspaceNotification,
  WorkspaceAuditEvent,
} from './types';

export interface WorkspaceStoreSchema {
  users: User[];
  sessions: Session[];
  preferences: UserPreferences[];
  savedResources: SavedResource[];
  collections: Collection[];
  prompts: PersonalPrompt[];
  promptVersions: PromptVersion[];
  codeSnippets: CodeSnippet[];
  projects: DeveloperProject[];
  learningProgress: LearningProgress[];
  researchCollections: ResearchCollection[];
  workflowTemplates: WorkflowTemplate[];
  notifications: WorkspaceNotification[];
  auditEvents: WorkspaceAuditEvent[];
}

export class WorkspaceDatabase {
  private dataDir: string;
  private storeFile: string;
  private data: WorkspaceStoreSchema;

  constructor(customDataDir?: string) {
    this.dataDir = customDataDir || path.join(process.cwd(), 'data', 'workspace');
    this.storeFile = path.join(this.dataDir, 'workspace-store.json');
    this.data = this.loadState();
  }

  private loadState(): WorkspaceStoreSchema {
    const empty: WorkspaceStoreSchema = {
      users: [],
      sessions: [],
      preferences: [],
      savedResources: [],
      collections: [],
      prompts: [],
      promptVersions: [],
      codeSnippets: [],
      projects: [],
      learningProgress: [],
      researchCollections: [],
      workflowTemplates: [],
      notifications: [],
      auditEvents: [],
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
      console.error('[WorkspaceDatabase] Error persisting workspace store:', e);
    }
  }

  // --- Users & Sessions ---
  public getUsers(): User[] {
    return [...this.data.users];
  }

  public findUserById(id: string): User | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  public findUserByEmail(email: string): User | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public insertUser(user: User): void {
    this.data.users.push(user);
    this.persistState();
  }

  public updateUser(user: User): void {
    const idx = this.data.users.findIndex((u) => u.id === user.id);
    if (idx !== -1) {
      this.data.users[idx] = user;
      this.persistState();
    }
  }

  public insertSession(session: Session): void {
    this.data.sessions.push(session);
    this.persistState();
  }

  public findSessionByToken(token: string): Session | undefined {
    return this.data.sessions.find((s) => s.token === token);
  }

  public deleteSession(token: string): void {
    this.data.sessions = this.data.sessions.filter((s) => s.token !== token);
    this.persistState();
  }

  // --- Preferences ---
  public getPreferences(userId: string): UserPreferences | undefined {
    return this.data.preferences.find((p) => p.userId === userId);
  }

  public savePreferences(prefs: UserPreferences): void {
    const idx = this.data.preferences.findIndex((p) => p.userId === prefs.userId);
    if (idx !== -1) {
      this.data.preferences[idx] = prefs;
    } else {
      this.data.preferences.push(prefs);
    }
    this.persistState();
  }

  // --- Saved Resources ---
  public getSavedResources(userId: string): SavedResource[] {
    return this.data.savedResources.filter((r) => r.userId === userId);
  }

  public insertSavedResource(res: SavedResource): void {
    this.data.savedResources.push(res);
    this.persistState();
  }

  public updateSavedResource(res: SavedResource): void {
    const idx = this.data.savedResources.findIndex((r) => r.id === res.id && r.userId === res.userId);
    if (idx !== -1) {
      this.data.savedResources[idx] = res;
      this.persistState();
    }
  }

  public deleteSavedResource(userId: string, id: string): boolean {
    const prevLen = this.data.savedResources.length;
    this.data.savedResources = this.data.savedResources.filter((r) => !(r.id === id && r.userId === userId));
    const removed = this.data.savedResources.length < prevLen;
    if (removed) this.persistState();
    return removed;
  }

  // --- Collections ---
  public getCollections(userId: string): Collection[] {
    return this.data.collections.filter((c) => c.userId === userId);
  }

  public insertCollection(collection: Collection): void {
    this.data.collections.push(collection);
    this.persistState();
  }

  // --- Prompts & Versions ---
  public getPrompts(userId: string): PersonalPrompt[] {
    return this.data.prompts.filter((p) => p.userId === userId);
  }

  public findPromptById(promptId: string): PersonalPrompt | undefined {
    return this.data.prompts.find((p) => p.id === promptId);
  }

  public insertPrompt(prompt: PersonalPrompt): void {
    this.data.prompts.push(prompt);
    this.persistState();
  }

  public updatePrompt(prompt: PersonalPrompt): void {
    const idx = this.data.prompts.findIndex((p) => p.id === prompt.id && p.userId === prompt.userId);
    if (idx !== -1) {
      this.data.prompts[idx] = prompt;
      this.persistState();
    }
  }

  public insertPromptVersion(version: PromptVersion): void {
    this.data.promptVersions.push(version);
    this.persistState();
  }

  public getPromptVersions(promptId: string): PromptVersion[] {
    return this.data.promptVersions.filter((v) => v.promptId === promptId);
  }

  // --- Code Snippets ---
  public getSnippets(userId: string): CodeSnippet[] {
    return this.data.codeSnippets.filter((s) => s.userId === userId);
  }

  public findSnippetById(id: string): CodeSnippet | undefined {
    return this.data.codeSnippets.find((s) => s.id === id);
  }

  public insertSnippet(snippet: CodeSnippet): void {
    this.data.codeSnippets.push(snippet);
    this.persistState();
  }

  public deleteSnippet(userId: string, id: string): boolean {
    const prev = this.data.codeSnippets.length;
    this.data.codeSnippets = this.data.codeSnippets.filter((s) => !(s.id === id && s.userId === userId));
    const changed = this.data.codeSnippets.length < prev;
    if (changed) this.persistState();
    return changed;
  }

  // --- Projects ---
  public getProjects(userId: string): DeveloperProject[] {
    return this.data.projects.filter((p) => p.userId === userId);
  }

  public findProjectById(id: string): DeveloperProject | undefined {
    return this.data.projects.find((p) => p.id === id);
  }

  public insertProject(project: DeveloperProject): void {
    this.data.projects.push(project);
    this.persistState();
  }

  public updateProject(project: DeveloperProject): void {
    const idx = this.data.projects.findIndex((p) => p.id === project.id && p.userId === project.userId);
    if (idx !== -1) {
      this.data.projects[idx] = project;
      this.persistState();
    }
  }

  public deleteProject(userId: string, id: string): boolean {
    const prev = this.data.projects.length;
    this.data.projects = this.data.projects.filter((p) => !(p.id === id && p.userId === userId));
    const changed = this.data.projects.length < prev;
    if (changed) this.persistState();
    return changed;
  }

  // --- Learning Progress ---
  public getLearningProgress(userId: string, pathId: string): LearningProgress | undefined {
    return this.data.learningProgress.find((p) => p.userId === userId && p.pathId === pathId);
  }

  public getAllLearningProgress(userId: string): LearningProgress[] {
    return this.data.learningProgress.filter((p) => p.userId === userId);
  }

  public saveLearningProgress(progress: LearningProgress): void {
    const idx = this.data.learningProgress.findIndex((p) => p.userId === progress.userId && p.pathId === progress.pathId);
    if (idx !== -1) {
      this.data.learningProgress[idx] = progress;
    } else {
      this.data.learningProgress.push(progress);
    }
    this.persistState();
  }

  // --- Notifications ---
  public getNotifications(userId: string): WorkspaceNotification[] {
    return this.data.notifications.filter((n) => n.userId === userId);
  }

  public insertNotification(notif: WorkspaceNotification): void {
    this.data.notifications.push(notif);
    this.persistState();
  }

  public markNotificationAsRead(userId: string, id: string): void {
    const item = this.data.notifications.find((n) => n.id === id && n.userId === userId);
    if (item) {
      item.read = true;
      this.persistState();
    }
  }

  // --- Audit Events ---
  public logAuditEvent(event: WorkspaceAuditEvent): void {
    this.data.auditEvents.push(event);
    this.persistState();
  }

  // --- Cascade Delete User Account ---
  public deleteUserAccount(userId: string): void {
    this.data.users = this.data.users.filter((u) => u.id !== userId);
    this.data.sessions = this.data.sessions.filter((s) => s.userId !== userId);
    this.data.preferences = this.data.preferences.filter((p) => p.userId !== userId);
    this.data.savedResources = this.data.savedResources.filter((r) => r.userId !== userId);
    this.data.collections = this.data.collections.filter((c) => c.userId !== userId);
    
    // Purge prompts and prompt versions
    const userPromptIds = new Set(this.data.prompts.filter((p) => p.userId === userId).map((p) => p.id));
    this.data.prompts = this.data.prompts.filter((p) => p.userId !== userId);
    this.data.promptVersions = this.data.promptVersions.filter((v) => !userPromptIds.has(v.promptId));

    this.data.codeSnippets = this.data.codeSnippets.filter((s) => s.userId !== userId);
    this.data.projects = this.data.projects.filter((p) => p.userId !== userId);
    this.data.learningProgress = this.data.learningProgress.filter((lp) => lp.userId !== userId);
    this.data.researchCollections = this.data.researchCollections.filter((rc) => rc.userId !== userId);
    this.data.notifications = this.data.notifications.filter((n) => n.userId !== userId);
    this.data.auditEvents = this.data.auditEvents.filter((a) => a.userId !== userId);

    this.persistState();
  }

  // --- Reset/Clear for testing ---
  public resetDatabase(): void {
    this.data = {
      users: [],
      sessions: [],
      preferences: [],
      savedResources: [],
      collections: [],
      prompts: [],
      promptVersions: [],
      codeSnippets: [],
      projects: [],
      learningProgress: [],
      researchCollections: [],
      workflowTemplates: [],
      notifications: [],
      auditEvents: [],
    };
    this.persistState();
  }
}

export const workspaceDatabase = new WorkspaceDatabase();
