# AI SATELLITE — GLOBAL OPERATIONS HANDBOOK
## CLOUDFLARE EDGE ORCHESTRATION, SLI TELEMETRY & RUNBOOK PROCEDURES

**Permanent Canonical Domain:** `https://aisatellite.dev`  
**Target Availability:** 99.98% Edge Uptime  
**On-Call Protocol:** Automated Telemetry Alerts $\to$ SRE Intervention

---

### 1. PLATFORM TELEMETRY & SERVICE LEVEL INDICATORS (SLIS)

The SRE team monitors 8 core Service Level Indicators across edge nodes:
1. **Edge Public Availability:** Target $\ge 99.95\%$. Measured via Cloudflare edge probes.
2. **Static Route Response Time:** Target $< 150\text{ ms}$ global average.
3. **Client Search Query Latency:** Target $< 15\text{ ms}$ (Pagefind client WASM execution).
4. **Database Query Latency:** Target $< 25\text{ ms}$ (Cloudflare D1 distributed SQLite read).
5. **Session Verification Latency:** Target $< 10\text{ ms}$ in edge worker middleware.
6. **Background Job Failure Rate:** Target $< 1.0\%$.
7. **Agent Budget Utilization:** Daily spend capped at $\$1.00$.
8. **Security Incident Rate:** Zero unauthorized cross-account mutations permitted.

---

### 2. DEPLOYMENT PROCEDURES

- **Continuous Deployment Pipeline:** Controlled by `.github/workflows/deploy.yml`.
- **Pre-Deployment Gates:**
  1. `npm audit` (0 critical vulnerabilities)
  2. `npx astro check` (0 errors, 0 warnings)
  3. `npx vitest run` (100% pass rate across 49 test suites)
  4. `npx astro build` (194 static HTML pages)
  5. `npx pagefind --site dist` (Search index compiled)
- **Edge Deployment:** Static assets pushed to Cloudflare Pages edge network with instant atomic rollback capability.

---

### 3. DATABASE MIGRATION PROTOCOL

Migrations in `migrations/` must be executed sequentially:
```bash
wrangler d1 execute aisatellite-db --file=./migrations/0006_unified_ecosystem.sql
```
- **Safety Standard:** All table creations use `IF NOT EXISTS`. Destructive schema drops are strictly forbidden.
