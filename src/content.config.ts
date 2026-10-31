import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 1. Developer Tool Schema
const toolsCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/tools' }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    category: z.string(),
    tags: z.array(z.string()),
    officialUrl: z.string().url(),
    repositoryUrl: z.string().url().optional(),
    documentationUrl: z.string().url().optional(),
    license: z.string().optional(),
    pricingModel: z.enum(['open-source', 'free-forever', 'freemium', 'free-trial', 'paid']),
    selfHosted: z.boolean(),
    requiresCreditCard: z.boolean().default(false),
    freeTierLimitations: z.array(z.string()).default([]),
    alternativesTo: z.array(z.string()).default([]),
    githubStars: z.number().optional(),
    verificationStatus: z.enum(['verified', 'pending', 'outdated']),
    lastVerified: z.string(),
    featured: z.boolean().default(false),
    published: z.boolean().default(true),
    securityNotes: z.array(z.string()).default([]),
    installationInstructions: z.string().optional(),
  }),
});

// 2. Proprietary Alternatives Schema
const alternativesCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/alternatives' }),
  schema: z.object({
    title: z.string(),
    proprietaryTool: z.string(),
    openSourceReplacements: z.array(z.string()),
    category: z.string(),
    summary: z.string(),
    migrationGuidance: z.string(),
    replaces: z.array(z.string()).default([]),
    classification: z.array(
      z.enum(['open_source', 'free_forever', 'freemium', 'free_trial', 'self_hosted', 'paid'])
    ).default(['open_source', 'self_hosted']),
    capabilities: z.array(z.string()).default([]),
    limitations: z.array(z.string()).default([]),
    deploymentOptions: z.array(z.string()).default(['Docker', 'Linux Binary']),
    operatingSystems: z.array(z.string()).default(['Linux', 'macOS', 'Windows']),
    selfHosted: z.boolean().default(true),
    freeHostedTier: z.boolean().default(false),
    paidInfrastructureRequired: z.boolean().default(false),
    verificationStatus: z.enum(['verified', 'pending', 'outdated']).default('verified'),
    evidenceUrls: z.array(z.string()).default([]),
    lastVerified: z.string().default('2026-10-31'),
    partnerContext: z.enum(['digiformation', 'digibizos', 'both', 'none']).default('none'),
    published: z.boolean().default(true),
  }),
});

// 3. Prompt Vault Schema
const promptsCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/prompts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    targetModel: z.string(),
    systemPrompt: z.string(),
    variables: z.array(z.string()).default([]),
    exampleUsage: z.string(),
    published: z.boolean().default(true),
    lastVerified: z.string(),
  }),
});

// 4. Autonomous AI Workflows Schema
const workflowsCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/workflows' }),
  schema: z.object({
    title: z.string(),
    objective: z.string(),
    difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
    requiredTools: z.array(z.string()),
    agentRoles: z.array(z.string()),
    inputs: z.array(z.string()),
    outputs: z.array(z.string()),
    securityWarnings: z.array(z.string()).default([]),
    configurationSnippet: z.string(),
    freeClassification: z.string(),
    published: z.boolean().default(true),
  }),
});

// 5. Original Open-Source Projects Schema
const projectsCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    family: z.string(),
    description: z.string(),
    techStack: z.array(z.string()),
    openSourceLicense: z.string(),
    repositoryUrl: z.string().url().optional(),
    documentationUrl: z.string().url().optional(),
    verificationStatus: z.enum(['verified', 'beta', 'in-development']),
    features: z.array(z.string()),
    version: z.string().default('1.0.0'),
    releaseDate: z.string().default('2026-10-31'),
    githubRepo: z.string().optional(),
    downloads: z.array(
      z.object({
        platform: z.string(),
        version: z.string(),
        filename: z.string(),
        url: z.string(),
        size: z.string().optional(),
        sha256: z.string().optional(),
      })
    ).default([]),
    docsOverview: z.string().default(''),
    changelogItems: z.array(
      z.object({
        version: z.string(),
        date: z.string(),
        changes: z.array(z.string()),
      })
    ).default([]),
    installationSteps: z.array(z.string()).default([]),
    published: z.boolean().default(true),
  }),
});

// 6. 3D Web Lab Schema
const labCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/lab' }),
  schema: z.object({
    title: z.string(),
    demoId: z.string().default('particles'),
    slug: z.string().optional(),
    category: z.string(),
    description: z.string(),
    tech: z.array(z.string()),
    demoType: z.enum(['interactive', 'code-preview', 'prototype']),
    status: z.string(),
    codeSnippet: z.string(),
    features: z.array(z.string()).default([]),
    controls: z.array(z.string()).default([]),
    promptTemplate: z.string().default(''),
    installation: z.string().default('npm install three'),
    dependencies: z.array(z.string()).default(['three']),
    performanceNotes: z.string().default('Optimized for 60fps with frustum culling and WebGL context disposal.'),
    reducedMotionNotes: z.string().default('Disables continuous particle motion when prefers-reduced-motion is active.'),
    license: z.string().default('MIT'),
    published: z.boolean().default(true),
  }),
});

// 7. Founder Playbooks & Editorial Blog Schema
const blogCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    tags: z.array(z.string()),
    author: z.string(),
    publishedAt: z.string(),
    updatedAt: z.string().optional(),
    readingTime: z.string(),
    sources: z.array(
      z.object({
        title: z.string(),
        url: z.string(),
      })
    ),
    relatedTools: z.array(z.string()).default([]),
    relatedArticles: z.array(z.string()).default([]),
    partnerContext: z.enum(['digiformation', 'digibizos', 'both', 'none']).default('none'),
    editoriallyReviewed: z.boolean().default(true),
    published: z.boolean().default(true),
  }),
});

export const collections = {
  tools: toolsCollection,
  alternatives: alternativesCollection,
  prompts: promptsCollection,
  workflows: workflowsCollection,
  projects: projectsCollection,
  lab: labCollection,
  blog: blogCollection,
};
