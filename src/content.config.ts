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
    published: z.boolean().default(true),
  }),
});

// 6. 3D Web Lab Schema
const labCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/lab' }),
  schema: z.object({
    title: z.string(),
    category: z.string(),
    description: z.string(),
    tech: z.array(z.string()),
    demoType: z.enum(['interactive', 'code-preview', 'prototype']),
    status: z.string(),
    codeSnippet: z.string(),
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
