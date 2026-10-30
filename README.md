# AI Satellite 🛰️
> **The Global Open-Source & Autonomous AI Knowledge Station**  
> *Target Domain:* [`https://aisatellite.pages.dev`](https://aisatellite.pages.dev)

---

## 🌟 Overview

**AI Satellite** is an open-source developer knowledge station and research platform. It curates verified free developer tools, production-tested AI agent workflows, Three.js 3D web labs, battle-tested LLM prompts, and engineering playbooks for global founders.

Unlike traditional affiliate-choked blogs, AI Satellite adheres to uncompromising engineering standards:
- **Zero Paywalls:** All content, tools, prompts, and code samples are open access.
- **Zero Fabricated Claims:** Every software entry has verifiable license details, source URLs, and tested limitations.
- **Transparent Partner Disclosures:** Contextual founder services (such as [DigiFormation](https://www.digiformation.co.uk/) for UK LTD incorporation and banking, and [Digi Biz OS](https://digibizos.co.uk/) for agency operations) are clearly marked with ethical disclaimers.

---

## 🚀 Architecture & Tech Stack

| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Framework** | [Astro 5](https://astro.build/) | Static output, zero client JS overhead by default, ultra-fast TTFB |
| **Interactive Islands** | [React 19](https://react.dev/) | Isolated client hydration for mega-menus, search dialogs, and 3D viewers |
| **Styling** | [Tailwind CSS 3.4](https://tailwindcss.com/) | Bespoke "Cosmic Intelligence" theme tokens, glassmorphism, responsive UI |
| **Content Engine** | Astro Content Collections + [Zod](https://zod.dev/) | Strict build-time schema validation for tools, articles, workflows, and prompts |
| **Full-Text Search** | [Pagefind](https://pagefind.app/) | Static, offline-capable indexing with keyboard navigation (`Cmd+K` / `Ctrl+K`) |
| **3D Graphics** | [Three.js 0.174](https://threejs.org/) | Particle canvas hero and shader lab with automatic WebGL fallback and context disposal |
| **Quality Gate** | [Vitest](https://vitest.dev/) | Unit test suite verifying schema invariants and editorial policies |
| **Deployment** | [Cloudflare Pages](https://pages.cloudflare.com/) | Global edge delivery, immutable static asset hashing, zero cold-starts |

---

## 📁 Repository Structure

```text
AI STERLITE/
├── .github/workflows/ci.yml       # Automated GitHub Actions test & build workflow
├── public/
│   ├── _headers                  # Cloudflare security headers & CSP policies
│   ├── favicon.svg               # Vector orbital satellite mark
│   └── robots.txt                # Search bot crawler rules & sitemap pointer
├── src/
│   ├── components/
│   │   ├── cards/                # Responsive data cards (Tool, Workflow, Project, Article, Prompt)
│   │   ├── hero/                 # CosmicCanvas (Three.js), CosmicHero, KnowledgeStats
│   │   ├── icons/                # Dedicated SVG icons (GithubIcon, etc.)
│   │   ├── lab/                  # DemoViewer interactive 3D runner
│   │   ├── layout/               # SiteHeader, SiteFooter, Breadcrumbs, PageContainer, SectionHeading
│   │   ├── navigation/           # DesktopMegaMenu, MobileNavigation
│   │   ├── partners/             # PartnerRecommendation, PartnerDisclosure
│   │   ├── search/               # SearchDialog (command palette)
│   │   └── ui/                   # Badge, Button, Card, CopyButton
│   ├── content/
│   │   ├── alternatives/         # Open-source alternative comparison records
│   │   ├── blog/                 # Long-form editorial guides & playbooks
│   │   ├── lab/                  # Three.js 3D web experiments
│   │   ├── projects/             # Original developer software showcases
│   │   ├── prompts/              # Production system prompts
│   │   ├── tools/                # Verified developer tools (DBs, Hosting, APIs)
│   │   └── workflows/            # Multi-agent & autonomous pipeline blueprints
│   ├── layouts/
│   │   └── BaseLayout.astro      # Master layout with SEO, OpenGraph, JSON-LD, skip-links
│   ├── pages/                    # 34+ statically generated routes & dynamic category endpoints
│   ├── styles/
│   │   └── global.css            # Cosmic theme variables, custom scrollbars, typography
│   └── content.config.ts         # Astro v5 Content Layer definitions with Zod validation
├── tests/
│   └── unit/schemas.test.ts      # Automated unit tests
├── astro.config.mjs              # Astro configuration (React, Tailwind, MDX, Sitemap)
├── tailwind.config.mjs           # Cosmic color tokens & animation keyframes
├── tsconfig.json                 # TypeScript strict mode configuration
└── wrangler.jsonc                # Cloudflare Pages deployment configuration
```

---

## 💻 Local Development

### Prerequisites
- Node.js 20+ installed
- npm or pnpm

### Quick Start
```bash
# 1. Clone the repository
git clone https://github.com/your-username/ai-satellite.git
cd ai-satellite

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Open in browser
# http://localhost:4321
```

### Build & Test
```bash
# Type check and Astro template diagnostics
npm run check

# Run unit tests
npm run test

# Build production bundle with Pagefind search index
npm run build

# Preview production build locally
npm run preview
```

---

## 🛡️ Editorial & Partner Integrity

AI Satellite maintains absolute transparency:
1. **No Paid Inclusions:** Tool listings cannot be bought. Tools are ranked based on developer utility, open-source license status, and self-hostability.
2. **Contextual Partner Disclosures:** When articles reference UK LTD incorporation or agency CRM operations, [DigiFormation](https://www.digiformation.co.uk/) and [Digi Biz OS](https://digibizos.co.uk/) are noted with clear editorial badges informing the reader of the commercial relationship.

---

## 🤝 Contributing

We welcome community contributions! Please review [CONTRIBUTING.md](./CONTRIBUTING.md) for step-by-step instructions on submitting tools, prompts, or guides via GitHub pull requests.

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE). Open-source tool data is aggregated from public community databases including `ripienaar/free-for-dev`.
