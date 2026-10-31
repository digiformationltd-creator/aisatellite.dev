# AI SATELLITE — DEVELOPER HANDBOOK
## LOCAL WORKSPACE SETUP, CODING CONVENTIONS & TEST DISCIPLINE

**Permanent Canonical Domain:** `https://aisatellite.dev`  
**Prerequisites:** Node.js 22 LTS or newer, Git, npm

---

### 1. LOCAL WORKSPACE SETUP

```bash
# 1. Clone the repository
git clone https://github.com/aisatellite/ai-satellite.git
cd ai-satellite

# 2. Install dependencies (strictly pinned)
npm ci

# 3. Copy development environment file
cp .env.example .env

# 4. Start local Astro development server
npm run dev
# Server listening at http://localhost:4321
```

---

### 2. CODE VERIFICATION WORKFLOW

Before committing any modifications to Git, run the 3-step verification suite:

```bash
# Step 1: Astro template diagnostics & TypeScript static typecheck
npx astro check

# Step 2: Full automated regression test suite (sequential execution)
npx vitest run

# Step 3: Production static build & search compilation
npx astro build
npx pagefind --site dist
```

---

### 3. COMPONENT & STYLING CONVENTIONS

- **Astro Pages (`src/pages/*.astro`):**
  Use for all static pre-rendered routes. Always provide `title`, `description`, and canonical URL via `<BaseLayout>`.
- **React Islands (`src/components/**/*.tsx`):**
  Use only where interactive client-side state is required (e.g. search bars, copy buttons, filter pills, admin dashboards). Add `client:load` or `client:idle`.
- **Orbital Glass Design Tokens:**
  - Base background: `bg-slate-950`
  - Translucent glass panels: `bg-slate-900/60 backdrop-blur-md`
  - Cosmic borders: `border-cyan-500/20`
  - Hover highlights: `hover:border-cyan-400/40 hover:shadow-glow-cyan`
  - Typography: Inter for headings and body; JetBrains Mono for code and metadata.
