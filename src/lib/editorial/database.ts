/**
 * AI Satellite — Phase 22 Editorial Strategy Database
 * In-memory and file-backed querying interface for the 1,000-article masterplan,
 * keyword intelligence records, topical clusters, and editorial calendar.
 * Canonical Production Domain: https://aisatellite.dev
 */

import type { ArticleBrief, TopicCluster, EditorialPlanningCategory, PublishingStage } from './types';
import { masterplanEngine } from './masterplan-engine';
import { editorialCalendar } from './editorial-calendar';
import { COMMERCIAL_SERVICE_MAPPINGS } from './service-relevance-matrix';
import { OWNER_PROJECTS_RESEARCH } from './owner-projects-research';
import { exportEngine } from './export-engine';

export class EditorialDatabase {
  private static instance: EditorialDatabase;

  public static getInstance(): EditorialDatabase {
    if (!EditorialDatabase.instance) {
      EditorialDatabase.instance = new EditorialDatabase();
    }
    return EditorialDatabase.instance;
  }

  public getBriefs(): ArticleBrief[] {
    return masterplanEngine.generateMasterplan();
  }

  public getBriefById(id: string): ArticleBrief | undefined {
    return this.getBriefs().find((b) => b.articleId === id);
  }

  public getBriefBySlug(slug: string): ArticleBrief | undefined {
    return this.getBriefs().find((b) => b.canonicalSlug === slug);
  }

  public getBriefsByCategory(category: EditorialPlanningCategory): ArticleBrief[] {
    return this.getBriefs().filter((b) => b.topicCategory === category);
  }

  public getBriefsByStage(stage: PublishingStage): ArticleBrief[] {
    return this.getBriefs().filter((b) => b.publishingStage === stage);
  }

  public getBriefsByDay(day: number): ArticleBrief[] {
    return this.getBriefs().filter((b) => b.proposedPublicationDay === day);
  }

  public searchBriefs(query: string): ArticleBrief[] {
    const q = query.toLowerCase().trim();
    if (!q) return this.getBriefs();
    return this.getBriefs().filter(
      (b) =>
        b.proposedTitle.toLowerCase().includes(q) ||
        b.primaryKeyword.toLowerCase().includes(q) ||
        b.topicCategory.toLowerCase().includes(q) ||
        b.topicCluster.toLowerCase().includes(q) ||
        b.supportingKeywords.some((sk) => sk.toLowerCase().includes(q))
    );
  }

  public getStats() {
    return masterplanEngine.getMasterplanStats();
  }

  public getTopicClusters(): TopicCluster[] {
    return masterplanEngine.getTopicClusters();
  }

  public getCalendar() {
    return editorialCalendar.generateCalendar();
  }

  public getCalendarSummary() {
    return editorialCalendar.getCalendarSummary();
  }

  public getCommercialMappings() {
    return COMMERCIAL_SERVICE_MAPPINGS;
  }

  public getOwnerProjects() {
    return OWNER_PROJECTS_RESEARCH;
  }

  public exportAll() {
    return exportEngine.generateAllExports();
  }
}

export const editorialDatabase = EditorialDatabase.getInstance();
