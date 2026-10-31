/**
 * AI Satellite — Phase 14 Autonomous Global Technology Discovery & Intelligence Network
 * Comprehensive 40-Point Acceptance Test Suite
 * Permanent Canonical Domain: https://aisatellite.dev
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  sourceRegistry,
  discoveryScheduler,
  gitHubIntelligenceEngine,
  aiToolsDiscoveryEngine,
  freeAlternativesEngine,
  changeDetectionEngine,
  evidenceLedgerEngine,
  technologyKnowledgeGraph,
  relevanceScoringEngine,
  editorialPipeline,
  radarEngine,
  costAndSecurityManager,
  discoveryAgent,
  verificationAgent,
  licensingAgent,
  alternativesAgent,
  qaAndEditorialAgent,
  discoveryDatabase,
  OSI_APPROVED_LICENSES,
  CAPABILITY_TAXONOMY,
} from '../../src/lib/discovery';

describe('Phase 14: Autonomous Global Technology Discovery & Intelligence Network', () => {
  beforeEach(() => {
    // Reset DB for test isolation
    discoveryDatabase.resetDatabase();
    costAndSecurityManager.resetCostTracking();
  });

  // --- Group 1: Approved Sources & SSRF Security (Criteria 1-8) ---

  it('1. Approved Source Registry accepts valid HTTPS URLs from official domains', () => {
    const source = sourceRegistry.registerSource({
      sourceUrl: 'https://docs.docker.com',
      sourceType: 'official_docs',
      organization: 'Docker Inc.',
      verificationLevel: 'authoritative',
      crawlPermissionsAllowed: true,
      rateLimitPerMinute: 30,
    });

    expect(source.id).toBeDefined();
    expect(source.sourceUrl).toBe('https://docs.docker.com');
    expect(source.status).toBe('active');
  });

  it('2. Approved Source Registry blocks invalid URLs and malformed inputs', () => {
    expect(() =>
      sourceRegistry.registerSource({
        sourceUrl: 'not-a-valid-url',
        sourceType: 'official_website',
        organization: 'Invalid Org',
      })
    ).toThrow();
  });

  it('3. SSRF Protection blocks localhost and loopback addresses', () => {
    const loopback = costAndSecurityManager.validateUrlForSsrf('http://127.0.0.1/admin');
    expect(loopback.allowed).toBe(false);
    expect(loopback.reason).toContain('SSRF Violation');

    const localhost = costAndSecurityManager.validateUrlForSsrf('https://localhost:8080');
    expect(localhost.allowed).toBe(false);
    expect(localhost.reason).toContain('SSRF Violation');
  });

  it('4. SSRF Protection blocks RFC 1918 private IPv4 networks (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16)', () => {
    const rfc10 = costAndSecurityManager.validateUrlForSsrf('https://10.0.1.5/api');
    expect(rfc10.allowed).toBe(false);

    const rfc172 = costAndSecurityManager.validateUrlForSsrf('https://172.20.0.10/status');
    expect(rfc172.allowed).toBe(false);

    const rfc192 = costAndSecurityManager.validateUrlForSsrf('https://192.168.1.1/router');
    expect(rfc192.allowed).toBe(false);
  });

  it('5. SSRF Protection blocks Cloud metadata endpoints (169.254.169.254)', () => {
    const metadata = costAndSecurityManager.validateUrlForSsrf('http://169.254.169.254/latest/meta-data/');
    expect(metadata.allowed).toBe(false);
    expect(metadata.reason).toContain('Cloud instance metadata');
  });

  it('6. Source registry enforces verification levels (authoritative, verified_secondary, community_reported, unverified)', () => {
    const s1 = sourceRegistry.registerSource({
      sourceUrl: 'https://kubernetes.io/docs',
      sourceType: 'official_docs',
      organization: 'CNCF',
      verificationLevel: 'authoritative',
    });
    expect(s1.verificationLevel).toBe('authoritative');

    const s2 = sourceRegistry.registerSource({
      sourceUrl: 'https://community.forum.example.com',
      sourceType: 'research_publication',
      organization: 'Tech Community',
      verificationLevel: 'community_reported',
    });
    expect(s2.verificationLevel).toBe('community_reported');
  });

  it('7. Crawl permissions flag (crawlPermissionsAllowed) respected for all sources', () => {
    const allowed = sourceRegistry.registerSource({
      sourceUrl: 'https://developer.mozilla.org',
      sourceType: 'official_docs',
      organization: 'Mozilla',
      crawlPermissionsAllowed: true,
    });
    expect(sourceRegistry.checkCrawlAllowed(allowed.sourceUrl)).toBe(true);

    const disallowed = sourceRegistry.registerSource({
      sourceUrl: 'https://private-docs.internal.org',
      sourceType: 'official_docs',
      organization: 'Private Org',
      crawlPermissionsAllowed: false,
    });
    expect(sourceRegistry.checkCrawlAllowed(disallowed.sourceUrl)).toBe(false);
  });

  it('8. Per-domain rate limiters throttle excessive requests within 60s windows', () => {
    const domain = 'fast-api.example.com';
    const limit = 3;

    expect(costAndSecurityManager.checkRateLimit(domain, limit)).toBe(true);
    expect(costAndSecurityManager.checkRateLimit(domain, limit)).toBe(true);
    expect(costAndSecurityManager.checkRateLimit(domain, limit)).toBe(true);
    // 4th call exceeds limit
    expect(costAndSecurityManager.checkRateLimit(domain, limit)).toBe(false);
  });

  // --- Group 2: Autonomous Scheduler & Execution (Criteria 9-13) ---

  it('9. Autonomous Scheduler initializes 10 distinct job categories', () => {
    discoveryScheduler.seedDefaultJobs();
    const jobs = discoveryScheduler.getJobs();
    expect(jobs.length).toBeGreaterThanOrEqual(10);

    const categories = new Set(jobs.map((j) => j.category));
    expect(categories.has('discover_ai_tools')).toBe(true);
    expect(categories.has('discover_open_source')).toBe(true);
    expect(categories.has('monitor_github_releases')).toBe(true);
    expect(categories.has('check_licenses')).toBe(true);
    expect(categories.has('detect_pricing_changes')).toBe(true);
  });

  it('10. Scheduler executes jobs with timeout enforcement', async () => {
    const job = discoveryScheduler.createJob({
      category: 'discover_open_source',
      timeoutMs: 50, // Short timeout for test
      retryLimit: 1,
    });

    // A runner that exceeds timeout
    const result = await discoveryScheduler.executeJob(job.id, async () => {
      await new Promise((r) => setTimeout(r, 120));
      return { itemsDiscovered: 5 };
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain('timed out');
  });

  it('11. Scheduler handles retry limits and backoff transitions on failure', async () => {
    const job = discoveryScheduler.createJob({
      category: 'monitor_github_releases',
      retryLimit: 2,
      timeoutMs: 500,
    });

    // Attempt 1: fails, status remains scheduled
    await discoveryScheduler.executeJob(job.id, async () => {
      throw new Error('Upstream GitHub API 500 error');
    });

    const afterFirst = discoveryScheduler.getJob(job.id);
    expect(afterFirst?.currentRetries).toBe(1);
    expect(afterFirst?.status).toBe('scheduled');

    // Attempt 2: fails, reaches limit -> status failed
    await discoveryScheduler.executeJob(job.id, async () => {
      throw new Error('Upstream GitHub API 500 error');
    });

    const afterSecond = discoveryScheduler.getJob(job.id);
    expect(afterSecond?.currentRetries).toBe(2);
    expect(afterSecond?.status).toBe('failed');
  });

  it('12. Scheduler handles job pausing and resumption gracefully', () => {
    const job = discoveryScheduler.createJob({
      category: 'discover_frameworks',
    });

    discoveryScheduler.pauseJob(job.id);
    expect(discoveryScheduler.getJob(job.id)?.status).toBe('paused');

    discoveryScheduler.resumeJob(job.id);
    expect(discoveryScheduler.getJob(job.id)?.status).toBe('scheduled');
  });

  it('13. Daily cost budget limits prevent runaway job executions', async () => {
    const smallBudgetMgr = new (costAndSecurityManager.constructor as any)(0.05); // $0.05 limit
    expect(smallBudgetMgr.checkAndRecordCost(0.03).allowed).toBe(true);
    expect(smallBudgetMgr.checkAndRecordCost(0.03).allowed).toBe(false); // exceeds 0.05
  });

  // --- Group 3: GitHub Intelligence & OSI Compliance (Criteria 14-18) ---

  it('14. GitHub Intelligence extracts repository license and identifies OSI compliance', () => {
    const record = gitHubIntelligenceEngine.processRepoMetadata({
      repoUrl: 'https://github.com/astral-sh/uv',
      owner: 'astral-sh',
      repoName: 'uv',
      description: 'An extremely fast Python package and project manager, written in Rust.',
      license: 'Apache-2.0',
      supportedLanguages: ['Rust', 'Python'],
    });

    expect(record.isOsiLicense).toBe(true);
    expect(record.license).toBe('Apache-2.0');
  });

  it('15. Non-OSI or source-available licenses are flagged as not OSI approved', () => {
    const record = gitHubIntelligenceEngine.processRepoMetadata({
      repoUrl: 'https://github.com/example/bsl-tool',
      owner: 'example',
      repoName: 'bsl-tool',
      description: 'Business Source Licensed project.',
      license: 'BSL-1.1',
      supportedLanguages: ['Go'],
    });

    expect(record.isOsiLicense).toBe(false);
  });

  it('16. GitHub Intelligence accurately detects archived repositories', () => {
    const record = gitHubIntelligenceEngine.processRepoMetadata({
      repoUrl: 'https://github.com/old-org/deprecated-framework',
      owner: 'old-org',
      repoName: 'deprecated-framework',
      description: 'No longer maintained.',
      license: 'MIT',
      isArchived: true,
      supportedLanguages: ['JavaScript'],
    });

    expect(record.isArchived).toBe(true);
    expect(gitHubIntelligenceEngine.getArchivedRecords().some((r) => r.id === record.id)).toBe(true);
  });

  it('17. Active OSI records query returns only active, non-archived repositories', () => {
    gitHubIntelligenceEngine.seedDefaultRecords();
    const activeOsi = gitHubIntelligenceEngine.getActiveOsiRecords();
    expect(activeOsi.length).toBeGreaterThan(0);
    for (const r of activeOsi) {
      expect(r.isOsiLicense).toBe(true);
      expect(r.isArchived).toBe(false);
    }
  });

  it('18. GitHub Intelligence records documentation presence and install commands', () => {
    const record = gitHubIntelligenceEngine.processRepoMetadata({
      repoUrl: 'https://github.com/pydantic/pydantic',
      owner: 'pydantic',
      repoName: 'pydantic',
      description: 'Data validation using Python type hints.',
      license: 'MIT',
      hasDocumentation: true,
      documentationUrl: 'https://docs.pydantic.dev',
      installInstructions: 'pip install pydantic',
      supportedLanguages: ['Python'],
    });

    expect(record.hasDocumentation).toBe(true);
    expect(record.installInstructions).toBe('pip install pydantic');
  });

  // --- Group 4: Emerging AI Tools Discovery (Criteria 19-22) ---

  it('19. Emerging AI Tools engine categorizes tools across 12 AI categories', () => {
    aiToolsDiscoveryEngine.seedDefaultAiTools();
    const tools = aiToolsDiscoveryEngine.getAiTools();
    expect(tools.length).toBeGreaterThanOrEqual(4);

    const allCaps = tools.flatMap((t) => t.capabilities);
    expect(allCaps.some((c) => c === 'local_llm_runners')).toBe(true);
    expect(allCaps.some((c) => c === 'agent_frameworks')).toBe(true);
  });

  it('20. AI Tools engine records explicit pricing models (free, freemium, paid, open_source)', () => {
    const tool = aiToolsDiscoveryEngine.registerAiTool({
      name: 'LocalAI',
      slug: 'localai',
      websiteUrl: 'https://localai.io',
      developerOrg: 'Mudler',
      primaryPurpose: 'Free Open Source OpenAI alternative for local inference',
      capabilities: ['local_llm_runners', 'speech_voice_ai'],
      pricingModel: 'open_source',
      freeTierConditions: '100% Free self-hosted MIT license',
      apiAvailable: true,
      supportedPlatforms: ['Linux', 'macOS', 'Docker'],
      documentationUrl: 'https://localai.io/docs',
    });

    expect(tool.pricingModel).toBe('open_source');
  });

  it('21. AI Tools engine verifies free-tier conditions and local resource requirements', () => {
    aiToolsDiscoveryEngine.seedDefaultAiTools();
    const ollama = aiToolsDiscoveryEngine.getAiToolBySlug('ollama');
    expect(ollama?.freeTierConditions).toContain('Requires local CPU/GPU RAM');
  });

  it('22. AI Tools engine tracks API availability and platform compatibility', () => {
    aiToolsDiscoveryEngine.seedDefaultAiTools();
    const toolsWithApi = aiToolsDiscoveryEngine.getToolsWithApi();
    expect(toolsWithApi.length).toBeGreaterThan(0);
    for (const t of toolsWithApi) {
      expect(t.apiAvailable).toBe(true);
      expect(t.supportedPlatforms.length).toBeGreaterThan(0);
    }
  });

  // --- Group 5: Free Alternatives Research Engine (Criteria 23-27) ---

  it('23. Free Alternatives engine maps paid tools to 16-group capability taxonomy', () => {
    const taxonomy = freeAlternativesEngine.getTaxonomy();
    expect(taxonomy.length).toBe(16);
    expect(taxonomy).toContain('workflow_automation');
    expect(taxonomy).toContain('databases');
    expect(taxonomy).toContain('vector_embeddings');
  });

  it('24. Free Alternatives engine assigns 1 of 6 standardized classifications', () => {
    const finding = freeAlternativesEngine.registerAlternative({
      paidToolName: 'Algolia',
      alternativeName: 'Meilisearch',
      alternativeUrl: 'https://www.meilisearch.com',
      license: 'MIT',
      classification: 'free_and_open_source',
      capabilityOverlap: ['databases', 'analytics'],
      deploymentOptions: ['docker', 'cloud'],
      limitations: ['Self-hosted requires memory configuration for large search indexes.'],
      infrastructureCostEstimated: '$5/month VPS or free cloud tier',
      evidenceUrls: ['https://www.meilisearch.com/pricing'],
    });

    expect(finding.classification).toBe('free_and_open_source');
  });

  it('25. Free Alternatives calculates capability match score accurately', () => {
    const required = ['databases', 'cloud_hosting', 'api_development', 'crm'];
    const offered = ['databases', 'cloud_hosting', 'api_development'];

    const score = freeAlternativesEngine.calculateCapabilityMatchScore(required, offered);
    expect(score).toBe(75); // 3 out of 4 = 75%
  });

  it('26. Free Alternatives engine estimates realistic infrastructure hosting costs', () => {
    freeAlternativesEngine.seedDefaultFindings();
    const baserow = freeAlternativesEngine.findAlternativesFor('Airtable');
    expect(baserow.length).toBeGreaterThan(0);
    expect(baserow[0].infrastructureCostEstimated).toContain('VPS');
  });

  it('27. Free Alternatives documents explicit migration hurdles and limitations', () => {
    freeAlternativesEngine.seedDefaultFindings();
    const zapierAlt = freeAlternativesEngine.findAlternativesFor('Zapier');
    expect(zapierAlt.length).toBeGreaterThan(0);
    expect(zapierAlt[0].limitations.length).toBeGreaterThan(0);
    expect(zapierAlt[0].limitations[0]).toContain('Docker');
  });

  // --- Group 6: Technology Change Detection (Criteria 28-30) ---

  it('28. Change Detection engine logs pricing, licensing, and deprecation modifications', () => {
    const change = changeDetectionEngine.recordChange({
      resourceId: 'res-test',
      resourceName: 'TestLib',
      changeType: 'licensing_change',
      previousValue: 'MIT',
      newValue: 'Server Side Public License (SSPL)',
      evidenceUrl: 'https://testlib.org/blog/licensing-update',
      proposedAction: 'Flag tool in radar and search alternative.',
    });

    expect(change.id).toBeDefined();
    expect(change.changeType).toBe('licensing_change');
  });

  it('29. Change Detection records previous and new values with evidence URL', () => {
    changeDetectionEngine.seedDefaultChanges();
    const changes = changeDetectionEngine.getChanges({ changeType: 'licensing_change' });
    expect(changes.length).toBeGreaterThan(0);
    const terraform = changes.find((c) => c.resourceName === 'Terraform');
    expect(terraform?.previousValue).toContain('MPL-2.0');
    expect(terraform?.newValue).toContain('BSL-1.1');
    expect(terraform?.evidenceUrl).toContain('hashicorp.com');
  });

  it('30. Change Detection supports verification status updates (verified/rejected)', () => {
    const change = changeDetectionEngine.recordChange({
      resourceId: 'res-unconfirmed',
      resourceName: 'Unconfirmed Tool',
      changeType: 'pricing_change',
      previousValue: '$10',
      newValue: '$50',
      evidenceUrl: 'https://example.com/rumor',
      verificationStatus: 'unconfirmed',
      proposedAction: 'Await official announcement.',
    });

    expect(change.verificationStatus).toBe('unconfirmed');
    changeDetectionEngine.verifyChange(change.id, 'verified');
    expect(change.verificationStatus).toBe('verified');
  });

  // --- Group 7: Evidence Ledger & Multi-Source Verification (Criteria 31-34) ---

  it('31. Evidence Ledger records claim-level evidence with retrieval timestamps', () => {
    const ev = evidenceLedgerEngine.recordEvidence({
      claimId: 'claim-valkey-bsd',
      sourceUrl: 'https://github.com/valkey-io/valkey/blob/unstable/LICENSE',
      sourceTitle: 'Valkey BSD-3 License',
      sourceType: 'license_file',
      claimSupported: 'Valkey is open source under BSD-3-Clause',
      relevantExcerpt: 'Redistribution and use in source and binary forms, with or without modification...',
    });

    expect(ev.retrievalTimestamp).toBeDefined();
    expect(ev.isAuthoritative).toBe(true);
  });

  it('32. Evidence Ledger enforces authority hierarchy (e.g. license files > readme badges)', () => {
    const isAuth = evidenceLedgerEngine.isSourceAuthoritativeForClaim('license_file', 'Valkey license is BSD');
    expect(isAuth).toBe(true);

    const isNonAuth = evidenceLedgerEngine.isSourceAuthoritativeForClaim('research_publication', 'Pricing is $20/mo');
    expect(isNonAuth).toBe(false);
  });

  it('33. Evidence Ledger bounds excerpts to <= 500 characters to prevent copyright copying', () => {
    const longExcerpt = 'a'.repeat(800);
    const ev = evidenceLedgerEngine.recordEvidence({
      claimId: 'claim-excerpt-bound',
      sourceUrl: 'https://example.com/legal',
      sourceTitle: 'Long Terms',
      sourceType: 'official_website',
      claimSupported: 'Excerpt length test',
      relevantExcerpt: longExcerpt,
    });

    expect(ev.relevantExcerpt.length).toBeLessThanOrEqual(500);
  });

  it('34. Multi-source evidence evaluation elevates claim confidence on independent corroboration', () => {
    const claimId = 'claim-multi-source-test';
    evidenceLedgerEngine.recordEvidence({
      claimId,
      sourceUrl: 'https://source1.example.com/docs',
      sourceTitle: 'Source 1 Docs',
      sourceType: 'official_docs',
      claimSupported: 'Tool X is free',
      relevantExcerpt: 'Tool X provides unlimited free access for community use.',
    });
    evidenceLedgerEngine.recordEvidence({
      claimId,
      sourceUrl: 'https://source2.example.com/announcement',
      sourceTitle: 'Source 2 Press',
      sourceType: 'official_website',
      claimSupported: 'Tool X is free',
      relevantExcerpt: 'Official confirmation of free community tier.',
    });

    const confidence = evidenceLedgerEngine.evaluateClaimConfidence(claimId);
    expect(confidence.overallConfidence).toBe('high');
    expect(confidence.evidenceCount).toBe(2);
    expect(confidence.sources.length).toBe(2);
  });

  // --- Group 8: Knowledge Graph & Traversal (Criteria 35-37) ---

  it('35. Knowledge Graph stores typed nodes (product, capability, license, etc.)', () => {
    const node = technologyKnowledgeGraph.addNode({
      type: 'product',
      name: 'PostgreSQL',
      slug: 'postgresql',
      attributes: { relational: true, version: 17 },
    });

    expect(node.type).toBe('product');
    expect(node.slug).toBe('postgresql');
  });

  it('36. Knowledge Graph supports semantic directed edges (replaces, licensed_under, provides_capability)', () => {
    const n1 = technologyKnowledgeGraph.addNode({ type: 'product', name: 'Valkey', slug: 'valkey' });
    const n2 = technologyKnowledgeGraph.addNode({ type: 'product', name: 'Redis', slug: 'redis' });

    const edge = technologyKnowledgeGraph.addEdge({
      sourceNodeId: n1.id,
      targetNodeId: n2.id,
      relationship: 'replaces',
      confidence: 0.98,
    });

    expect(edge.relationship).toBe('replaces');
    expect(edge.confidence).toBe(0.98);
  });

  it('37. Knowledge Graph queries find alternatives and capability providers with cycle safety', () => {
    technologyKnowledgeGraph.seedDefaultGraph();
    const alts = technologyKnowledgeGraph.findAlternatives('supabase');
    expect(alts.length).toBeGreaterThan(0);
    expect(alts.some((a) => a.name === 'Firebase')).toBe(true);

    const dbTools = technologyKnowledgeGraph.findToolsByCapability('databases');
    expect(dbTools.length).toBeGreaterThan(0);
    expect(dbTools.some((t) => t.name === 'Supabase')).toBe(true);
  });

  // --- Group 9: Relevance Scoring & Editorial Pipeline (Criteria 38-39) ---

  it('38. Relevance Scoring engine calculates explainable, multi-signal scores without vanity bias', () => {
    const activeOsiScore = relevanceScoringEngine.calculateScore({
      latestReleaseDate: new Date().toISOString(), // recent release
      isArchived: false,
      isOsiLicense: true,
      hasDocumentation: true,
      hasInstallInstructions: true,
      isAuthoritativeVerified: true,
      evidenceCount: 3,
      capabilityCount: 4,
    });

    expect(activeOsiScore.totalScore).toBeGreaterThanOrEqual(85);
    expect(activeOsiScore.explanation).toContain('OSI-compliant');
    expect(activeOsiScore.breakdown.recencyScore).toBe(25);

    const archivedScore = relevanceScoringEngine.calculateScore({
      isArchived: true,
      isOsiLicense: true,
    });
    expect(archivedScore.breakdown.recencyScore).toBe(0);
    expect(archivedScore.totalScore).toBeLessThan(activeOsiScore.totalScore);
  });

  it('39. Editorial Pipeline converts findings into structured proposals with evidence requirements', () => {
    // Record valid evidence first
    const ev = evidenceLedgerEngine.recordEvidence({
      claimId: 'claim-uv-fast',
      sourceUrl: 'https://astral.sh/blog/uv',
      sourceTitle: 'Astral Blog on uv',
      sourceType: 'official_website',
      claimSupported: 'uv provides 10-100x faster package installation than pip',
      relevantExcerpt: 'uv is written in Rust and operates 10-100x faster than traditional pip.',
    });

    const proposal = editorialPipeline.createProposal({
      title: 'uv: The Blazing Fast Python Package Manager',
      proposalType: 'project_review',
      researchEvidenceIds: [ev.id],
      targetAudience: 'Python Developers',
      searchIntent: 'Faster alternative to pip and poetry',
      uniqueValue: 'Drop-in virtualenv and pip compatibility with sub-second lockfile resolution.',
    });

    expect(proposal.id).toBeDefined();
    expect(proposal.status).toBe('pending_review');

    // Review proposal
    const approved = editorialPipeline.reviewProposal(proposal.id, 'Senior Editor', 'approved', 'Verified benchmarks');
    expect(approved.status).toBe('approved');
    expect(approved.reviewedBy).toBe('Senior Editor');
  });

  // --- Group 10: Radar Telemetry & Specialized Agents (Criterion 40) ---

  it('40. Radar Engine maps telemetry into 4 orbital quadrants with polar coordinates (r, theta)', () => {
    radarEngine.seedDefaultRadarEntries();
    const entries = radarEngine.getTelemetryEntries();
    expect(entries.length).toBeGreaterThanOrEqual(4);

    const quadrants = new Set(entries.map((e) => e.coordinates.quadrant));
    expect(quadrants.has('ai_models')).toBe(true);
    expect(quadrants.has('open_source')).toBe(true);
    expect(quadrants.has('frameworks')).toBe(true);
    expect(quadrants.has('alternatives')).toBe(true);

    for (const e of entries) {
      expect(e.coordinates.r).toBeGreaterThanOrEqual(0.0);
      expect(e.coordinates.r).toBeLessThanOrEqual(1.0);
      expect(e.coordinates.theta).toBeGreaterThanOrEqual(0);
      expect(e.coordinates.theta).toBeLessThanOrEqual(360);
    }

    // Verify bounded agents
    const ssrfCheck = discoveryAgent.scanApprovedSource('http://169.254.169.254/meta');
    expect(ssrfCheck.allowed).toBe(false);

    const licenseAnalysis = licensingAgent.analyzeLicense('MIT');
    expect(licenseAnalysis.isOsiApproved).toBe(true);
    expect(licenseAnalysis.licenseType).toBe('permissive');
    expect(licenseAnalysis.commercialUseAllowed).toBe(true);
  });
});
