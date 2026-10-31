import { describe, it, expect } from 'vitest';
import { hybridSearchEngine } from '../../src/lib/search/hybrid-search';
import { groundedAnswerEngine } from '../../src/lib/search/grounded-answer-engine';
import { tutorialEngine } from '../../src/lib/tutorials/tutorial-engine';
import { uiComponentEngine } from '../../src/lib/ui-components/component-engine';
import { promptGalaxyEngine } from '../../src/lib/prompts/prompt-galaxy';
import { LAB_DEMOS } from '../../src/components/lab/AdvancedLabViewer';
import { SubscriberManager } from '../../growth/newsletter/subscriber-manager';
import { CommunitySubmissionManager } from '../../growth/submissions/submission-manager';
import { brokenLinkChecker } from '../../src/lib/seo/broken-link-checker';

describe('Phase 8 — 12 Critical Production User Journeys', () => {
  // Journey 1: Search for a paid tool
  it('Journey 1: Search for a paid tool ("Zapier alternative") maps to relevant alternatives via hybrid search', () => {
    const searchResponse = hybridSearchEngine.search('zapier alternative');
    expect(searchResponse.query).toBe('zapier alternative');
    expect(searchResponse.intentResult.intent).toBe('find_alternative');
    expect(searchResponse.intentResult.isTargetingAlternative).toBe(true);
    expect(searchResponse.results.length).toBeGreaterThan(0);
    const n8nResult = searchResponse.results.find((r) => r.resource.slug === 'n8n');
    expect(n8nResult).toBeDefined();
    expect(n8nResult?.isAlternativeMatch).toBe(true);
  });

  // Journey 2: Find a free alternative
  it('Journey 2: Discovers verified free and open-source alternatives with clear pricing classification', () => {
    const searchResponse = hybridSearchEngine.search('zapier alternative');
    const grounded = groundedAnswerEngine.generateAnswer(searchResponse);
    expect(grounded.recommendedResources.length).toBeGreaterThan(0);
    const lead = grounded.recommendedResources[0];
    expect(lead.freeClassification).toBeTruthy();
    expect(lead.limitations.length).toBeGreaterThan(0);
    expect(lead.url.startsWith('https://')).toBe(true);
  });

  // Journey 3: Open the comparison
  it('Journey 3: Comparison provides side-by-side evidence, limitations, and self-hosting requirements', () => {
    const searchResponse = hybridSearchEngine.search('photoshop alternative');
    const grounded = groundedAnswerEngine.generateAnswer(searchResponse);
    expect(grounded.freeAndPaidLimitations.length).toBeGreaterThan(0);
    const gimpMatch = grounded.recommendedResources.find((r) => r.slug === 'gimp');
    expect(gimpMatch).toBeDefined();
    expect(gimpMatch?.limitations.length).toBeGreaterThan(0);
  });

  // Journey 4: Verify the official source
  it('Journey 4: Source citations map to legitimate primary sources with verified retrieval dates', () => {
    const searchResponse = hybridSearchEngine.search('supabase');
    const grounded = groundedAnswerEngine.generateAnswer(searchResponse);
    expect(grounded.evidenceReferences.length).toBeGreaterThan(0);
    const citation = grounded.evidenceReferences[0];
    expect(citation.domain.includes('.')).toBe(true);
    expect(citation.url.startsWith('https://')).toBe(true);
    expect(citation.retrievedAt).toMatch(/^\d{4}-\d{2}-\d{2}/);
  });

  // Journey 5: Open a technical tutorial
  it('Journey 5: Retrieves structured 12-section technical tutorial with prerequisite checks', () => {
    const tutorial = tutorialEngine.getTutorialBySlug('building-orbital-3d-radar-threejs-astro');
    expect(tutorial).toBeDefined();
    expect(tutorial?.title).toBeTruthy();
    expect(tutorial?.language).toBe('TypeScript');
    expect(tutorial?.prerequisites.length).toBeGreaterThan(0);
    expect(tutorial?.troubleshooting.length).toBeGreaterThan(0);
    expect(tutorial?.securityConsiderations.length).toBeGreaterThan(0);
  });

  // Journey 6: Copy a code example
  it('Journey 6: Tutorial code blocks contain verified executable syntax and tested markers', () => {
    const tutorial = tutorialEngine.getTutorialBySlug('building-orbital-3d-radar-threejs-astro');
    expect(tutorial?.completeImplementation.length).toBeGreaterThan(10);
    expect(tutorial?.codeTested).toBe(true);
    const validation = tutorialEngine.validateSnippet(tutorial!.completeImplementation, tutorial!.language);
    expect(validation.valid).toBe(true);
  });

  // Journey 7: Open the Prompt Galaxy
  it('Journey 7: Prompt Galaxy exposes categorized systems with metadata', () => {
    const allPrompts = promptGalaxyEngine.getAllTemplates();
    expect(allPrompts.length).toBeGreaterThan(0);
    const categories = Array.from(new Set(allPrompts.map((p) => p.category)));
    expect(categories.length).toBeGreaterThan(0);
  });

  // Journey 8: Customize a prompt
  it('Journey 8: Prompt Builder dynamically interpolates multi-variable templates without raw placeholders', () => {
    const template = promptGalaxyEngine.getTemplateBySlug('fullstack-architect-master');
    expect(template).toBeDefined();
    const customVars: Record<string, string> = {
      '[PROJECT_NAME]': 'AI Satellite Engine',
      '[FRAMEWORK]': 'Astro + Cloudflare Pages',
      '[PROGRAMMING_LANGUAGE]': 'TypeScript',
      '[TARGET_PLATFORM]': 'Cloudflare Edge',
    };
    const rendered = promptGalaxyEngine.interpolate(template!, customVars);
    expect(rendered).toContain('AI Satellite Engine');
    expect(rendered).toContain('Astro + Cloudflare Pages');
    expect(rendered).not.toContain('[PROJECT_NAME]');
  });

  // Journey 9: Explore the 3D Web Lab
  it('Journey 9: 3D Web Lab delivers 5 flagship production demos with verified performance specifications', () => {
    expect(LAB_DEMOS.length).toBe(5);
    LAB_DEMOS.forEach((demo) => {
      expect(demo.title).toBeTruthy();
      expect(demo.tech.length).toBeGreaterThan(0);
      expect(demo.perf.targetFps).toContain('FPS');
      expect(demo.code.length).toBeGreaterThan(20);
    });
  });

  // Journey 10: Subscribe to the newsletter
  it('Journey 10: Double opt-in newsletter flow initiates pending verification and honors immediate unsubscribe', () => {
    const subManager = new SubscriberManager();
    const testEmail = `journey-test-${Date.now()}@example.org`;
    const { subscriber, confirmationToken } = subManager.subscribe(testEmail);
    expect(subscriber.status).toBe('unconfirmed');
    expect(confirmationToken).toBeTruthy();

    const confirmed = subManager.confirmSubscription(confirmationToken!);
    expect(confirmed.status).toBe('active');

    subManager.unsubscribe(testEmail);
    const active = subManager.getActiveRecipients();
    expect(active.some((s) => s.email === testEmail)).toBe(false);
  });

  // Journey 11: Submit a resource suggestion
  it('Journey 11: Community submissions queue receives suggestions, assigns tracking ID, and catches bots', () => {
    const subManager = new CommunitySubmissionManager();
    const uniqueIp = `172.16.${Math.floor(Math.random() * 200)}.${Math.floor(Math.random() * 200)}`;
    const submission = subManager.submitContribution({
      type: 'tool',
      title: 'Journey Test Open Source Tool',
      description: 'A completely verified open source database alternative.',
      resourcePayload: { license: 'MIT', repoUrl: 'https://github.com/example/tool' },
      rawIp: uniqueIp,
    });
    expect(submission.id.startsWith('SUB-')).toBe(true);
    expect(submission.status).toBe('pending');

    // Bot honeypot trap
    expect(() => {
      subManager.submitContribution({
        type: 'tool',
        title: 'Bot submission',
        description: 'Spam text',
        resourcePayload: {},
        honeyPotField: 'http://spam-link.xyz',
        rawIp: uniqueIp,
      });
    }).toThrow(/Spam submission detected/);
  });

  // Journey 12: Navigate using a mobile device
  it('Journey 12: Validates complete site route integrity and zero broken internal destinations', () => {
    const auditLinks = [
      { source: '/nav-mobile', target: '/' },
      { source: '/nav-mobile', target: '/radar' },
      { source: '/nav-mobile', target: '/solutions' },
      { source: '/nav-mobile', target: '/tutorials' },
      { source: '/nav-mobile', target: '/components' },
      { source: '/nav-mobile', target: '/prompts/builder' },
      { source: '/nav-mobile', target: '/3d-lab' },
      { source: '/nav-mobile', target: '/alternatives' },
      { source: '/nav-mobile', target: '/workspace' },
    ];
    const report = brokenLinkChecker.auditLinks(auditLinks);
    expect(report.brokenCount).toBe(0);
  });
});
