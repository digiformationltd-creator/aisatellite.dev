# AI SATELLITE — DISASTER RECOVERY & INCIDENT RUNBOOKS
## 9 OPERATIONAL RUNBOOKS, SNAPSHOT RESTORATION & FAILOVER PROCEDURES

**Permanent Canonical Domain:** `https://aisatellite.dev`  
**Target RTO:** $< 30\text{ minutes}$ (Recovery Time Objective)  
**Target RPO:** $< 1\text{ hour}$ (Recovery Point Objective)

---

### 1. THE 9 OPERATIONAL DISASTER RECOVERY PLAYBOOKS

1. **DR-01: Primary Cloudflare Edge Outage**
   - Symptom: Global edge nodes returning HTTP 520–524.
   - Procedure: Verify Cloudflare status page; reroute DNS to secondary origin or activate cached static fallback on backup Pages project.
2. **DR-02: D1 Database Corruption or Accidental Table Drop**
   - Symptom: SQL query errors in worker logs.
   - Procedure: Execute point-in-time snapshot restore from Cloudflare D1 automated hourly backups via `wrangler d1 backup restore`.
3. **DR-03: Cloudflare R2 Media Storage Failure**
   - Symptom: Missing static diagrams or image assets.
   - Procedure: Switch asset CDN base URL to local pre-rendered asset directory; verify replica bucket sync.
4. **DR-04: DNS Hijacking / Route Leakage**
   - Symptom: DNS queries for `aisatellite.dev` resolving to unknown IP addresses.
   - Procedure: Immediately lock domain registry at registrar; re-assert Cloudflare nameservers; flush 1.1.1.1 and 8.8.8.8 caches.
5. **DR-05: API Rate Limit Exhaustion (External GitHub / Search Console)**
   - Symptom: Background jobs logging HTTP 429.
   - Procedure: Discovery engine automatically switches to deterministic fallback provider; pauses non-critical scrapers for 60 minutes.
6. **DR-06: Compromised Administrative Credentials**
   - Symptom: Suspicious actions logged in platform event bus.
   - Procedure: Invalidate all active sessions in `AuthGuard`; rotate admin secret keys; force password reset across all admin users.
7. **DR-07: Malicious Content Injection or Spam Attack**
   - Symptom: High volume of spam submissions in community queue.
   - Procedure: Enable Cloudflare Turnstile / Under Attack Mode; purge pending submissions matching honeypot triggers.
8. **DR-08: Autonomous Research Agent Runaway Loop**
   - Symptom: Rapid execution count spikes in agent logs.
   - Procedure: Daily cost cap ($1.00) automatically halts execution; operator triggers emergency stop via `/admin`.
9. **DR-09: Search Index Corruption**
   - Symptom: Pagefind returns empty or garbled results.
   - Procedure: Re-run `npx pagefind --site dist` in CI/CD pipeline and re-deploy static index artifacts.
