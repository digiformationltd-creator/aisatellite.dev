# AI SATELLITE — AUTONOMOUS AI AGENT GOVERNANCE & SAFETY
## MULTI-AGENT SWARM CONTROLS, COST CEILINGS & EDITORIAL GATES

**Permanent Canonical Domain:** `https://aisatellite.dev`  
**Governance Standard:** Human-in-the-Loop Operational Safety

---

### 1. SPECIALIZED AGENT SWARM INVENTORY

Autonomous operations are divided across 10 specialized agents coordinated by `src/lib/ecosystem/agent-orchestrator.ts`:
1. **DiscoveryAgent:** Scans trusted RSS feeds and GitHub release channels for new open-source software.
2. **GitHubResearchAgent:** Audits commit frequencies, maintainer activity, open issues, and stars.
3. **VerificationAgent:** Inspects licensing terms and verifies self-hosting freedom vs. disguised trials.
4. **AlternativesAnalyst:** Measures capability parity between commercial SaaS and open alternatives.
5. **ContentResearchAgent:** Drafts technical tutorials, code examples, and troubleshooting guides.
6. **TechnicalSEOAgent:** Validates canonical URLs, meta descriptions, and Schema.org markup.
7. **AEOGEOAgent:** Structures direct answers and knowledge graph entity citations.
8. **QAAgent:** Runs automated acceptance suites and verifies link health.
9. **SecurityReviewAgent:** Scans packages for known CVEs and validates input sanitization.
10. **OperationsAgent:** Monitors platform uptime, SLI thresholds, and backup snapshot integrity.

---

### 2. SAFETY & BUDGET CONTROLS

- **Strict Cost Ceiling:** Enforces a hard $1.00 daily budget cap. If accumulated micro-costs exceed $1.00, agent execution is immediately suspended with `COST_BUDGET_EXCEEDED`.
- **Human-in-the-Loop Editorial Gate:**
  No agent can independently publish to live public routes or execute destructive database operations. Any task containing keywords (`publish`, `deploy`, `delete`, `overwrite`) receives status `'requires_human_approval'`.
- **Bounded Execution:** Every agent task runs with a strict 30-second timeout and a maximum of 3 automated retries with exponential backoff.
