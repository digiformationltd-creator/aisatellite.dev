/**
 * AI Satellite — Phase 19 Ecosystem Database & Storage Engine
 * Atomic thread-safe persistence for the Central Resource Registry, Knowledge Graph,
 * Event Bus, Unified Notifications, Analytics, and Agent Orchestrator.
 * Permanent Canonical Domain: https://aisatellite.dev
 */

import fs from 'node:fs';
import path from 'node:path';
import type {
  CentralResource,
  UnifiedKnowledgeGraphEdge,
  PlatformEvent,
  UnifiedNotification,
  UnifiedAnalyticsEvent,
  AgentExecutionResult,
  ScheduledJobConfig,
} from './types';

export interface EcosystemStoreData {
  resources: CentralResource[];
  graphEdges: UnifiedKnowledgeGraphEdge[];
  events: PlatformEvent[];
  notifications: UnifiedNotification[];
  analyticsEvents: UnifiedAnalyticsEvent[];
  agentExecutions: AgentExecutionResult[];
  scheduledJobs: ScheduledJobConfig[];
}

export class EcosystemDatabase {
  private static instance: EcosystemDatabase;
  private filePath: string;
  private data: EcosystemStoreData;

  private constructor() {
    const dir = path.resolve(process.cwd(), 'data', 'ecosystem');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    this.filePath = path.join(dir, 'ecosystem-store.json');
    this.data = this.load();
  }

  public static getInstance(): EcosystemDatabase {
    if (!EcosystemDatabase.instance) {
      EcosystemDatabase.instance = new EcosystemDatabase();
    }
    return EcosystemDatabase.instance;
  }

  private getDefaultData(): EcosystemStoreData {
    return {
      resources: [
        {
          id: 'res_signoz',
          slug: 'signoz',
          name: 'SigNoz',
          type: 'open_source_project',
          officialUrl: 'https://signoz.io',
          repositoryUrl: 'https://github.com/SigNoz/signoz',
          license: 'Apache-2.0',
          pricing: 'Free & Open Source (Self-Hosted)',
          capabilities: ['APM', 'Distributed Tracing', 'Metrics', 'Logs', 'Observability'],
          categories: ['monitoring', 'observability', 'devops'],
          verificationStatus: 'verified',
          editorialStatus: 'published',
          verifiedAt: '2026-10-31T00:00:00.000Z',
          lastReviewedAt: '2026-10-31T00:00:00.000Z',
          metadata: {
            stars: 19500,
            githubOwner: 'SigNoz',
            replacesProduct: 'Datadog',
          },
        },
        {
          id: 'res_datadog',
          slug: 'datadog',
          name: 'Datadog',
          type: 'software_product',
          officialUrl: 'https://www.datadoghq.com',
          pricing: 'Commercial SaaS ($15-$23 per host/mo)',
          capabilities: ['APM', 'Cloud Monitoring', 'Log Management', 'Network Monitoring'],
          categories: ['monitoring', 'observability'],
          verificationStatus: 'verified',
          editorialStatus: 'published',
          verifiedAt: '2026-10-31T00:00:00.000Z',
          lastReviewedAt: '2026-10-31T00:00:00.000Z',
          metadata: {},
        },
        {
          id: 'res_podman',
          slug: 'podman',
          name: 'Podman',
          type: 'open_source_project',
          officialUrl: 'https://podman.io',
          repositoryUrl: 'https://github.com/containers/podman',
          license: 'Apache-2.0',
          pricing: 'Free & Open Source',
          capabilities: ['Rootless Containers', 'Pods', 'Docker CLI Alias', 'OCI Compliant'],
          categories: ['containers', 'virtualization', 'devops'],
          verificationStatus: 'verified',
          editorialStatus: 'published',
          verifiedAt: '2026-10-31T00:00:00.000Z',
          lastReviewedAt: '2026-10-31T00:00:00.000Z',
          metadata: {
            stars: 24000,
            githubOwner: 'containers',
            replacesProduct: 'Docker Desktop',
          },
        },
        {
          id: 'res_docker_desktop',
          slug: 'docker-desktop',
          name: 'Docker Desktop',
          type: 'software_product',
          officialUrl: 'https://www.docker.com/products/docker-desktop',
          pricing: 'Commercial Subscription for Enterprise ($5-$24/user/mo)',
          capabilities: ['Container Management', 'Kubernetes Local', 'Extensions'],
          categories: ['containers', 'virtualization'],
          verificationStatus: 'verified',
          editorialStatus: 'published',
          verifiedAt: '2026-10-31T00:00:00.000Z',
          lastReviewedAt: '2026-10-31T00:00:00.000Z',
          metadata: {},
        },
        {
          id: 'res_bruno',
          slug: 'bruno',
          name: 'Bruno',
          type: 'open_source_project',
          officialUrl: 'https://www.usebruno.com',
          repositoryUrl: 'https://github.com/usebruno/bruno',
          license: 'MIT',
          pricing: 'Free & Open Source (Local Git Collections)',
          capabilities: ['API Client', 'Git Versioned Collections', 'Offline First', 'Fast'],
          categories: ['api', 'developer-tools', 'testing'],
          verificationStatus: 'verified',
          editorialStatus: 'published',
          verifiedAt: '2026-10-31T00:00:00.000Z',
          lastReviewedAt: '2026-10-31T00:00:00.000Z',
          metadata: {
            stars: 31000,
            githubOwner: 'usebruno',
            replacesProduct: 'Postman',
          },
        },
        {
          id: 'res_postman',
          slug: 'postman',
          name: 'Postman',
          type: 'software_product',
          officialUrl: 'https://www.postman.com',
          pricing: 'Freemium with Cloud Paywalls ($14-$49/user/mo)',
          capabilities: ['API Client', 'Mock Servers', 'Documentation', 'Workspaces'],
          categories: ['api', 'developer-tools'],
          verificationStatus: 'verified',
          editorialStatus: 'published',
          verifiedAt: '2026-10-31T00:00:00.000Z',
          lastReviewedAt: '2026-10-31T00:00:00.000Z',
          metadata: {},
        },
      ],
      graphEdges: [
        {
          id: 'edge_signoz_datadog',
          sourceId: 'res_signoz',
          targetId: 'res_datadog',
          relationship: 'alternative_to',
          confidence: 0.98,
          verified: true,
          createdAt: '2026-10-31T00:00:00.000Z',
        },
        {
          id: 'edge_podman_docker',
          sourceId: 'res_podman',
          targetId: 'res_docker_desktop',
          relationship: 'alternative_to',
          confidence: 0.99,
          verified: true,
          createdAt: '2026-10-31T00:00:00.000Z',
        },
        {
          id: 'edge_bruno_postman',
          sourceId: 'res_bruno',
          targetId: 'res_postman',
          relationship: 'alternative_to',
          confidence: 0.99,
          verified: true,
          createdAt: '2026-10-31T00:00:00.000Z',
        },
      ],
      events: [
        {
          id: 'evt_init',
          eventType: 'ResourceVerified',
          payload: { resourceId: 'res_signoz', status: 'verified' },
          timestamp: '2026-10-31T00:00:00.000Z',
          emitter: 'system',
          traceId: 'trc_init_000',
        },
      ],
      notifications: [],
      analyticsEvents: [],
      agentExecutions: [],
      scheduledJobs: [
        {
          id: 'job_discovery',
          name: 'Autonomous Technology Discovery',
          category: 'discovery',
          cronIntervalMinutes: 60,
          nextRun: new Date(Date.now() + 3600000).toISOString(),
          status: 'idle',
          retryCount: 0,
          maxRetries: 3,
        },
        {
          id: 'job_verification',
          name: 'GitHub Releases & License Auditing',
          category: 'verification',
          cronIntervalMinutes: 120,
          nextRun: new Date(Date.now() + 7200000).toISOString(),
          status: 'idle',
          retryCount: 0,
          maxRetries: 3,
        },
        {
          id: 'job_search_index',
          name: 'Pagefind Search Re-indexing',
          category: 'search',
          cronIntervalMinutes: 360,
          nextRun: new Date(Date.now() + 21600000).toISOString(),
          status: 'idle',
          retryCount: 0,
          maxRetries: 2,
        },
        {
          id: 'job_health_check',
          name: 'Platform Availability & SLI Monitor',
          category: 'reliability',
          cronIntervalMinutes: 15,
          nextRun: new Date(Date.now() + 900000).toISOString(),
          status: 'idle',
          retryCount: 0,
          maxRetries: 5,
        },
      ],
    };
  }

  private load(): EcosystemStoreData {
    if (fs.existsSync(this.filePath)) {
      try {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        return JSON.parse(raw);
      } catch {
        return this.getDefaultData();
      }
    }
    const defaultData = this.getDefaultData();
    this.saveData(defaultData);
    return defaultData;
  }

  private saveData(data: EcosystemStoreData): void {
    const tempPath = `${this.filePath}.tmp.${Date.now()}`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempPath, this.filePath);
    this.data = data;
  }

  public persist(): void {
    this.saveData(this.data);
  }

  public resetDatabase(): void {
    this.saveData(this.getDefaultData());
  }

  // --- Resource Queries ---
  public getResources(): CentralResource[] {
    return [...this.data.resources];
  }

  public getResourceById(id: string): CentralResource | undefined {
    return this.data.resources.find((r) => r.id === id);
  }

  public getResourceBySlug(slug: string): CentralResource | undefined {
    return this.data.resources.find((r) => r.slug === slug);
  }

  public saveResource(resource: CentralResource): void {
    const idx = this.data.resources.findIndex((r) => r.id === resource.id);
    if (idx >= 0) {
      this.data.resources[idx] = resource;
    } else {
      this.data.resources.push(resource);
    }
    this.persist();
  }

  public deleteResource(id: string): boolean {
    const initialLen = this.data.resources.length;
    this.data.resources = this.data.resources.filter((r) => r.id !== id);
    if (this.data.resources.length !== initialLen) {
      // Also cascade delete knowledge graph edges involving this resource
      this.data.graphEdges = this.data.graphEdges.filter(
        (e) => e.sourceId !== id && e.targetId !== id
      );
      this.persist();
      return true;
    }
    return false;
  }

  // --- Knowledge Graph Queries ---
  public getGraphEdges(): UnifiedKnowledgeGraphEdge[] {
    return [...this.data.graphEdges];
  }

  public saveGraphEdge(edge: UnifiedKnowledgeGraphEdge): void {
    const idx = this.data.graphEdges.findIndex((e) => e.id === edge.id);
    if (idx >= 0) {
      this.data.graphEdges[idx] = edge;
    } else {
      this.data.graphEdges.push(edge);
    }
    this.persist();
  }

  public deleteGraphEdge(id: string): boolean {
    const initialLen = this.data.graphEdges.length;
    this.data.graphEdges = this.data.graphEdges.filter((e) => e.id !== id);
    if (this.data.graphEdges.length !== initialLen) {
      this.persist();
      return true;
    }
    return false;
  }

  // --- Platform Events ---
  public getEvents(): PlatformEvent[] {
    return [...this.data.events];
  }

  public addEvent(event: PlatformEvent): void {
    this.data.events.push(event);
    if (this.data.events.length > 500) {
      this.data.events = this.data.events.slice(-500); // capped buffer
    }
    this.persist();
  }

  // --- Notifications ---
  public getNotifications(userId?: string): UnifiedNotification[] {
    if (userId) {
      return this.data.notifications.filter((n) => n.userId === userId);
    }
    return [...this.data.notifications];
  }

  public saveNotification(notification: UnifiedNotification): void {
    const idx = this.data.notifications.findIndex((n) => n.id === notification.id);
    if (idx >= 0) {
      this.data.notifications[idx] = notification;
    } else {
      this.data.notifications.push(notification);
    }
    this.persist();
  }

  public markNotificationRead(id: string, userId: string): boolean {
    const notification = this.data.notifications.find((n) => n.id === id && n.userId === userId);
    if (notification) {
      notification.read = true;
      this.persist();
      return true;
    }
    return false;
  }

  // --- Analytics ---
  public getAnalyticsEvents(): UnifiedAnalyticsEvent[] {
    return [...this.data.analyticsEvents];
  }

  public addAnalyticsEvent(event: UnifiedAnalyticsEvent): void {
    this.data.analyticsEvents.push(event);
    if (this.data.analyticsEvents.length > 1000) {
      this.data.analyticsEvents = this.data.analyticsEvents.slice(-1000);
    }
    this.persist();
  }

  // --- Agent Executions ---
  public getAgentExecutions(): AgentExecutionResult[] {
    return [...this.data.agentExecutions];
  }

  public addAgentExecution(result: AgentExecutionResult): void {
    this.data.agentExecutions.push(result);
    if (this.data.agentExecutions.length > 200) {
      this.data.agentExecutions = this.data.agentExecutions.slice(-200);
    }
    this.persist();
  }

  // --- Scheduled Jobs ---
  public getScheduledJobs(): ScheduledJobConfig[] {
    return [...this.data.scheduledJobs];
  }

  public updateScheduledJob(job: ScheduledJobConfig): void {
    const idx = this.data.scheduledJobs.findIndex((j) => j.id === job.id);
    if (idx >= 0) {
      this.data.scheduledJobs[idx] = job;
      this.persist();
    }
  }
}

export const ecosystemDatabase = EcosystemDatabase.getInstance();
