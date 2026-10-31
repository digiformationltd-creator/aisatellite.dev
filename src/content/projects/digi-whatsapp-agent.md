---
title: "Digi WhatsApp Agent"
tagline: "Autonomous Micro-Business CRM & WhatsApp Customer Support Engine"
family: "Digi Agent"
description: "A self-hosted, open-source AI agent and CRM bridge that manages customer inquiries, product catalogs, order bookings, and support tickets directly over WhatsApp."
techStack:
  - "Node.js"
  - "TypeScript"
  - "Baileys"
  - "LangChain"
  - "PostgreSQL"
  - "Docker"
openSourceLicense: "MIT License"
repositoryUrl: "https://github.com/digi-ai/digi-whatsapp-agent"
documentationUrl: "https://aisatellite.pages.dev/projects/digi-whatsapp-agent/docs"
verificationStatus: "verified"
features:
  - "Multi-device WhatsApp Web QR authentication using Baileys protocol"
  - "Natural language product catalog browsing and automated order intake"
  - "Human-in-the-loop escalation dashboard with instant push alerts"
  - "Integrates with Digi Biz OS, ERPNext, and custom webhooks"
  - "Zero per-message fees — runs 100% on your own VPS or home server"
version: "3.1.0"
releaseDate: "2026-10-29"
githubRepo: "digi-ai/digi-whatsapp-agent"
downloads:
  - platform: "Docker Container (Recommended)"
    version: "3.1.0"
    filename: "ghcr.io/digi-ai/digi-whatsapp-agent:v3.1.0"
    url: "https://github.com/digi-ai/digi-whatsapp-agent/pkgs/container/digi-whatsapp-agent"
    size: "245 MB"
    sha256: "7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069"
  - platform: "Node.js Source Tarball"
    version: "3.1.0"
    filename: "digi-whatsapp-agent-3.1.0.tar.gz"
    url: "https://github.com/digi-ai/digi-whatsapp-agent/archive/refs/tags/v3.1.0.tar.gz"
    size: "12.3 MB"
    sha256: "6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b"
  - platform: "CLI Executable (Linux x64)"
    version: "3.1.0"
    filename: "digi-wa-linux-x64"
    url: "https://github.com/digi-ai/digi-whatsapp-agent/releases/download/v3.1.0/digi-wa-linux-x64"
    size: "38.7 MB"
    sha256: "a158b0f8cdfe0df1f98ef1108c4e4d65012579dfd969eb24ba3ffae1a01103c0"
docsOverview: "Digi WhatsApp Agent links WhatsApp Web sockets directly to autonomous agent graphs. Connect it to any OpenAPI server, SQL database, or local LLM to handle real-world transactions around the clock."
changelogItems:
  - version: "3.1.0"
    date: "2026-10-29"
    changes:
      - "Upgraded to Baileys v6.7 for seamless multi-device reconnection."
      - "Added dynamic catalog generation from markdown product inventory."
      - "Introduced automatic rate-limiting and anti-ban delay randomized pacing."
  - version: "3.0.0"
    date: "2026-08-11"
    changes:
      - "Major architectural overhaul with native LangGraph conversational memory."
      - "Web-based QR code pairing interface."
installationSteps:
  - "docker pull ghcr.io/digi-ai/digi-whatsapp-agent:v3.1.0"
  - "docker run -d -p 3000:3000 -v wa_data:/app/auth ghcr.io/digi-ai/digi-whatsapp-agent:v3.1.0"
  - "Open http://localhost:3000 in your browser and scan the displayed QR code with WhatsApp."
  - "Configure LLM provider in settings (Ollama, OpenAI, or Anthropic)."
published: true
---

## Digi WhatsApp Agent: Autonomous Conversational Commerce

Digi WhatsApp Agent enables solo founders, agencies, and small businesses to automate their WhatsApp communications without paying expensive per-conversation Meta Cloud API surcharges or SaaS platform subscription fees.

### Standout Capabilities:
- **Zero Cloud Middlemen**: Operates directly between your server and WhatsApp via web sockets.
- **Context-Aware Memory**: Remembers past client conversations, ongoing orders, and delivery addresses using embedded SQLite or PostgreSQL.
- **Enterprise Partner Integration**: Natively bridges into Digi Biz OS and DigiFormation customer CRM records.
