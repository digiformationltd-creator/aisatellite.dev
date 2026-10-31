/**
 * AI Satellite — Developer Troubleshooting Universe (Phase 11)
 * High-value technical problem-solving guides detailing symptoms, root causes,
 * diagnostic commands, and verified fixes across modern web and cloud stacks.
 */

import type { TroubleshootingResource } from './types';

export class TroubleshootingEngine {
  private solutions: TroubleshootingResource[] = [
    {
      id: 'trouble-react-hydration-mismatch',
      title: 'Fixing React Hydration Mismatch & DOM Tree Differences',
      slug: 'react-hydration-mismatch-fix',
      summary: 'Diagnose and resolve Next.js and Astro React hydration mismatches caused by browser extensions, window object access, or unformatted timestamps.',
      category: 'developer_troubleshooting',
      tags: ['react', 'nextjs', 'astro', 'hydration', 'ssr'],
      authorOrMaintainer: 'AI Satellite Technical Content Team',
      sourceReferences: [
        { title: 'React Official Hydration Docs', url: 'https://react.dev/reference/react-dom/client/hydrateRoot' },
        { title: 'Astro Client Directives', url: 'https://docs.astro.build/en/reference/directives-reference/#client-directives' },
      ],
      verificationStatus: 'verified',
      lastVerifiedDate: '2026-10-31',
      publishedDate: '2026-10-31',
      updatedDate: '2026-10-31',
      relatedResourceIds: ['tutorial-building-orbital-3d-radar-threejs-astro'],
      editorialStatus: 'published',
      searchKeywords: ['react hydration error', 'text content did not match', 'hydration mismatch', 'ssr client mismatch'],
      symptoms: [
        'Error: Text content does not match server-rendered HTML in console',
        'UI flashes momentarily then resets to initial state on page load',
        'Warning: Expected server HTML to contain a matching <div> in <body>',
      ],
      likelyCauses: [
        'Accessing browser-only globals (window, localStorage, navigator) during initial component render instead of inside useEffect / onMount.',
        'Formatting timestamps with local timezone on the client while the SSR server rendered UTC timestamps.',
        'Third-party browser extensions (Grammarly, password managers) injecting custom DOM attributes into inputs or body.',
        'Invalid HTML nesting (e.g., <p> containing a <div> or <table> lacking <tbody>).',
      ],
      diagnosticSteps: [
        'Inspect browser console to identify the exact DOM node where hydration diverged.',
        'Compare SSR output (View Page Source) with client-rendered DOM in DevTools Elements tab.',
        'Test in Incognito Mode with all browser extensions disabled to isolate third-party DOM modifications.',
      ],
      verifiedFixes: [
        {
          title: 'Defer Client-Only Code with useEffect / Mounted State',
          explanation: 'Ensure values that differ per device (window width, localStorage, user timezone) only evaluate after client hydration completes.',
          codeSnippet: `import { useState, useEffect } from 'react';

export function SafeClientTime({ timestamp }: { timestamp: string }) {
  const [formatted, setFormatted] = useState<string | null>(null);

  useEffect(() => {
    // Evaluates strictly on the client after mount
    setFormatted(new Date(timestamp).toLocaleDateString());
  }, [timestamp]);

  return <span>{formatted ?? 'Loading date...'}</span>;
}`,
          risk: 'low',
        },
        {
          title: 'Use suppressHydrationWarning for Intentional Text Differences',
          explanation: 'If a slight difference (like server vs client timestamp) is acceptable and cannot be delayed, suppress React warning on that specific element.',
          codeSnippet: `<time dateTime={isoDate} suppressHydrationWarning>
  {new Date(isoDate).toLocaleTimeString()}
</time>`,
          risk: 'medium',
        },
      ],
      applicableVersions: ['React 18.x', 'React 19.x', 'Next.js 14/15', 'Astro 4/5'],
      referenceLinks: [
        'https://react.dev/reference/react-dom/client/hydrateRoot#handling-different-client-and-server-content',
      ],
    },
    {
      id: 'trouble-webgl-context-lost',
      title: 'Handling Three.js WebGL Context Loss on Mobile & Sleep Transitions',
      slug: 'threejs-webgl-context-loss-handling',
      summary: 'Prevent white-screen crashes and frozen scenes when mobile GPUs run out of memory or device wakes from sleep.',
      category: 'developer_troubleshooting',
      tags: ['threejs', 'webgl', 'gpu', 'mobile-performance', 'canvas'],
      authorOrMaintainer: 'Three.js & WebGL Creative Lab',
      sourceReferences: [
        { title: 'WebGL Context Lost Specs', url: 'https://www.khronos.org/webgl/wiki/HandlingContextLost' },
        { title: 'Three.js Disposal Guide', url: 'https://threejs.org/docs/#manual/en/introduction/How-to-dispose-of-objects' },
      ],
      verificationStatus: 'verified',
      lastVerifiedDate: '2026-10-31',
      publishedDate: '2026-10-31',
      updatedDate: '2026-10-31',
      relatedResourceIds: ['threejs-shader-cyber-grid'],
      editorialStatus: 'published',
      searchKeywords: ['webgl context lost', 'threejs crash', 'webglcontextlost', 'mobile canvas freeze'],
      symptoms: [
        'WebGL: CONTEXT_LOST_WEBGL error appears in console',
        'Three.js 3D canvas turns completely black or white and stops responding to interaction',
        'Scene freezes when user switches mobile tabs and returns',
      ],
      likelyCauses: [
        'Mobile operating system reclaimed GPU resources due to high memory usage.',
        'Device woke up from deep sleep or screen-lock state.',
        'High devicePixelRatio (>2.0) allocating massive framebuffers exceeding mobile hardware limits.',
      ],
      diagnosticSteps: [
        'Trigger artificial context loss in Chrome DevTools using Rendering -> Emulate a focused page or WebGL context loss extension.',
        'Inspect canvas.addEventListener("webglcontextlost") handlers.',
      ],
      verifiedFixes: [
        {
          title: 'Implement webglcontextlost and webglcontextrestored Listeners',
          explanation: 'Call event.preventDefault() on context lost to signal intent to restore, and reinitialize renderer textures upon restoration.',
          codeSnippet: `const canvas = renderer.domElement;

canvas.addEventListener('webglcontextlost', (event) => {
  event.preventDefault(); // Tells browser we will restore context
  cancelAnimationFrame(animationFrameId);
  console.warn('WebGL context lost. Rendering paused.');
}, false);

canvas.addEventListener('webglcontextrestored', () => {
  console.info('WebGL context restored. Rebuilding geometries and shaders.');
  reinitializeThreeScene();
}, false);`,
          risk: 'low',
        },
        {
          title: 'Clamp devicePixelRatio on Mobile Viewports',
          explanation: 'Never exceed 1.25 to 1.5 pixel ratio on screens under 768px to prevent GPU buffer exhaustion.',
          codeSnippet: `const isMobile = window.innerWidth < 768;
const maxRatio = isMobile ? 1.25 : 2.0;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxRatio));`,
          risk: 'low',
        },
      ],
      applicableVersions: ['Three.js r150–r174', 'WebGL 2.0', 'All modern browsers'],
      referenceLinks: [
        'https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/webglcontextlost_event',
      ],
    },
    {
      id: 'trouble-cloudflare-pages-build-exit-code',
      title: 'Resolving Cloudflare Pages Static Build Exit Code Failures',
      slug: 'cloudflare-pages-build-failure-fix',
      summary: 'Troubleshoot and fix Cloudflare Pages build failures, Node.js version mismatches, and missing environment variables.',
      category: 'developer_troubleshooting',
      tags: ['cloudflare', 'pages', 'deployment', 'ci-cd', 'astro'],
      authorOrMaintainer: 'Cloudflare Operations & Infrastructure',
      sourceReferences: [
        { title: 'Cloudflare Pages Build Config', url: 'https://developers.cloudflare.com/pages/configuration/build-configuration/' },
      ],
      verificationStatus: 'verified',
      lastVerifiedDate: '2026-10-31',
      publishedDate: '2026-10-31',
      updatedDate: '2026-10-31',
      relatedResourceIds: ['tool-cloudflare-pages'],
      editorialStatus: 'published',
      searchKeywords: ['cloudflare pages build failed', 'exit code 1', 'node version cloudflare', 'wrangler deploy error'],
      symptoms: [
        'Build step exited with non-zero status code: 1',
        'SyntaxError: Cannot use import statement outside a module',
        'Failed: build cache failed to locate output directory "dist"',
      ],
      likelyCauses: [
        'Cloudflare Pages defaulting to outdated Node.js v12/v14 instead of Node.js 20+ LTS.',
        'Pages build output directory misconfigured (pointing to public/ instead of dist/).',
        'Private environment variables referenced at build time not defined in Cloudflare Dashboard.',
      ],
      diagnosticSteps: [
        'Examine Cloudflare Pages Build Log at the exact line preceding "Failed: build script exited with status 1".',
        'Run exact build command locally in clean directory: npm run build.',
      ],
      verifiedFixes: [
        {
          title: 'Enforce Node.js 20 LTS via Environment Variable',
          explanation: 'Set NODE_VERSION=20.18.0 in Cloudflare Pages -> Settings -> Environment Variables or .node-version file.',
          codeSnippet: `# In repository root: .node-version
20.18.0

# In .nvmrc
20`,
          risk: 'low',
        },
        {
          title: 'Verify Build Output Directory Matches astro.config',
          explanation: 'Ensure Cloudflare Pages project build setting specifies Build output directory as "dist".',
          codeSnippet: `// wrangler.jsonc
{
  "name": "aisatellite",
  "pages_build_output_dir": "./dist"
}`,
          risk: 'low',
        },
      ],
      applicableVersions: ['Node.js 18+', 'Cloudflare Pages v2', 'Astro 4/5'],
      referenceLinks: [
        'https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/',
      ],
    },
  ];

  public getAllSolutions(): TroubleshootingResource[] {
    return [...this.solutions];
  }

  public getSolutionBySlug(slug: string): TroubleshootingResource | undefined {
    return this.solutions.find((s) => s.slug === slug);
  }

  public getSolutionsByTag(tag: string): TroubleshootingResource[] {
    return this.solutions.filter((s) => s.tags.includes(tag.toLowerCase()));
  }
}

export const troubleshootingEngine = new TroubleshootingEngine();
