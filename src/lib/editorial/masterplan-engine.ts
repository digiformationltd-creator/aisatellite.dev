/**
 * AI Satellite — Phase 22 Masterplan Engine
 * Algorithmic generator and catalog of 1,000 deduplicated, research-backed article briefs.
 * Ensures strict allocation across all 8 editorial categories:
 * - Business Startup and Growth: 200
 * - Free AI Tools and AI Agents: 150
 * - Paid Software Alternatives: 150
 * - GitHub and Open-Source Projects: 150
 * - Automation, CRM and Workflows: 120
 * - UK and US Business Guides: 100
 * - Industry-Specific Business Growth: 80
 * - Developer Tutorials and Technical Resources: 50
 * TOTAL = Exactly 1,000 articles.
 * Canonical Production Domain: https://aisatellite.dev
 */

import type {
  ArticleBrief,
  EditorialPlanningCategory,
  SearchIntent,
  ContentFreshness,
  ArticleDepth,
  PublishingStage,
  TopicCluster,
} from './types';
import { CATEGORY_TARGET_ALLOCATIONS } from './types';
import { findCommercialMapping } from './service-relevance-matrix';
import { OWNER_PROJECTS_RESEARCH } from './owner-projects-research';

export class MasterplanEngine {
  private static instance: MasterplanEngine;
  private cachedBriefs: ArticleBrief[] | null = null;

  public static getInstance(): MasterplanEngine {
    if (!MasterplanEngine.instance) {
      MasterplanEngine.instance = new MasterplanEngine();
    }
    return MasterplanEngine.instance;
  }

  /**
   * Generates or retrieves the complete 1,000-article editorial masterplan.
   */
  public generateMasterplan(): ArticleBrief[] {
    if (this.cachedBriefs && this.cachedBriefs.length === 1000) {
      return this.cachedBriefs;
    }

    const briefs: ArticleBrief[] = [];
    let counter = 1;

    // Helper to format article ID
    const nextId = () => `ART-${String(counter++).padStart(4, '0')}`;

    // Helper to compute publication day and stage
    const computeSchedule = (index: number) => {
      // Index from 0 to 999 mapped across 90 days
      const day = Math.min(Math.floor((index / 1000) * 90) + 1, 90);
      const baseDate = new Date('2026-11-01T08:00:00Z');
      baseDate.setDate(baseDate.getDate() + (day - 1));
      const isoDate = baseDate.toISOString().split('T')[0];

      let stage: PublishingStage;
      if (day <= 15) {
        stage = 'Stage 1 — Foundation (Days 1–15)';
      } else if (day <= 40) {
        stage = 'Stage 2 — Topical Expansion (Days 16–40)';
      } else if (day <= 70) {
        stage = 'Stage 3 — Coverage Expansion (Days 41–70)';
      } else {
        stage = 'Stage 4 — Quality Consolidation (Days 71–90)';
      }

      return { day, isoDate, stage };
    };

    // Slug generation and duplicate tracking
    const seenSlugs = new Set<string>();
    const seenTitles = new Set<string>();

    const addBrief = (partial: {
      category: EditorialPlanningCategory;
      title: string;
      slug: string;
      primaryKeyword: string;
      supportingKeywords: string[];
      searchIntent: SearchIntent;
      targetAudience: string[];
      geography: string;
      topicCluster: string;
      parentPillar: string;
      readerProblem: string;
      uniqueAngle: string;
      outline: string[];
      researchQuestions: string[];
      sources: { title: string; url: string; rationale?: string }[];
      examples: string[];
      freeTools: string[];
      githubRepos: string[];
      articleDepth: ArticleDepth;
      wordCount: string;
      freshness: ContentFreshness;
      priority: 'P1 - High' | 'P2 - Medium' | 'P3 - Standard';
    }) => {
      let slug = partial.slug
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Ensure zero slug collisions
      let disambiguator = 2;
      while (seenSlugs.has(slug)) {
        slug = `${partial.slug}-${disambiguator++}`;
      }
      seenSlugs.add(slug);

      // Ensure zero title collisions
      let title = partial.title;
      let titleDisambiguator = 2;
      while (seenTitles.has(title)) {
        title = `${partial.title} (Part ${titleDisambiguator++})`;
      }
      seenTitles.add(title);

      const schedule = computeSchedule(briefs.length);

      // Determine commercial relevance
      const commercialMapping = findCommercialMapping(
        partial.category,
        [partial.primaryKeyword, ...partial.supportingKeywords],
        partial.geography
      );

      const brief: ArticleBrief = {
        articleId: nextId(),
        proposedTitle: title,
        canonicalSlug: slug,
        primaryKeyword: partial.primaryKeyword,
        supportingKeywords: partial.supportingKeywords,
        searchIntent: partial.searchIntent,
        targetAudience: partial.targetAudience,
        geography: partial.geography,
        topicCategory: partial.category,
        topicCluster: partial.topicCluster,
        parentPillar: partial.parentPillar,
        readerProblem: partial.readerProblem,
        uniqueEditorialAngle: partial.uniqueAngle,
        proposedOutline: partial.outline,
        researchQuestions: partial.researchQuestions,
        requiredSources: partial.sources,
        suggestedExamples: partial.examples,
        freeToolsToInvestigate: partial.freeTools,
        githubResourcesToInvestigate: partial.githubRepos,
        relevantCommercialServiceCategory: commercialMapping ? commercialMapping.serviceCategory : null,
        disclosureRequirements: commercialMapping
          ? commercialMapping.disclosureText
          : 'None required. 100% independent editorial resource.',
        suggestedArticleDepth: partial.articleDepth,
        suggestedWordCountRange: partial.wordCount,
        internalLinkTargets: ['/blog', `/blog/category/${slug}`, '/alternatives', '/open-source'],
        suggestedCTAOpportunity: commercialMapping
          ? {
              type: 'Relevant Service Card',
              partner: commercialMapping.provider === 'DigiFormation Ltd' ? 'digiformation' : 'digibizos',
              description: `Contextual recommendation for ${commercialMapping.serviceCategory}.`,
              destinationUrl: commercialMapping.canonicalUrl,
            }
          : {
              type: 'Related Free Tool Card',
              partner: 'free_tool',
              description: 'Explore free developer tools in the AI Satellite open-source directory.',
              destinationUrl: 'https://aisatellite.dev/alternatives',
            },
        contentFreshnessRisk: partial.freshness,
        editorialPriority: partial.priority,
        proposedPublicationDay: schedule.day,
        proposedPublicationDate: schedule.isoDate,
        publishingStage: schedule.stage,
        researchStatus: 'Research Ready',
        editorialRiskAssessment: {
          riskLevel: partial.freshness === 'Regulated' ? 'medium' : 'low',
          notes:
            partial.freshness === 'Regulated'
              ? 'Jurisdiction-specific compliance claims require verification against primary statutory legislation.'
              : 'Standard editorial verification of technical steps and code snippets required.',
        },
      };

      briefs.push(brief);
    };

    // =========================================================================
    // 1. BUSINESS STARTUP AND GROWTH (Target: 200)
    // =========================================================================
    const startupPillars = [
      'The Founder Launchpad: From Idea Validation to First 100 Customers',
      'The B2B Service Agency Playbook: Scaling Client Retainers',
      'Modern Customer Acquisition & Local SEO for Small Businesses',
      'Bootstrapping to Profitability: Zero-Venture Capital Business Models',
    ];

    const startupTopics = [
      { name: 'Idea Validation', kw: 'validate business idea', intent: 'Business Planning' as SearchIntent },
      { name: 'Customer Discovery', kw: 'customer interview framework', intent: 'Tutorial' as SearchIntent },
      { name: 'Pricing Strategy', kw: 'b2b value based pricing', intent: 'Informational' as SearchIntent },
      { name: 'Inbound Lead Funnels', kw: 'high conversion inbound funnel', intent: 'Tutorial' as SearchIntent },
      { name: 'Cold Outreach Compliance', kw: 'b2b cold email gdpr compliance', intent: 'Informational' as SearchIntent },
      { name: 'Google Business Profile', kw: 'rank google business profile local 3 pack', intent: 'Tutorial' as SearchIntent },
      { name: 'Local Citation Auditing', kw: 'local seo citation consistency', intent: 'Troubleshooting' as SearchIntent },
      { name: 'Client Retention Systems', kw: 'reduce agency client churn', intent: 'Business Planning' as SearchIntent },
      { name: 'Sales Discovery Calls', kw: 'b2b sales qualification framework', intent: 'Tutorial' as SearchIntent },
      { name: 'Proposals That Close', kw: 'software consulting proposal template', intent: 'Business Planning' as SearchIntent },
      { name: 'Cash Flow Management', kw: 'bootstrapped startup cash flow forecasting', intent: 'Informational' as SearchIntent },
      { name: 'Hiring Remote Developers', kw: 'hire offshore software engineers', intent: 'Business Planning' as SearchIntent },
      { name: 'Contract Negotiations', kw: 'software master services agreement clauses', intent: 'Commercial Investigation' as SearchIntent },
      { name: 'SaaS Churn Reduction', kw: 'b2b saas retention cohorts', intent: 'Comparative' as SearchIntent },
      { name: 'Subcontracting Workflows', kw: 'agency white label partner agreement', intent: 'Navigational' as SearchIntent },
      { name: 'Referral Engine Design', kw: 'client referral incentive program', intent: 'Tutorial' as SearchIntent },
      { name: 'Organic LinkedIn Growth', kw: 'founder led sales on linkedin', intent: 'Tutorial' as SearchIntent },
      { name: 'Content Marketing ROI', kw: 'measure b2b content marketing roi', intent: 'Informational' as SearchIntent },
      { name: 'SEO for New Domains', kw: 'rank new website fast in google', intent: 'Tutorial' as SearchIntent },
      { name: 'SME Productivity Systems', kw: 'eliminate manual admin in small business', intent: 'Business Planning' as SearchIntent },
    ];

    const startupModifiers = [
      'for Boutique Agencies',
      'for Freelance Developers',
      'for Remote Founders',
      'Step-by-Step Blueprint',
      'Complete 2026 Guide',
      'Common Mistakes to Avoid',
      'Without Paid Ads',
      'with Zero Overhead',
      'Actionable Framework',
      'for First-Time Founders',
    ];

    for (let i = 0; i < 200; i++) {
      const topic = startupTopics[i % startupTopics.length];
      const modifier = startupModifiers[Math.floor(i / startupTopics.length) % startupModifiers.length];
      const pillar = startupPillars[i % startupPillars.length];

      addBrief({
        category: 'Business Startup and Growth',
        title: `How to Master ${topic.name} ${modifier}`,
        slug: `how-to-master-${topic.name.toLowerCase().replace(/\s+/g, '-')}-${modifier.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        primaryKeyword: `${topic.kw} ${modifier.toLowerCase().replace(/[^a-z0-9\s]/g, '')}`.trim(),
        supportingKeywords: [topic.kw, 'business growth strategies', 'founder playbooks'],
        searchIntent: topic.intent,
        targetAudience: ['Entrepreneurs', 'Agency Founders', 'Small Business Owners'],
        geography: 'Global',
        topicCluster: `Startup Growth — ${topic.name}`,
        parentPillar: pillar,
        readerProblem: `Founders struggle to execute ${topic.name.toLowerCase()} efficiently without wasting budget or losing prospective clients.`,
        uniqueAngle: 'Empirical data breakdowns, real client case studies, and practical operational templates with zero fluff.',
        outline: [
          'The Root Operational Bottleneck',
          'Foundational Principles & Customer Psychology',
          'Actionable Step-by-Step Implementation Protocol',
          'Recommended Free Software & Automation Tools',
          'Common Pitfalls and Costly Traps to Avoid',
          'Executive Action Checklist',
        ],
        researchQuestions: [
          `What are the verified conversion rates for ${topic.name.toLowerCase()} in modern B2B markets?`,
          'Which free software tools eliminate manual data entry in this workflow?',
        ],
        sources: [
          { title: 'Harvard Business Review Entrepreneurship Research', url: 'https://hbr.org', rationale: 'Authoritative data on SME survival and scaling.' },
          { title: 'Google Search Central Local Guidance', url: 'https://developers.google.com/search', rationale: 'Verified search ranking guidelines.' },
        ],
        examples: ['Mid-sized software development shop', '5-person digital marketing studio'],
        freeTools: ['coolify', 'sqlite', 'cloudflare-pages'],
        githubRepos: ['digi-ai/digi-lead-hunter'],
        articleDepth: i % 10 === 0 ? 'Pillar Content (4,000-5,000+ words)' : 'Standard Guide (1,500-2,500 words)',
        wordCount: i % 10 === 0 ? '4,000-5,500 words' : '1,800-2,400 words',
        freshness: 'Evergreen',
        priority: i % 4 === 0 ? 'P1 - High' : 'P2 - Medium',
      });
    }

    // =========================================================================
    // 2. FREE AI TOOLS AND AI AGENTS (Target: 150)
    // =========================================================================
    const aiPillars = [
      'The Autonomous Agent Architecture Master Blueprint',
      'The Complete Guide to Self-Hosted Local AI & Open Models',
      '100% Free AI Tool Stack for Engineering and Business Teams',
    ];

    const aiToolTypes = [
      { name: 'Ollama for Local Inference', tool: 'Ollama', kw: 'run local llm ollama tutorial' },
      { name: 'Llama 3 8B Local Deployment', tool: 'Llama 3', kw: 'self host llama 3 open source' },
      { name: 'Mistral 7B for Coding', tool: 'Mistral', kw: 'mistral 7b developer code assistant' },
      { name: 'DeepSeek V3 Developer Setup', tool: 'DeepSeek', kw: 'deepseek v3 api integration guide' },
      { name: 'Model Context Protocol (MCP) Servers', tool: 'MCP', kw: 'build custom mcp server claude' },
      { name: 'ChromaDB Local Vector Storage', tool: 'ChromaDB', kw: 'chromadb local rag setup' },
      { name: 'Qdrant Vector Search Engine', tool: 'Qdrant', kw: 'qdrant open source vector database' },
      { name: 'LangChain Local Autonomous Pipelines', tool: 'LangChain', kw: 'langchain local python agents' },
      { name: 'LlamaIndex Retrieval Systems', tool: 'LlamaIndex', kw: 'llamaindex local document search' },
      { name: 'Whisper AI Speech Transcription', tool: 'Whisper', kw: 'whisper local speech to text' },
      { name: 'Stable Diffusion WebUI Forge', tool: 'SD Forge', kw: 'stable diffusion local free image generation' },
      { name: 'Kokoro Open Voice Synthesis', tool: 'Kokoro', kw: 'kokoro tts open source voice' },
      { name: 'Open WebUI Sovereign ChatGPT Interface', tool: 'Open WebUI', kw: 'open webui docker setup ollama' },
      { name: 'Claude Code CLI Automated Workflows', tool: 'Claude Code', kw: 'claude code cli agent architecture' },
      { name: 'Digi Labs Benchmark Framework', tool: 'Digi Labs', kw: 'digi labs agent benchmark evaluation' },
    ];

    const aiModifiers = [
      'Production Setup & Benchmarking',
      'Zero Cloud Fees Architecture',
      'Step-by-Step Docker Walkthrough',
      'Performance & Token Speed Optimization',
      'Security & Local Data Privacy Audit',
      'Comparison with Proprietary Cloud APIs',
      'Multi-Agent Orchestration Blueprint',
      'Memory Management & Tool Validation',
      'Troubleshooting Out of Memory Errors',
      'Enterprise Deployment Playbook',
    ];

    for (let i = 0; i < 150; i++) {
      const tool = aiToolTypes[i % aiToolTypes.length];
      const mod = aiModifiers[Math.floor(i / aiToolTypes.length) % aiModifiers.length];
      const pillar = aiPillars[i % aiPillars.length];

      addBrief({
        category: 'Free AI Tools and AI Agents',
        title: `${tool.name}: ${mod}`,
        slug: `${tool.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${mod.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        primaryKeyword: `${tool.kw} ${mod.toLowerCase().replace(/[^a-z0-9\s]/g, '')}`.trim(),
        supportingKeywords: [tool.kw, 'free ai tools', 'open source ai agents', 'local llm'],
        searchIntent: 'Tutorial',
        targetAudience: ['AI Engineers', 'Software Developers', 'Technical Founders'],
        geography: 'Global',
        topicCluster: `Local AI & Agents — ${tool.tool}`,
        parentPillar: pillar,
        readerProblem: `Engineers want to deploy ${tool.tool} locally without paying recurring token fees or risking private data leakage to external vendors.`,
        uniqueAngle: 'Tested Docker Compose manifests, hardware token-per-second benchmarks, and deterministic tool call validations.',
        outline: [
          `Architecture Overview: How ${tool.tool} Operates`,
          'Hardware Prerequisites & Memory Sizing Matrix',
          'Step-by-Step Installation & Configuration',
          'Connecting to Local RAG and Tool Execution',
          'Token Throughput Benchmark Results',
          'Security Hardening & Network Isolation',
        ],
        researchQuestions: [
          `What is the exact memory footprint of ${tool.tool} under quantizations Q4_K_M vs Q8_0?`,
          'How does this open model compare to commercial frontier APIs in coding evaluations?',
        ],
        sources: [
          { title: `${tool.tool} Official GitHub Documentation`, url: 'https://github.com', rationale: 'Primary source code and installation guidelines.' },
          { title: 'Anthropic Model Context Protocol Specification', url: 'https://modelcontextprotocol.io', rationale: 'Universal agent tooling standard.' },
        ],
        examples: ['Customer support inquiry triage agent', 'Autonomous pull request review bot'],
        freeTools: ['ollama', 'postgresql', 'supabase'],
        githubRepos: ['digi-ai/digi-labs', 'ollama/ollama'],
        articleDepth: 'In-Depth Guide (2,500-4,000 words)',
        wordCount: '2,400-3,200 words',
        freshness: 'Frequently Changing',
        priority: 'P1 - High',
      });
    }

    // =========================================================================
    // 3. PAID SOFTWARE ALTERNATIVES (Target: 150)
    // =========================================================================
    const altPillars = [
      'The Definitive Proprietary Software Replacement Encyclopedia',
      'The Open-Source Self-Hosting Migration Guide',
      'Slashing SaaS Subscriptions: Replacing $1,000/mo Cloud Bills',
    ];

    const proprietaryTools = [
      { paid: 'Salesforce & HubSpot', open: 'ERPNext & SuiteCRM', kw: 'free open source crm alternatives' },
      { paid: 'Zapier & Make', open: 'n8n & Activepieces', kw: 'self hosted automation alternatives to zapier' },
      { paid: 'Notion & Coda', open: 'AppFlowy & Affine', kw: 'open source notion alternative self hosted' },
      { paid: 'Airtable', open: 'NocoDB & Baserow', kw: 'open source airtable database replacement' },
      { paid: 'Figma', open: 'Penpot', kw: 'penpot open source design tool review' },
      { paid: 'Slack', open: 'Mattermost & Zulip', kw: 'self hosted team chat alternative to slack' },
      { paid: 'Trello & Asana', open: 'Taiga & Planka', kw: 'open source project management kanban' },
      { paid: 'Google Analytics', open: 'Umami & Plausible', kw: 'privacy friendly google analytics alternative' },
      { paid: 'Photoshop', open: 'GIMP & Photopea', kw: 'free photoshop alternatives for design' },
      { paid: 'Premiere Pro', open: 'DaVinci Resolve & Kdenlive', kw: 'free video editing software alternatives' },
      { paid: 'AWS S3', open: 'MinIO & Ceph', kw: 'self hosted s3 compatible object storage' },
      { paid: 'Firebase & Supabase Cloud', open: 'Self-Hosted Supabase & PocketBase', kw: 'self hosted backend as a service' },
      { paid: 'Auth0 & Okta', open: 'Authentik & Keycloak', kw: 'open source identity provider sso' },
      { paid: 'Heroku & Vercel', open: 'Coolify & Dokku', kw: 'self hosted paas alternatives to heroku' },
      { paid: 'Microsoft 365', open: 'DigiOffice Suite & LibreOffice', kw: 'offline office suite alternatives to m365' },
    ];

    const altAngles = [
      'Feature-by-Feature Comparison',
      'Self-Hosting & Docker Migration Guide',
      'Total Cost of Ownership Analysis',
      'Security, GDPR & Data Sovereignty Audit',
      'Step-by-Step Data Export & Import Playbook',
      'API & Webhook Compatibility Evaluation',
      'Performance Under 10,000 Records Load',
      'Limitations & When Paid Software Is Still Better',
      'Small Business Implementation Case Study',
      'Developer Productivity Benchmark',
    ];

    for (let i = 0; i < 150; i++) {
      const pair = proprietaryTools[i % proprietaryTools.length];
      const angle = altAngles[Math.floor(i / proprietaryTools.length) % altAngles.length];
      const pillar = altPillars[i % altPillars.length];

      let altIntent: SearchIntent = 'Alternative-Seeking';
      if (angle === 'Total Cost of Ownership Analysis' || angle === 'Limitations & When Paid Software Is Still Better') {
        altIntent = 'Commercial Investigation';
      } else if (angle === 'Feature-by-Feature Comparison') {
        altIntent = 'Comparative';
      } else if (angle === 'Self-Hosting & Docker Migration Guide' || angle === 'Step-by-Step Data Export & Import Playbook') {
        altIntent = 'Tutorial';
      }

      addBrief({
        category: 'Paid Software Alternatives',
        title: `Replacing ${pair.paid} with ${pair.open}: ${angle}`,
        slug: `replacing-${pair.paid.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-with-${pair.open.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${angle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        primaryKeyword: `${pair.kw} ${pair.paid.toLowerCase()}`.trim(),
        supportingKeywords: [pair.kw, 'open source software alternatives', 'self hosted software'],
        searchIntent: altIntent,
        targetAudience: ['CTOs', 'Agency Owners', 'DevOps Engineers', 'Cost-Conscious Founders'],
        geography: 'Global',
        topicCluster: `Software Migration — ${pair.paid}`,
        parentPillar: pillar,
        readerProblem: `Companies spend thousands per month on ${pair.paid} per-seat licensing and want an audited, data-sovereign open-source alternative.`,
        uniqueAngle: 'Transparent side-by-side capability matrices, verified migration command scripts, and objective analysis of edge-case limitations.',
        outline: [
          `Why Businesses Are Migrating Away from ${pair.paid}`,
          `Deep Dive: How ${pair.open} Matches Core Features`,
          'Infrastructure Cost Breakdown (Cloud SaaS vs Self-Hosted VPS)',
          'Migration Protocol: Exporting Data, Users, and Permissions',
          'Production Gotchas, Missing Features, and Compromises',
          'Verdict: Who Should Switch and Who Should Stay',
        ],
        researchQuestions: [
          `What are the verified storage and compute costs for self-hosting ${pair.open} on Hetzner or DigitalOcean?`,
          'Which third-party integrations break when switching from proprietary APIs to open-source protocols?',
        ],
        sources: [
          { title: `${pair.open} Official Documentation`, url: 'https://github.com', rationale: 'Verified software licensing and installation specifications.' },
          { title: 'Electronic Frontier Foundation (EFF) Data Sovereignty Guidelines', url: 'https://eff.org', rationale: 'Data privacy principles.' },
        ],
        examples: ['15-person remote web development agency', 'Healthcare clinic handling HIPAA/GDPR data'],
        freeTools: ['coolify', 'postgresql', 'minio', 'authentik'],
        githubRepos: ['digi-ai/digioffice-suite'],
        articleDepth: 'Standard Guide (1,500-2,500 words)',
        wordCount: '2,000-2,600 words',
        freshness: 'Frequently Changing',
        priority: 'P1 - High',
      });
    }

    // =========================================================================
    // 4. GITHUB AND OPEN-SOURCE PROJECTS (Target: 150)
    // =========================================================================
    const githubPillars = [
      'The Open-Source Developer Atlas: Curated Repositories for Modern Builders',
      'The Self-Hosting Architecture Manual for Engineers',
      'Auditing Open-Source Security, Maintenance & Supply Chain Risks',
    ];

    const githubCategories = [
      { name: 'Self-Hosted Developer Platform Coolify', repo: 'coollabsio/coolify', kw: 'coolify self hosted platform guide' },
      { name: 'Authentik Identity Provider', repo: 'goauthentik/authentik', kw: 'authentik sso docker installation' },
      { name: 'Supabase Open Source Architecture', repo: 'supabase/supabase', kw: 'supabase self hosting docker postgres' },
      { name: 'PocketBase Single File Backend', repo: 'pocketbase/pocketbase', kw: 'pocketbase sqlite backend tutorial' },
      { name: 'MinIO Distributed Object Storage', repo: 'minio/minio', kw: 'minio s3 object storage production setup' },
      { name: 'Nextcloud Sovereign Cloud Hub', repo: 'nextcloud/server', kw: 'nextcloud private cloud server setup' },
      { name: 'Chatwoot Multi-Channel Support', repo: 'chatwoot/chatwoot', kw: 'chatwoot open source live chat crm' },
      { name: 'Typebot Conversational Form Builder', repo: 'baptisteArno/typebot.io', kw: 'typebot self hosted lead capture' },
      { name: 'Digi Labs AI Agent Benchmarks', repo: 'digi-ai/digi-labs', kw: 'digi labs agent performance test' },
      { name: 'Digi Hunter Repository Scanner', repo: 'digi-ai/digi-lead-hunter', kw: 'digi lead hunter open source scanner' },
      { name: 'Digi Office Suite Sovereign Desktop', repo: 'digi-ai/digioffice-suite', kw: 'digioffice suite tauri rust desktop' },
      { name: 'Digi WhatsApp Agent Bot', repo: 'digi-ai/digi-whatsapp-agent', kw: 'digi whatsapp agent baileys crm' },
      { name: 'SearXNG Privacy Metasearch Engine', repo: 'searxng/searxng', kw: 'searxng private search engine setup' },
      { name: 'Uptime Kuma Status Monitor', repo: 'louislam/uptime-kuma', kw: 'uptime kuma self hosted monitoring' },
      { name: 'NocoDB Smart Spreadsheet Database', repo: 'nocodb/nocodb', kw: 'nocodb postgres airtable alternative' },
    ];

    const githubFocusAreas = [
      'Production Docker Compose Walkthrough',
      'Security Vulnerability & Maintenance Audit',
      'Performance Benchmarks Under Load',
      'Backup & Disaster Recovery Protocols',
      'Custom Plugin & Webhook Extensions',
      'Reverse Proxy & SSL Configuration (Caddy & Cloudflare)',
      'Scaling from Single Node to Cluster',
      'Troubleshooting Startup & Database Migration Errors',
      'API Integration with TypeScript & Node.js',
      'Repository Structure & Source Code Navigation',
    ];

    for (let i = 0; i < 150; i++) {
      const cat = githubCategories[i % githubCategories.length];
      const focus = githubFocusAreas[Math.floor(i / githubCategories.length) % githubFocusAreas.length];
      const pillar = githubPillars[i % githubPillars.length];

      let githubIntent: SearchIntent = 'Tutorial';
      if (focus === 'Repository Structure & Source Code Navigation') {
        githubIntent = 'Navigational';
      } else if (focus === 'Troubleshooting Startup & Database Migration Errors') {
        githubIntent = 'Troubleshooting';
      } else if (focus === 'Security Vulnerability & Maintenance Audit') {
        githubIntent = 'Informational';
      } else if (focus === 'Performance Benchmarks Under Load') {
        githubIntent = 'Comparative';
      }

      addBrief({
        category: 'GitHub and Open-Source Projects',
        title: `${cat.name}: ${focus}`,
        slug: `${cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${focus.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        primaryKeyword: `${cat.kw} ${focus.toLowerCase().replace(/[^a-z0-9\s]/g, '')}`.trim(),
        supportingKeywords: [cat.kw, 'github open source projects', 'self hosted software', cat.repo],
        searchIntent: githubIntent,
        targetAudience: ['DevOps Engineers', 'Full-Stack Developers', 'Systems Architects'],
        geography: 'Global',
        topicCluster: `Open-Source Repositories — ${cat.repo}`,
        parentPillar: pillar,
        readerProblem: `Engineers need a reliable, tested deployment guide for ${cat.repo} with production-grade security, automated backups, and minimal operational maintenance.`,
        uniqueAngle: 'Verified Docker manifests, real terminal output logs, security permission lockdowns, and disaster recovery recovery drills.',
        outline: [
          `Overview of Repository: ${cat.repo}`,
          'Hardware Sizing & Port Configuration Requirements',
          'Production docker-compose.yml File Breakdown',
          'Reverse Proxy (Cloudflare / Caddy) SSL Setup',
          'Automated Snapshot Backups to S3 Storage',
          'Common Production Issues and Log Troubleshooting',
        ],
        researchQuestions: [
          `What are the verified minimum CPU/RAM requirements for ${cat.repo} in production?`,
          'How does the repository manage persistent database volumes across container updates?',
        ],
        sources: [
          { title: `${cat.repo} GitHub Repository`, url: `https://github.com/${cat.repo}`, rationale: 'Primary source code and official release notes.' },
        ],
        examples: ['Hetzner CX32 cloud server deployment', 'Local homelab Proxmox container'],
        freeTools: ['coolify', 'postgresql', 'sqlite', 'minio'],
        githubRepos: [cat.repo],
        articleDepth: 'Standard Guide (1,500-2,500 words)',
        wordCount: '1,900-2,500 words',
        freshness: 'Frequently Changing',
        priority: 'P2 - Medium',
      });
    }

    // =========================================================================
    // 5. AUTOMATION, CRM AND WORKFLOWS (Target: 120)
    // =========================================================================
    const autoPillars = [
      'The Autonomous Agency Operating System: Architecture & Automation',
      'The High-Converting Inbound Lead & CRM Engine',
      'Event-Driven Workflow Orchestration for Growing Businesses',
    ];

    const autoTopics = [
      { name: 'Inbound Lead Response Under 60 Seconds', kw: '60 second lead response automation' },
      { name: 'Automated Client Invoicing & Payment Chasing', kw: 'automate client invoicing payment follow up' },
      { name: 'Multi-Stage CRM Pipeline Visibility', kw: 'crm pipeline stage management b2b' },
      { name: 'Calendar Scheduling Without Email Ping-Pong', kw: 'automated appointment booking workflow' },
      { name: 'Client Onboarding Document Dispatch', kw: 'automate client onboarding documents' },
      { name: 'Webhook Error Handling & Fallbacks', kw: 'resilient webhook failure retry architecture' },
      { name: 'Customer Review Collection Automation', kw: 'automated customer google review generation' },
      { name: 'Dealership Test Drive Booking Sequences', kw: 'car dealership automated test drive scheduling' },
      { name: 'Clinic Appointment Reminder SMS Workflows', kw: 'clinic patient sms reminder automation' },
      { name: 'Contract Signature Triggered Workflows', kw: 'trigger onboarding after contract signed' },
      { name: 'Sales Margin & Commission Calculations', kw: 'automated sales commission tracking crm' },
      { name: 'AI WhatsApp Agent Customer Intake', kw: 'whatsapp crm customer intake automation' },
    ];

    const autoModifiers = [
      'Implementation Blueprint',
      'Zero-Code & API Hybrid Architecture',
      'Eliminating SaaS Subscription Fatigue',
      'Step-by-Step Configuration Guide',
      'Failure Modes & Error Handling',
      'for B2B Service Agencies',
      'for High-Ticket Showrooms & Retail',
      'with Unified Business OS Platforms',
      'Measuring Speed-to-Lead ROI',
      'Automated Follow-Up Cadence Templates',
    ];

    for (let i = 0; i < 120; i++) {
      const top = autoTopics[i % autoTopics.length];
      const mod = autoModifiers[Math.floor(i / autoTopics.length) % autoModifiers.length];
      const pillar = autoPillars[i % autoPillars.length];

      let autoIntent: SearchIntent = 'Tutorial';
      if (top.name === 'Webhook Error Handling & Fallbacks') {
        autoIntent = 'Troubleshooting';
      } else if (top.name === 'Multi-Stage CRM Pipeline Visibility') {
        autoIntent = 'Business Planning';
      } else if (mod === 'Measuring Speed-to-Lead ROI') {
        autoIntent = 'Commercial Investigation';
      }

      addBrief({
        category: 'Automation, CRM and Workflows',
        title: `${top.name}: ${mod}`,
        slug: `${top.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${mod.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        primaryKeyword: `${top.kw} ${mod.toLowerCase().replace(/[^a-z0-9\s]/g, '')}`.trim(),
        supportingKeywords: [top.kw, 'crm automation workflows', 'speed to lead', 'business operating system'],
        searchIntent: autoIntent,
        targetAudience: ['Operations Directors', 'Agency Owners', 'Sales Managers', 'Dealership Principals'],
        geography: 'Global',
        topicCluster: `CRM & Automation — ${top.name}`,
        parentPillar: pillar,
        readerProblem: `Manual administrative follow-up causes lost leads, delayed client payments, and team burnout.`,
        uniqueAngle: 'Deterministic state machine diagrams, webhook payload samples, and speed-to-lead conversion benchmarks.',
        outline: [
          'The Cost of Slow Follow-Up: Statistical Analysis',
          'Architecture of the Automated Trigger & Action Pipeline',
          'Configuring Instant Multi-Channel Alerts (SMS, Email, WhatsApp)',
          'CRM State Machine: Tracking Deal Progress Automatically',
          'Testing Fallbacks When Webhooks Fail',
          'Implementation Checklist & ROI Calculation',
        ],
        researchQuestions: [
          'What is the measurable impact of 60-second vs 30-minute lead response on close rates?',
          'How can businesses consolidate multiple automation subscriptions into a single platform?',
        ],
        sources: [
          { title: 'MIT Lead Response Management Study', url: 'https://leadresponsemanagement.org', rationale: 'Empirical data on speed-to-lead.' },
        ],
        examples: ['Automotive dealership handling online financing inquiries', 'Consulting agency onboarding new retainers'],
        freeTools: ['postgresql', 'sqlite', 'cloudflare-pages'],
        githubRepos: ['digi-ai/digi-whatsapp-agent'],
        articleDepth: 'Standard Guide (1,500-2,500 words)',
        wordCount: '1,800-2,400 words',
        freshness: 'Frequently Changing',
        priority: 'P1 - High',
      });
    }

    // =========================================================================
    // 6. UK AND US BUSINESS GUIDES (Target: 100)
    // =========================================================================
    const legalPillars = [
      'The International Founder Guide to UK Company Formation & Banking',
      'The US LLC Masterclass for Remote Entrepreneurs & Software Creators',
      'Cross-Border Corporate Compliance, VAT & Payment Gateway Architecture',
    ];

    const legalTopics = [
      { name: 'UK LTD Formation for Non-Residents', country: 'United Kingdom', kw: 'uk ltd formation non resident director' },
      { name: 'Companies House Identity Verification (ECCTA)', country: 'United Kingdom', kw: 'companies house id verification eccta' },
      { name: 'UK Registered Office Address Legal Rules', country: 'United Kingdom', kw: 'statutory uk registered office address requirements' },
      { name: 'HMRC Corporation Tax Registration Deadlines', country: 'United Kingdom', kw: 'register for corporation tax hmrc 3 months' },
      { name: 'UK Confirmation Statement (CS01) Filing', country: 'United Kingdom', kw: 'file confirmation statement cs01 companies house' },
      { name: 'Stripe UK Merchant Gateway Compliance', country: 'United Kingdom', kw: 'uk ltd stripe account requirements non resident' },
      { name: 'Wise Business International Banking Setup', country: 'United Kingdom', kw: 'wise business uk ltd non resident verification' },
      { name: 'UK VAT Registration Threshold & Flat Rate', country: 'United Kingdom', kw: 'uk vat threshold software agency exports' },
      { name: 'Delaware vs Wyoming LLC for Remote SaaS', country: 'United States', kw: 'delaware vs wyoming llc software startup' },
      { name: 'US Registered Agent Statutory Duties', country: 'United States', kw: 'us registered agent requirements llc' },
      { name: 'IRS EIN Form SS-4 for Foreign Founders', country: 'United States', kw: 'obtain ein without ssn foreign founder ss4' },
      { name: 'US Corporate Bank Account Setup (Mercury/Relay)', country: 'United States', kw: 'mercury bank account us llc foreign resident' },
      { name: 'FinCEN Beneficial Ownership Information (BOI)', country: 'United States', kw: 'fincen boi reporting foreign llc requirements' },
      { name: 'US Single-Member LLC Disregarded Entity Tax (Form 5472)', country: 'United States', kw: 'form 5472 pro forma 1120 foreign single member llc' },
      { name: 'Withholding Tax & W-8BEN-E for Software Agencies', country: 'United States', kw: 'w8bene software agency international clients' },
    ];

    const legalModifiers = [
      'Complete Compliance Protocol',
      'Step-by-Step Official Filing Guide',
      'Common Mistakes That Trigger Rejections',
      'Statutory Deadlines & Penalty Avoidance',
      'Banking Prerequisites & Documentation Checklist',
      'for International Software Agencies',
      'for Remote Digital Nomads',
    ];

    for (let i = 0; i < 100; i++) {
      const top = legalTopics[i % legalTopics.length];
      const mod = legalModifiers[Math.floor(i / legalTopics.length) % legalModifiers.length];
      const pillar = legalPillars[i % legalPillars.length];

      addBrief({
        category: 'UK and US Business Guides',
        title: `${top.name}: ${mod}`,
        slug: `${top.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${mod.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        primaryKeyword: `${top.kw} ${mod.toLowerCase().replace(/[^a-z0-9\s]/g, '')}`.trim(),
        supportingKeywords: [top.kw, `${top.country.toLowerCase()} business compliance`, 'company formation'],
        searchIntent: 'Informational',
        targetAudience: ['International Tech Founders', 'Remote Agency Owners', 'Cross-Border Creators'],
        geography: top.country,
        topicCluster: `${top.country} Corporate Structuring — ${top.name}`,
        parentPillar: pillar,
        readerProblem: `International founders require precise, source-grounded legal compliance guidance without confusing UK and US statutory regimes.`,
        uniqueAngle: 'Direct citations of Companies House, HMRC, and IRS regulations with transparent disclaimers.',
        outline: [
          `Statutory Framework: Governing Legislation in the ${top.country}`,
          'Eligibility Requirements for Foreign Resident Directors',
          'Document Preparation & Proof of Address Verification',
          'Step-by-Step Official Filing Instructions',
          'Post-Incorporation Compliance Calendar & Tax Deadlines',
          'Professional Verification vs Self-Filing Comparison',
        ],
        researchQuestions: [
          `What are the current Companies House filing fees and identity verification turnaround times?`,
          'What documents must foreign directors present to pass banking AML/KYC checks?',
        ],
        sources: [
          { title: `${top.country === 'United Kingdom' ? 'UK Government Companies House' : 'US Internal Revenue Service (IRS)'} Official Portal`, url: top.country === 'United Kingdom' ? 'https://www.gov.uk/companies-house' : 'https://www.irs.gov', rationale: 'Official statutory authority.' },
        ],
        examples: ['Remote software agency founded by non-resident engineers', 'B2B SaaS expanding into US/UK markets'],
        freeTools: ['cloudflare-pages', 'sqlite'],
        githubRepos: [],
        articleDepth: 'Standard Guide (1,500-2,500 words)',
        wordCount: '1,800-2,500 words',
        freshness: 'Regulated',
        priority: 'P1 - High',
      });
    }

    // =========================================================================
    // 7. INDUSTRY-SPECIFIC BUSINESS GROWTH (Target: 80)
    // =========================================================================
    const industryPillars = [
      'The Vertical Growth Playbook: Digital Systems for Local & Trade Enterprises',
      'Modern High-Conversion Websites & Automated Pipelines for Showrooms & Clinics',
    ];

    const industries = [
      { name: 'Car Dealerships & Showrooms', focus: 'Local SEO, Test Drive Lead Capture & CRM', kw: 'car dealership lead generation local seo' },
      { name: 'Dental & Healthcare Clinics', focus: 'Patient Scheduling, Google Reviews & HIPAA Forms', kw: 'dental clinic patient acquisition automation' },
      { name: 'Bespoke Kitchen & Home Remodeling', focus: 'High-Ticket Design Consultations & Lead Tracking', kw: 'kitchen remodeling lead generation crm' },
      { name: 'Independent Restaurants & Hospitality', focus: 'Direct Table Bookings & Zero-Commission Orders', kw: 'restaurant direct online booking local seo' },
      { name: 'Commercial Construction & Contractors', focus: 'Subcontractor Bidding & Project Milestones', kw: 'contractor commercial construction lead pipeline' },
      { name: 'Freight, Logistics & Courier Operators', focus: 'Fleet Dispatch Tracking & Instant Quote Systems', kw: 'courier logistics dispatch automation' },
      { name: 'Aesthetic Salons & Medspas', focus: 'Recurring Membership Billing & Deposit Bookings', kw: 'medspa appointment booking automated crm' },
      { name: 'B2B Accounting & Audit Firms', focus: 'Client Portal Document Intake & Onboarding', kw: 'accounting firm client portal automation' },
    ];

    const industryAngles = [
      'The Complete Operational Overhaul Blueprint',
      'Speed-to-Lead: Capturing Inquiries in Under 60 Seconds',
      'Dominating Google Maps & Local 3-Pack Rankings',
      'Replacing Manual Paperwork with an Integrated Business OS',
      'Automated Review Generation & Reputation Protection',
      'High-Conversion Website Architecture & Mobile Inventory Showcase',
      'Preventing Lost Revenue from Missed Phone Calls & Weekend Inquiries',
      'Finance & Payment Plan Follow-Up Automation',
      'KPI Dashboards: Tracking Acquisition Cost vs Lifetime Value',
      'The 90-Day Digital Transformation Roadmap',
    ];

    for (let i = 0; i < 80; i++) {
      const ind = industries[i % industries.length];
      const ang = industryAngles[Math.floor(i / industries.length) % industryAngles.length];
      const pillar = industryPillars[i % industryPillars.length];

      addBrief({
        category: 'Industry-Specific Business Growth',
        title: `${ind.name}: ${ang}`,
        slug: `${ind.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${ang.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        primaryKeyword: `${ind.kw} ${ang.toLowerCase().replace(/[^a-z0-9\s]/g, '')}`.trim(),
        supportingKeywords: [ind.kw, `${ind.name.toLowerCase()} growth strategies`, 'vertical crm systems'],
        searchIntent: 'Business Planning',
        targetAudience: [`${ind.name} Owners`, 'Showroom Directors', 'Practice Managers'],
        geography: 'Global',
        topicCluster: `Vertical Industry Playbooks — ${ind.name}`,
        parentPillar: pillar,
        readerProblem: `${ind.name} operators lose up to 60% of viable leads due to slow manual response times and disjointed legacy software.`,
        uniqueAngle: 'Industry-specific workflows, verified operational benchmarks, real intake forms, and automated CRM pipelines.',
        outline: [
          `The Unique Operational Bottlenecks of ${ind.name}`,
          'Local Search Optimization & Mobile Customer Discovery',
          'Deploying Instant 60-Second Multi-Channel Inbound Response',
          'Pipeline State Machine: Inbound &rarr; Consultation &rarr; Closed Deal',
          'Automated Post-Service Review Collection & Reputation Management',
          'Actionable Implementation Checklist for Staff',
        ],
        researchQuestions: [
          `What is the average response time to digital inquiries in the ${ind.name} sector?`,
          'How does automated text follow-up impact booked appointments vs manual phone calls?',
        ],
        sources: [
          { title: 'Industry Consumer Journey Study', url: 'https://thinkwithgoogle.com', rationale: 'Local search customer behavior data.' },
        ],
        examples: [`Independent ${ind.name.toLowerCase()} with 2 locations`, 'High-ticket service practice'],
        freeTools: ['sqlite', 'postgresql', 'cloudflare-pages'],
        githubRepos: ['digi-ai/digi-whatsapp-agent'],
        articleDepth: 'Standard Guide (1,500-2,500 words)',
        wordCount: '2,000-2,600 words',
        freshness: 'Evergreen',
        priority: 'P1 - High',
      });
    }

    // =========================================================================
    // 8. DEVELOPER TUTORIALS AND TECHNICAL RESOURCES (Target: 50)
    // =========================================================================
    const devPillars = [
      'The Modern Edge & WebGL Architecture Masterclass',
      'Building Resilient Full-Stack Applications with Astro, React & Cloudflare',
    ];

    const devTopics = [
      { name: 'Three.js Cinematic 3D Orbit Canvas', tech: 'Three.js', kw: 'threejs orbital 3d scene astro react' },
      { name: 'WebGL Shader Optimization & Performance', tech: 'WebGL', kw: 'webgl shader 60fps performance optimization' },
      { name: 'Astro Content Collections & MDX Pipelines', tech: 'Astro', kw: 'astro content collections v5 mdx schema' },
      { name: 'Cloudflare Workers Edge Rate-Limiting Proxy', tech: 'Cloudflare', kw: 'cloudflare workers rate limiting api proxy' },
      { name: 'Building Full-Text Search with Pagefind & Astro', tech: 'Pagefind', kw: 'pagefind static search integration astro' },
      { name: 'React Three Fiber Camera Transitions & Controls', tech: 'R3F', kw: 'react three fiber smooth camera orbit controls' },
      { name: 'Tailwind CSS Glassmorphism & Orbital Themes', tech: 'Tailwind', kw: 'tailwind css glassmorphic orbital theme design' },
      { name: 'TypeScript Strict Zod Runtime Schema Validation', tech: 'TypeScript', kw: 'typescript zod schema validation best practices' },
      { name: 'PostgreSQL Connection Pooling on Edge Infrastructure', tech: 'PostgreSQL', kw: 'postgres edge connection pooling hyperdrive' },
      { name: 'Docker Compose Local Development Stacks', tech: 'Docker', kw: 'docker compose local developer stack template' },
    ];

    const devModifiers = [
      'Complete Engineering Tutorial',
      'Production Code & Benchmarking',
      'Architectural Deep Dive',
      'Handling Edge Cases & Memory Leaks',
      'Official Documentation & API Navigation',
    ];

    for (let i = 0; i < 50; i++) {
      const dev = devTopics[i % devTopics.length];
      const mod = devModifiers[Math.floor(i / devTopics.length) % devModifiers.length];
      const pillar = devPillars[i % devPillars.length];

      let devIntent: SearchIntent = 'Tutorial';
      if (mod === 'Official Documentation & API Navigation') {
        devIntent = 'Navigational';
      } else if (mod === 'Handling Edge Cases & Memory Leaks') {
        devIntent = 'Troubleshooting';
      } else if (mod === 'Architectural Deep Dive') {
        devIntent = 'Informational';
      } else if (mod === 'Production Code & Benchmarking') {
        devIntent = 'Comparative';
      }

      addBrief({
        category: 'Developer Tutorials and Technical Resources',
        title: `${dev.name}: ${mod}`,
        slug: `${dev.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${mod.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        primaryKeyword: `${dev.kw} ${mod.toLowerCase().replace(/[^a-z0-9\s]/g, '')}`.trim(),
        supportingKeywords: [dev.kw, `${dev.tech.toLowerCase()} tutorials`, 'web engineering best practices'],
        searchIntent: devIntent,
        targetAudience: ['Senior Frontend Engineers', 'Full-Stack Developers', 'Creative Technologists'],
        geography: 'Global',
        topicCluster: `Web Engineering — ${dev.tech}`,
        parentPillar: pillar,
        readerProblem: `Developers encounter performance degradation, memory leaks, and hydration mismatches when building advanced modern interfaces.`,
        uniqueAngle: 'Fully typed TypeScript code blocks, WebGL memory cleanup procedures, and edge-native deployment benchmarks.',
        outline: [
          'Architectural Problem Statement & Technical Goals',
          'Component Hierarchy & Data Flow Diagram',
          'TypeScript Interfaces & State Management Implementation',
          'Optimizing Frame Rates: Frustum Culling & Memory Disposal',
          'Production Deployment onto Cloudflare Pages',
          'Full Working Source Code Repository Link',
        ],
        researchQuestions: [
          'How can WebGL contexts be safely garbage collected upon route unmount in Astro islands?',
          'What is the latency impact of executing edge database queries via Hyperdrive connection pooling?',
        ],
        sources: [
          { title: `${dev.tech} Official Documentation`, url: 'https://developer.mozilla.org', rationale: 'Verified web standards specification.' },
          { title: 'Astro Engineering Documentation', url: 'https://docs.astro.build', rationale: 'Islands architecture best practices.' },
        ],
        examples: ['AI Satellite 3D Radar scene', 'Edge API gateway proxy'],
        freeTools: ['cloudflare-pages', 'sqlite', 'postgresql'],
        githubRepos: ['aisatellite/ai-satellite'],
        articleDepth: 'In-Depth Guide (2,500-4,000 words)',
        wordCount: '2,200-3,000 words',
        freshness: 'Evergreen',
        priority: 'P1 - High',
      });
    }

    this.cachedBriefs = briefs;
    return briefs;
  }

  /**
   * Retrieves summary statistics of the masterplan.
   */
  public getMasterplanStats() {
    const briefs = this.generateMasterplan();
    const categories: Record<string, number> = {};
    const stages: Record<string, number> = {};
    const priorities: Record<string, number> = {};
    const freshness: Record<string, number> = {};
    const commercialCount = briefs.filter((b) => b.relevantCommercialServiceCategory !== null).length;

    briefs.forEach((b) => {
      categories[b.topicCategory] = (categories[b.topicCategory] || 0) + 1;
      stages[b.publishingStage] = (stages[b.publishingStage] || 0) + 1;
      priorities[b.editorialPriority] = (priorities[b.editorialPriority] || 0) + 1;
      freshness[b.contentFreshnessRisk] = (freshness[b.contentFreshnessRisk] || 0) + 1;
    });

    return {
      totalArticles: briefs.length,
      categories,
      stages,
      priorities,
      freshness,
      commercialCTACount: commercialCount,
      freeToolCTACount: briefs.length - commercialCount,
      uniqueSlugs: new Set(briefs.map((b) => b.canonicalSlug)).size,
      uniqueTitles: new Set(briefs.map((b) => b.proposedTitle)).size,
    };
  }

  /**
   * Retrieves topic clusters.
   */
  public getTopicClusters(): TopicCluster[] {
    const briefs = this.generateMasterplan();
    const clusterMap = new Map<string, TopicCluster>();

    briefs.forEach((b) => {
      if (!clusterMap.has(b.topicCluster)) {
        clusterMap.set(b.topicCluster, {
          id: b.topicCluster.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          name: b.topicCluster,
          category: b.topicCategory,
          pillarTitle: b.parentPillar,
          pillarSlug: b.parentPillar.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          supportingArticlesCount: 0,
          coreKeywords: [],
          description: `Topical authority cluster focusing on ${b.topicCluster} within ${b.topicCategory}.`,
        });
      }
      const cluster = clusterMap.get(b.topicCluster)!;
      cluster.supportingArticlesCount++;
      if (cluster.coreKeywords.length < 5 && !cluster.coreKeywords.includes(b.primaryKeyword)) {
        cluster.coreKeywords.push(b.primaryKeyword);
      }
    });

    return Array.from(clusterMap.values());
  }
}

export const masterplanEngine = MasterplanEngine.getInstance();
