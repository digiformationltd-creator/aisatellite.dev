/**
 * AI Satellite — Developer Learning Journeys Engine (Phase 12)
 * Structured curriculum tracks with progress calculation, bookmarks, and exercises.
 * (Explicit policy: Does not issue accredited certificates).
 */

import crypto from 'node:crypto';
import { workspaceDatabase } from './database';
import type { LearningProgress } from './types';

export interface LearningLesson {
  id: string;
  title: string;
  durationMinutes: number;
  description: string;
  prerequisites: string[];
  referenceSlug?: string;
}

export interface LearningTrack {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  lessons: LearningLesson[];
}

export class LearningEngine {
  private tracks: LearningTrack[] = [
    {
      id: 'track-react-modern',
      title: 'Modern React & Architecture',
      slug: 'learn-react',
      description: 'Master React 19, Server Components, client directives, and performance optimization.',
      category: 'Frontend',
      difficulty: 'Intermediate',
      lessons: [
        { id: 'react-01', title: 'React 19 Hooks and Transitions', durationMinutes: 20, description: 'Learn useActionState, useOptimistic, and use() hook patterns.', prerequisites: [] },
        { id: 'react-02', title: 'Hydration Mismatch Diagnostics', durationMinutes: 25, description: 'Prevent and debug SSR vs client markup differences.', prerequisites: ['react-01'], referenceSlug: 'react-hydration-mismatch-fix' },
        { id: 'react-03', title: 'Compound UI Components with Tailwind', durationMinutes: 30, description: 'Build reusable accessible design system components.', prerequisites: ['react-01'] },
      ],
    },
    {
      id: 'track-ai-agents',
      title: 'Autonomous AI Agents & MCP',
      slug: 'build-ai-agents',
      description: 'Engineer type-safe tool calling agents and Model Context Protocol servers.',
      category: 'AI Engineering',
      difficulty: 'Advanced',
      lessons: [
        { id: 'mcp-01', title: 'Model Context Protocol Fundamentals', durationMinutes: 30, description: 'Protocol JSON-RPC specification, tools, resources, and stdio/SSE transports.', prerequisites: [] },
        { id: 'mcp-02', title: 'Secure Filesystem Sandboxing & Defense', durationMinutes: 35, description: 'Prevent directory traversal and prompt injection attacks.', prerequisites: ['mcp-01'] },
        { id: 'mcp-03', title: 'PostgreSQL Read-Only Inspector Agent', durationMinutes: 40, description: 'Build least-privilege SQL agents with transaction guards.', prerequisites: ['mcp-02'] },
      ],
    },
    {
      id: 'track-threejs-webgl',
      title: 'Three.js & Cinematic 3D Graphics',
      slug: 'master-threejs',
      description: 'Render orbital space scenes, custom GLSL shaders, and resilient WebGL canvases.',
      category: 'Graphics',
      difficulty: 'Intermediate',
      lessons: [
        { id: 'three-01', title: 'Orbital Scene & Perspective Cameras', durationMinutes: 25, description: 'Setting up space canvases with Three.js in Astro and React.', prerequisites: [] },
        { id: 'three-02', title: 'Handling WebGL Context Loss', durationMinutes: 30, description: 'Implement crash recovery on mobile devices and tab sleeps.', prerequisites: ['three-01'], referenceSlug: 'threejs-webgl-context-loss-handling' },
      ],
    },
    {
      id: 'track-cloudflare-deployment',
      title: 'Cloudflare Edge Deployment & Workers',
      slug: 'cloudflare-deployment',
      description: 'Deploy lightning-fast edge applications, configure custom domains, and setup API proxies.',
      category: 'DevOps',
      difficulty: 'Beginner',
      lessons: [
        { id: 'cf-01', title: 'Deploying Static Sites to Cloudflare Pages', durationMinutes: 15, description: 'Wrangler configuration, build outputs, and headers.', prerequisites: [] },
        { id: 'cf-02', title: 'Rate-Limited Edge Worker API Proxy', durationMinutes: 30, description: 'Build edge proxies protecting upstream APIs with rate limiting.', prerequisites: ['cf-01'] },
      ],
    },
  ];

  public getAllTracks(): LearningTrack[] {
    return [...this.tracks];
  }

  public getTrack(trackId: string): LearningTrack | undefined {
    return this.tracks.find((t) => t.id === trackId || t.slug === trackId);
  }

  /**
   * Updates lesson completion and recalculates percentage.
   */
  public updateLessonProgress(
    userId: string,
    trackId: string,
    lessonId: string,
    completed: boolean
  ): LearningProgress {
    const track = this.getTrack(trackId);
    let progress = workspaceDatabase.getLearningProgress(userId, trackId);
    const now = new Date().toISOString();

    if (!progress) {
      progress = {
        id: `prog-${crypto.randomBytes(6).toString('hex')}`,
        userId,
        pathId: trackId,
        completedLessonIds: [],
        bookmarkedLessonIds: [],
        currentStep: 1,
        lastActiveAt: now,
        percentComplete: 0,
      };
    }

    const currentCompleted = new Set(progress.completedLessonIds);
    if (completed) {
      currentCompleted.add(lessonId);
    } else {
      currentCompleted.delete(lessonId);
    }

    progress.completedLessonIds = Array.from(currentCompleted);
    const totalLessons = track?.lessons.length || 1;
    progress.percentComplete = Math.round((progress.completedLessonIds.length / totalLessons) * 100);
    progress.lastActiveAt = now;

    workspaceDatabase.saveLearningProgress(progress);
    return progress;
  }

  /**
   * Retrieves user's progress for a track.
   */
  public getUserProgress(userId: string, trackId: string): LearningProgress | undefined {
    return workspaceDatabase.getLearningProgress(userId, trackId);
  }
}

export const learningEngine = new LearningEngine();
