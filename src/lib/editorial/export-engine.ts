/**
 * AI Satellite — Phase 22 Content Production Handoff Export Engine
 * Generates JSON, CSV, and Markdown exports for integration with Phase 23
 * research and article production engines.
 * Canonical Production Domain: https://aisatellite.dev
 */

import fs from 'node:fs';
import path from 'node:path';
import { masterplanEngine } from './masterplan-engine';
import { editorialCalendar } from './editorial-calendar';
import { COMMERCIAL_SERVICE_MAPPINGS } from './service-relevance-matrix';
import { OWNER_PROJECTS_RESEARCH } from './owner-projects-research';
import type { ArticleBrief } from './types';

export class ExportEngine {
  private static instance: ExportEngine;
  private outputDir: string;

  private constructor() {
    this.outputDir = path.resolve(process.cwd(), 'data', 'editorial');
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  public static getInstance(): ExportEngine {
    if (!ExportEngine.instance) {
      ExportEngine.instance = new ExportEngine();
    }
    return ExportEngine.instance;
  }

  /**
   * Generates all required handoff files in data/editorial/.
   */
  public generateAllExports(): {
    jsonMasterplanPath: string;
    csvMasterplanPath: string;
    markdownIndexPath: string;
    calendarJsonPath: string;
    calendarCsvPath: string;
    clusterMapPath: string;
    serviceMatrixPath: string;
    ownerProjectsPath: string;
  } {
    const briefs = masterplanEngine.generateMasterplan();
    const calendar = editorialCalendar.generateCalendar();
    const clusters = masterplanEngine.getTopicClusters();

    // 1. JSON Masterplan
    const jsonMasterplanPath = path.join(this.outputDir, 'editorial-masterplan-1000.json');
    fs.writeFileSync(jsonMasterplanPath, JSON.stringify(briefs, null, 2), 'utf-8');

    // 2. CSV Masterplan
    const csvMasterplanPath = path.join(this.outputDir, 'editorial-masterplan-1000.csv');
    const csvHeaders = [
      'Article ID',
      'Title',
      'Canonical Slug',
      'Primary Keyword',
      'Category',
      'Topic Cluster',
      'Search Intent',
      'Audience',
      'Geography',
      'Depth',
      'Word Count',
      'Freshness',
      'Priority',
      'Publication Day',
      'Publication Date',
      'Publishing Stage',
      'Commercial Service',
      'CTA Partner',
      'Research Status',
    ];

    const csvRows = briefs.map((b) => [
      `"${b.articleId}"`,
      `"${b.proposedTitle.replace(/"/g, '""')}"`,
      `"${b.canonicalSlug}"`,
      `"${b.primaryKeyword.replace(/"/g, '""')}"`,
      `"${b.topicCategory}"`,
      `"${b.topicCluster.replace(/"/g, '""')}"`,
      `"${b.searchIntent}"`,
      `"${b.targetAudience.join('; ')}"`,
      `"${b.geography}"`,
      `"${b.suggestedArticleDepth}"`,
      `"${b.suggestedWordCountRange}"`,
      `"${b.contentFreshnessRisk}"`,
      `"${b.editorialPriority}"`,
      b.proposedPublicationDay,
      `"${b.proposedPublicationDate}"`,
      `"${b.publishingStage}"`,
      `"${b.relevantCommercialServiceCategory || 'None'}"`,
      `"${b.suggestedCTAOpportunity ? b.suggestedCTAOpportunity.partner : 'none'}"`,
      `"${b.researchStatus}"`,
    ]);

    const csvContent = [csvHeaders.join(','), ...csvRows.map((r) => r.join(','))].join('\n');
    fs.writeFileSync(csvMasterplanPath, csvContent, 'utf-8');

    // 3. Markdown Masterplan Index
    const markdownIndexPath = path.join(this.outputDir, 'editorial-masterplan-index.md');
    const mdLines = [
      '# AI SATELLITE — 1,000-ARTICLE EDITORIAL MASTERPLAN INDEX',
      '**Canonical Production Domain:** https://aisatellite.dev  ',
      '**Horizon:** 90 Days  ',
      `**Generated Records:** ${briefs.length} Deduplicated Article Briefs  `,
      `**Export Date:** ${new Date().toISOString()}  `,
      '',
      '---',
      '',
      '## 1. Category Distribution Summary',
      '| Category | Target | Planned | Allocation % |',
      '| :--- | :---: | :---: | :---: |',
    ];

    const stats = masterplanEngine.getMasterplanStats();
    for (const [cat, count] of Object.entries(stats.categories)) {
      mdLines.push(`| ${cat} | ${count} | ${count} | ${((count / 1000) * 100).toFixed(1)}% |`);
    }
    mdLines.push('| **TOTAL** | **1,000** | **1,000** | **100.0%** |');
    mdLines.push('');
    mdLines.push('---');
    mdLines.push('');
    mdLines.push('## 2. 90-Day Publishing Stages');
    mdLines.push('| Stage | Days | Planned Articles | Daily Average |');
    mdLines.push('| :--- | :---: | :---: | :---: |');
    const calSummary = editorialCalendar.getCalendarSummary();
    for (const [stage, data] of Object.entries(calSummary.stageBreakdown)) {
      mdLines.push(`| ${stage} | ${data.days} | ${data.articles} | ${(data.articles / data.days).toFixed(1)}/day |`);
    }
    mdLines.push('');
    mdLines.push('---');
    mdLines.push('');
    mdLines.push('## 3. Top 50 Flagship Launch Articles (Stage 1 Sampling)');
    mdLines.push('| ID | Title | Category | Intent | Depth | Day |');
    mdLines.push('| :--- | :--- | :--- | :--- | :--- | :---: |');
    briefs.slice(0, 50).forEach((b) => {
      mdLines.push(`| ${b.articleId} | ${b.proposedTitle} | ${b.topicCategory} | ${b.searchIntent} | ${b.suggestedArticleDepth} | Day ${b.proposedPublicationDay} |`);
    });

    fs.writeFileSync(markdownIndexPath, mdLines.join('\n'), 'utf-8');

    // 4. Calendar JSON & CSV
    const calendarJsonPath = path.join(this.outputDir, '90-day-editorial-calendar.json');
    fs.writeFileSync(calendarJsonPath, JSON.stringify(calendar, null, 2), 'utf-8');

    const calendarCsvPath = path.join(this.outputDir, '90-day-editorial-calendar.csv');
    const calCsvHeaders = ['Day Number', 'Stage', 'Date', 'Target Count', 'Focus', 'Article IDs'];
    const calCsvRows = calendar.map((c) => [
      c.dayNumber,
      `"${c.stage}"`,
      `"${c.scheduledDate}"`,
      c.dailyTarget,
      `"${c.editorialFocus.replace(/"/g, '""')}"`,
      `"${c.plannedArticleIds.join(';')}"`,
    ]);
    fs.writeFileSync(calendarCsvPath, [calCsvHeaders.join(','), ...calCsvRows.map((r) => r.join(','))].join('\n'), 'utf-8');

    // 5. Topic Clusters & Pillars Map
    const clusterMapPath = path.join(this.outputDir, 'pillar-and-cluster-map.json');
    fs.writeFileSync(clusterMapPath, JSON.stringify(clusters, null, 2), 'utf-8');

    // 6. Commercial Service Matrix
    const serviceMatrixPath = path.join(this.outputDir, 'commercial-service-matrix.json');
    fs.writeFileSync(serviceMatrixPath, JSON.stringify(COMMERCIAL_SERVICE_MAPPINGS, null, 2), 'utf-8');

    // 7. Owner Projects Research
    const ownerProjectsPath = path.join(this.outputDir, 'owner-projects-research.json');
    fs.writeFileSync(ownerProjectsPath, JSON.stringify(OWNER_PROJECTS_RESEARCH, null, 2), 'utf-8');

    return {
      jsonMasterplanPath,
      csvMasterplanPath,
      markdownIndexPath,
      calendarJsonPath,
      calendarCsvPath,
      clusterMapPath,
      serviceMatrixPath,
      ownerProjectsPath,
    };
  }
}

export const exportEngine = ExportEngine.getInstance();
