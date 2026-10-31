/**
 * AI Satellite — Smart Resource Recommendations Engine (Phase 12)
 * Generates transparent, rules-grounded recommendations from explicit user interests,
 * saved resources, and active project stacks.
 */

import { workspaceDatabase } from './database';
import { freeAPIDirectory } from '../knowledge/free-apis';
import { troubleshootingEngine } from '../knowledge/troubleshooting-engine';
import { mcpAndAgentsEngine } from '../knowledge/mcp-and-agents-engine';
import { promptGalaxyEngine } from '../prompts/prompt-galaxy';
import { tutorialEngine } from '../tutorials/tutorial-engine';

export interface RecommendationItem {
  id: string;
  title: string;
  category: string;
  url: string;
  reason: string;
  score: number;
}

export class RecommendationsEngine {
  /**
   * Generates recommendations based on verified user profile signals.
   */
  public getRecommendations(userId: string): RecommendationItem[] {
    const prefs = workspaceDatabase.getPreferences(userId);
    if (!prefs || !prefs.personalizationEnabled) {
      // Non-personalized fallback when personalization is disabled
      return [
        {
          id: 'rec-generic-01',
          title: 'Open-Meteo Weather API',
          category: 'free_apis',
          url: '/free-apis/open-meteo-weather-api',
          reason: 'Popular high-reliability free developer API (No auth required)',
          score: 50,
        },
        {
          id: 'rec-generic-02',
          title: 'Building an Orbital 3D Radar with Three.js',
          category: 'tutorials',
          url: '/tutorials/building-orbital-3d-radar-threejs-astro',
          reason: 'Featured production architecture tutorial',
          score: 40,
        },
      ];
    }

    const saved = workspaceDatabase.getSavedResources(userId);
    const projects = workspaceDatabase.getProjects(userId);
    const interests = new Set(prefs.interests.map((i) => i.toLowerCase()));

    // Collect tech keywords from user's active projects
    const projectTechs = new Set<string>();
    projects.forEach((p) => p.techStack.forEach((t) => projectTechs.add(t.toLowerCase())));

    const recommendations: RecommendationItem[] = [];

    // 1. Recommend AI Agent & MCP tools if user has AI interests or projects
    if (interests.has('ai development') || interests.has('ai agents') || projectTechs.has('ai')) {
      const servers = mcpAndAgentsEngine.getAllServers();
      if (servers.length > 0) {
        recommendations.push({
          id: servers[0].id,
          title: servers[0].title,
          category: 'mcp_servers',
          url: `/knowledge`,
          reason: 'Matches your interest in AI development and Model Context Protocol agents.',
          score: 95,
        });
      }
    }

    // 2. Recommend Three.js resources if interested in Three.js or graphics
    if (interests.has('three.js') || interests.has('ui/ux') || projectTechs.has('three.js')) {
      recommendations.push({
        id: 'rec-threejs-solution',
        title: 'Handling Three.js WebGL Context Loss',
        category: 'developer_troubleshooting',
        url: '/troubleshooting/threejs-webgl-context-loss-handling',
        reason: 'Recommended for Three.js 3D graphics stability on mobile and sleep wakeups.',
        score: 90,
      });
    }

    // 3. Recommend React tutorials if active project uses React
    if (projectTechs.has('react') || interests.has('frontend development')) {
      recommendations.push({
        id: 'rec-react-hydration',
        title: 'Fixing React Hydration Mismatches in SSR',
        category: 'developer_troubleshooting',
        url: '/troubleshooting/react-hydration-mismatch-fix',
        reason: 'Relevant to your active React project technology stack.',
        score: 85,
      });
    }

    // 4. Recommend Free APIs for automation or backend projects
    if (interests.has('automation') || interests.has('free alternatives') || projectTechs.has('node.js')) {
      const apis = freeAPIDirectory.getAllAPIs();
      if (apis.length > 0) {
        recommendations.push({
          id: apis[0].id,
          title: apis[0].title,
          category: 'free_apis',
          url: `/knowledge`,
          reason: 'Verified free API with generous rate limits matching your automation interests.',
          score: 80,
        });
      }
    }

    return recommendations.sort((a, b) => b.score - a.score);
  }
}

export const recommendationsEngine = new RecommendationsEngine();
