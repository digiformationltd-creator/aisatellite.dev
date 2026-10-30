# Contributing to AI Satellite

Thank you for your interest in contributing to **AI Satellite** — the global open-source developer knowledge station!

We are committed to maintaining a high standard of technical precision, zero fake claims, and transparent disclosures.

---

## Code of Conduct

All contributors and maintainers are expected to uphold a professional, welcoming, and harassment-free environment for everyone. Respectful collaboration and evidence-based discourse are mandatory.

---

## How Can You Contribute?

You can contribute in several ways:
1. **Submit a Developer Tool:** Add an open-source database, framework, hosting tier, or developer utility.
2. **Submit a System Prompt:** Share production-tested LLM prompts with defined variables and execution targets.
3. **Submit an Autonomous Workflow:** Contribute multi-agent pipelines, MCP configurations, or CI/CD blueprints.
4. **Submit a 3D Web Shader:** Add interactive Three.js, WebGL, or GLSL demos to the 3D Web Lab.
5. **Report an Outdated Listing:** If a free tier limit changes or a tool changes license, open an issue immediately.

---

## Adding Content Records

AI Satellite uses [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/) with strict [Zod](https://zod.dev/) schemas.

### 1. Developer Tool (`src/content/tools/<slug>.md`)
```markdown
---
name: "Tool Name"
description: "Precise technical summary (min 10 characters)."
category: "Databases" # Databases, Free Hosting, Auth, Storage, etc.
tags: ["database", "sql", "open-source"]
officialUrl: "https://example.com"
repositoryUrl: "https://github.com/example/repo"
documentationUrl: "https://docs.example.com"
license: "MIT"
pricingModel: "open-source" # open-source | free-forever | freemium | free-trial | paid
selfHosted: true
requiresCreditCard: false
freeTierLimitations:
  - "1 GB storage per database"
  - "Community support"
alternativesTo:
  - "Proprietary Competitor"
verificationStatus: "verified" # verified | pending | outdated
lastVerified: "2026-10-31"
featured: false
published: true
securityNotes:
  - "Supports TLS 1.3 and end-to-end encryption"
---

### Technical Overview
Write accurate technical documentation here...
```

### 2. Autonomous Workflow (`src/content/workflows/<slug>.md`)
```markdown
---
title: "Workflow Title"
description: "Architecture overview..."
category: "Code Review"
complexity: "intermediate" # beginner | intermediate | advanced
toolsUsed:
  - "Claude Code"
  - "GitHub Actions"
estimatedSetupMinutes: 15
published: true
---

### Architecture
Document step-by-step pipeline execution...
```

---

## Local Development & Pull Request Workflow

1. **Fork and Clone:**
   ```bash
   git clone https://github.com/your-username/ai-satellite.git
   cd ai-satellite
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Validate Code and Content:**
   Before opening a Pull Request, ensure that all quality gates pass:
   ```bash
   # Type check and Astro template diagnostics
   npm run check

   # Run automated schema validation tests
   npm run test

   # Verify production build and Pagefind indexing
   npm run build
   ```

4. **Submit Pull Request:**
   - Use clear commit messages following Conventional Commits format (`feat: add supabase tool entry`, `docs: update cloudflare free tier`).
   - Include links to official documentation for all verified claims.
