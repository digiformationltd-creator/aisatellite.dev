# AI SATELLITE — PRIVACY & DATA GOVERNANCE MODEL
## ZERO-PII ARCHITECTURE, CONSENT HYGIENE & DATA PORTABILITY

**Permanent Canonical Domain:** `https://aisatellite.dev`  
**Privacy Commitment:** Zero third-party ad tracking, zero user fingerprinting, complete self-service data portability.

---

### 1. CORE PRIVACY PRINCIPLES

1. **Zero Third-Party Trackers:**
   AI Satellite does not install Google Analytics, Meta Pixels, Hotjar, or advertising SDKs.
2. **Strict Signal Compliance:**
   Automatically respects `DNT: 1` (Do Not Track) and `Sec-GPC: 1` (Global Privacy Control) headers sent by client browsers.
3. **Anonymized Analytics Only:**
   Event logging is decoupled from user identities. IP addresses, query strings containing emails or keys, and password fields are sanitized before persistence.
4. **Isolated Personal Workspace (My Orbit):**
   Developer snippets, custom prompts, and project workspaces are strictly private and excluded from public search indexes.

---

### 2. DATA PORTABILITY & RIGHT TO BE FORGOTTEN

Implemented in `src/lib/workspace/export-service.ts`:
- **Single-Click Data Export:** Users can download a complete JSON archive of all personal workspace items, prompt vaults, and bookmarks.
- **Account Deletion:** Users can trigger irreversible cascading deletion. Upon confirmation, all user records, sessions, snippets, and preferences are purged from the database within 1 millisecond.
