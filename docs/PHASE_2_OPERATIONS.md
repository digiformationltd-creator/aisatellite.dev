# AI Satellite — Phase 2 Operational Runbook
> **Autonomous Intelligence, Open-Source Discovery & Publishing Engine**  
> *Target Domain:* [`https://aisatellite.pages.dev`](https://aisatellite.pages.dev)  
> *Status:* Production Operational

---

## 1. System Overview & Architecture

Phase 2 transforms AI Satellite into a source-verified, continuously expanding open-source discovery and technical publishing ecosystem across 7 cooperating subsystems:

```text
PUBLIC SOURCES (GitHub API, Curated Lists, Official Docs)
     |
     v
[System A] Global Source Discovery (automation/discovery/)
     |
     v
[System B] Normalization & Deduplication (automation/normalization/)
     |
     v
[System C] 7-Stage Verification & Scoring (automation/verification/ & scoring/)
     |
     v
[System D] Autonomous Editorial Topic Planner (automation/intelligence/topic-planner.ts)
     |
     v
[System E] AI Content Production & Evidence Grounding (automation/drafting/)
     |
     v
[System F] Technical QA & Editorial Review Staging (automation/validation/ & editorial/)
     |
     v
HUMAN EDITORIAL APPROVAL (PR Sign-off — No Bot Self-Approval)
     |
     v
[System G] Publishing & Static Build (automation/publishing/ -> Astro -> Cloudflare Pages)
```

---

## 2. Daily Operations Schedule

All GitHub Actions schedules run on UTC. Scheduled for Pakistan Standard Time (PKT = UTC+5):

| Time (PKT) | Time (UTC) | Workflow | Command | Action |
| :--- | :--- | :--- | :--- | :--- |
| **06:00 PKT** | `01:00 UTC` | `.github/workflows/discover.yml` | `npm run discover` | Scans GitHub API & curated lists; saves deduplicated candidates to `data/candidates/` |
| **07:00 PKT** | `02:00 UTC` | `.github/workflows/verify.yml` | `npm run verify` | Runs 7-stage verification (SPDX license, pricing, links, maintenance); saves to `data/verified/` |
| **08:00 PKT** | `03:00 UTC` | `.github/workflows/draft-daily.yml` | `npm run plan:content` | Discovers content gaps and plans prioritized topics in `data/topics/` |
| **09:00 PKT** | `04:00 UTC` | `.github/workflows/draft-daily.yml` | `npm run draft` | Collects grounded evidence ledger and generates structured draft in `data/drafts/` |
| **10:00 PKT** | `05:00 UTC` | `.github/workflows/draft-daily.yml` | `npm run validate:draft` | Validates MDX structure, safety, and disclosures; opens PR for human review |
| **Weekly** | `Sun 19:00 UTC` | `.github/workflows/content-monitor.yml`| `npm run monitor` | Audits link health and flags stale records (>90 days) in `data/reports/` |

---

## 3. Manual CLI Commands

Developers and maintainers can trigger every step locally:

```bash
# 1. Discover new candidate tools
npm run discover

# 2. Run 7-stage verification on candidates
npm run verify

# 3. Plan editorial topics based on verified resources
npm run plan:content

# 4. Generate grounded draft for highest priority topic
npm run draft

# 5. Validate draft structure, code blocks, and commercial disclosures
npm run validate:draft

# 6. Publish approved drafts into Astro content collections
npm run publish:approved

# 7. Audit link health and content freshness
npm run monitor

# 8. Run automated Vitest test suite
npm run test

# 9. Verify production build & Pagefind search indexing
npm run build
```

---

## 4. Human Editorial Review Protocol

**Mandatory Rule:** Autonomous agents are strictly prohibited from approving their own drafts.

1. When a draft passes automated validation, it is assigned the status `ready_for_review`.
2. A human editor reviews the PR or draft file in `data/drafts/<draftId>.json`.
3. The editor checks:
   - Factual grounding in the evidence ledger
   - Code snippet execution safety
   - Commercial disclosure presence for affiliated partners ([DigiFormation](https://www.digiformation.co.uk/) / [Digi Biz OS](https://digibizos.co.uk/))
4. The editor approves the draft using the approval engine:
   ```typescript
   import { EditorialApprovalEngine } from './automation/editorial/approval.js';
   const engine = new EditorialApprovalEngine();
   engine.approveDraft('draft-id', 'Editor-Name', 'Verified against official docs');
   ```
5. Running `npm run publish:approved` compiles the draft into `src/content/blog/<slug>.md`.

---

## 5. Environment Variables & Secrets

Configure the following secrets in GitHub repository settings:

| Variable | Required | Purpose | Fallback Behavior if Missing |
| :--- | :--- | :--- | :--- |
| `GITHUB_TOKEN` | Optional | GitHub API authentication | Public rate-limited mode (60 requests/hour) |
| `OPENAI_API_KEY` | Optional | LLM generation for article text | Falls back to Deterministic Offline Provider (Zero crash, 100% schema-valid) |
| `AI_MODEL` | Optional | Model identifier (e.g. `gpt-4o-mini`) | Defaults to `gpt-4o-mini` or local deterministic generator |

---

## 6. Safety, Cost & Anti-Hallucination Controls

1. **Anti-Hallucination Evidence Ledger:** Every draft requires grounded claims tied to verifiable documentation URLs. Missing evidence blocks the draft from entering review.
2. **Deterministic Offline Fallback:** If API credits expire or keys are unset, drafting produces clean, reproducible architectural guides rather than failing or hallucinating.
3. **No Arbitrary Code Execution:** Discovered repositories are statically analyzed via metadata and README parsing; unverified code is never executed.
4. **Prompt Injection Defense:** External repository text is stripped of control characters, HTML comments, and prompt overrides.
5. **Zero Secret Leaks:** Automated test assertions verify no API tokens, SSH keys, or private variables are output to public Markdown or JSON files.
