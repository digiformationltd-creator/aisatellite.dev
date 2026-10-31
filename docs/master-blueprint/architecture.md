# AI SATELLITE — VERIFIED MASTER ARCHITECTURE
## 24 CONNECTED SUBSYSTEMS & ORBITAL GLASS TOPOLOGY

**Permanent Canonical Domain:** `https://aisatellite.dev`  
**Architecture Style:** Static-First Hybrid Jamstack with Edge Islands and D1 Microservices

---

### ARCHITECTURAL SYSTEM TOPOLOGY

```text
                               +-------------------------------------------------------+
                               |              CLOUDFLARE EDGE NETWORK                  |
                               |         https://aisatellite.dev (SSL / TLS)           |
                               +---------------------------+---------------------------+
                                                           |
                                  +------------------------+------------------------+
                                  |                                                 |
                                  v                                                 v
                      [STATIC PRE-RENDERED PAGES]                       [EDGE API & AUTH WORKERS]
                      - 194 Static HTML Documents                       - Session Cookie Verification
                      - Pagefind 1.5.2 Client WASM                      - IDOR Authorization Guard
                      - Orbital Glass CSS Design                        - Private Workspace API
                                  |                                                 |
                                  +------------------------+------------------------+
                                                           |
                                                           v
                               +-------------------------------------------------------+
                               |          CENTRAL ORCHESTRATION BUS (PHASE 19)         |
                               |  - Central Resource Identity System (CRIS)            |
                               |  - Unified Knowledge Graph (Semantic Edges)           |
                               |  - Platform Event Bus (Idempotent Pub/Sub)            |
                               |  - Multi-Agent Orchestrator ($1.00 Budget Cap)        |
                               |  - Unified Automation Scheduler (Job Locks)           |
                               +---------------------------+---------------------------+
                                                           |
                                  +------------------------+------------------------+
                                  |                                                 |
                                  v                                                 v
                     [CLOUDFLARE D1 (SQLITE)]                           [LOCAL / R2 PERSISTENCE]
                     - central_resources                               - Data store JSON files
                     - knowledge_graph_edges                           - Backup snapshots
                     - platform_events                                 - Static asset cache
                     - agent_executions                                - Log records
```

---

### THE 24 VERIFIED PLATFORM SYSTEMS

1. **Public Website (`src/pages/index.astro`, `about.astro`, `terms.astro`, `privacy.astro`):**
   Astro static pre-rendered pages with orbital glass styling, WCAG 2.2 AA contrast, and zero external tracking scripts.
2. **Technology Directory (`src/pages/tools/`):**
   Curated software profiles categorized by capabilities, stacks, and licensing models.
3. **Free Alternatives Engine (`src/pages/alternatives/`, `compare/`):**
   Bidirectional mapping of commercial tools to verified open-source and free self-hosted solutions.
4. **Open-Source Discovery (`src/pages/open-source/`):**
   Release monitoring, star tracking, commit velocity, and maintainer health metrics.
5. **AI Tools Intelligence (`src/pages/ai-agents.astro`):**
   Autonomous agents, model orchestration frameworks, and vector database discovery.
6. **Prompt Galaxy (`src/pages/prompts/`):**
   60+ system and developer prompts with parameter replacement and copy-to-clipboard actions.
7. **Developer Knowledge Universe (`src/pages/mcp-servers.astro`):**
   Model Context Protocol (MCP) server directories and implementation patterns.
8. **CSS Component Lab (`src/pages/3d-lab/`):**
   Tailwind CSS and glassmorphism UI components with live source previews.
9. **Three.js & WebGL Lab (`src/components/3d/`):**
   Interactive orbital Earth scenes with hardware adaptation and reduced-motion fallback.
10. **AI Agents & MCP Resources (`src/lib/knowledge/`):**
    Verified tooling for agent swarms and context server integrations.
11. **Free API Directory (`src/pages/free-apis.astro`):**
    No-auth and developer-friendly APIs categorized by utility and rate limits.
12. **Developer Troubleshooting (`src/pages/troubleshooting/`):**
    Proven solutions for obscure build errors, hydration mismatches, and WebGL context loss.
13. **Universal Search (`/search`, Pagefind 1.5.2):**
    Static WebAssembly client-side search across all public content with sub-10ms latency.
14. **My Orbit Personal Workspace (`src/pages/workspace.astro`):**
    Private snippet vault, prompt library, and project tracker with complete data isolation.
15. **Developer Community (`src/pages/community/`):**
    Discussion forums, structured Q&A, and public developer profiles with honeypot bot defense.
16. **Global Technology Radar (`src/pages/radar.astro`):**
    Quarterly radar blips mapping tools across Adopt, Trial, Assess, and Hold rings.
17. **Evidence Verification Ledger (`src/lib/discovery/evidence-ledger.ts`):**
    Cryptographically tracked evidence records linking source releases to claims.
18. **Editorial Review System (`src/lib/discovery/editorial-pipeline.ts`):**
    Review pipeline ensuring human sign-off before community submissions go live.
19. **Autonomous Research Operations (`src/lib/discovery/research-agents.ts`):**
    Scheduled background agents monitoring release channels within cost bounds.
20. **SEO/AEO/GEO Intelligence (`src/lib/growth/`):**
    Structured Schema.org tags, direct answer formatting, and entity disambiguation.
21. **Bing & Google Search Integrations (`src/lib/growth/search-performance-service.ts`):**
    XML sitemaps, robots.txt compliance, and IndexNow protocol payload dispatcher.
22. **Growth Analytics (`src/lib/growth/conversion-retention-analytics.ts`):**
    Privacy-first analytics tracking discrete interactions without cookies or PII.
23. **Security & Reliability (`src/lib/reliability/`):**
    IDOR shields, SSRF filters, 8 SLI monitors, and 9 disaster recovery runbooks.
24. **Unified Admin Command Center (`src/pages/admin/index.astro`):**
    Consolidated 24-module orbital glass command station restricted to administrators.
