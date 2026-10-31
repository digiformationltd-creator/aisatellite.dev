# AI SATELLITE — ADMINISTRATOR HANDBOOK
## UNIFIED COMMAND CENTER OPERATIONAL MANUAL & EDITORIAL GOVERNANCE

**Permanent Canonical Domain:** `https://aisatellite.dev`  
**Administrative Route:** `https://aisatellite.dev/admin` (Protected, Noindex)  
**Required Role:** `administrator` or `system_operator`

---

### 1. ACCESS & ROLE-BASED AUTHORIZATION

The Unified Command Center at `/admin` is protected by `src/lib/ecosystem/auth-guard.ts`:
- Unauthenticated requests are rejected.
- Registered users lacking `manage:system` receive HTTP 403 Forbidden.
- Session tokens require `__Secure-aisatellite-session` with cryptographic signature.

---

### 2. OPERATIONAL MODULES IN THE COMMAND STATION

1. **Global Overview:**
   Displays live system health telemetry, public availability, total registered CRIS entities, active background jobs, and agent execution tallies.
2. **Resource Registry (CRIS):**
   Search, inspect, and register software products. Provides instant "Approve & Publish" buttons for draft submissions.
3. **Knowledge Graph Explorer:**
   Visualizes verified `alternative_to` relationships (e.g. SigNoz $\to$ Datadog, Podman $\to$ Docker, Bruno $\to$ Postman).
4. **Editorial Pipeline:**
   Reviews submitted tools from the community, checks SPDX license compliance, and verifies self-hosting freedom.
5. **Autonomous Agent Swarm:**
   Manually triggers specialized agents (Discovery, Verification, Alternatives Analyst) and tracks micro-cost spend.
6. **Automation Scheduler:**
   Monitors background cron intervals, displays last run timestamps, and offers single-click "Run Now" execution with job lock protection.
7. **Unified Analytics:**
   Inspects aggregate event counts (views, comparisons, saves, searches) with zero PII exposure.
8. **Security & Reliability:**
   Audits active protection barriers, SSRF blocking, CSP headers, and disaster recovery playbooks.
