---
name: SQLite
description: A C-language library that implements a small, fast, self-contained, high-reliability, full-featured, SQL database engine.
category: Databases
tags:
  - database
  - embedded
  - zero-config
  - lightweight
  - open-source
officialUrl: https://www.sqlite.org/
repositoryUrl: https://github.com/sqlite/sqlite
documentationUrl: https://www.sqlite.org/docs.html
license: Public Domain (Blessing)
pricingModel: open-source
selfHosted: true
requiresCreditCard: false
freeTierLimitations:
  - Completely free for any purpose with zero limitations.
  - Single-writer architecture (not built for distributed multi-writer write concurrency).
alternativesTo:
  - Microsoft Access
  - Cloud SQL instances for local embedded apps
verificationStatus: verified
lastVerified: "2026-10-31"
featured: true
published: true
securityNotes:
  - Keep database file permissions strictly locked to the application runtime user.
  - Enable Write-Ahead Logging (PRAGMA journal_mode=WAL) for high concurrency.
installationInstructions: sqlite3 mydatabase.db
---

SQLite is the most widely deployed database in the world, powering billions of mobile devices, desktop applications, and server-side edge platforms like Cloudflare D1 and Turso.

### Key Capabilities
- **Zero Configuration**: No server process to install, configure, or administer.
- **Single File Storage**: An entire database (definitions, tables, indices, and data) is contained in a single cross-platform file.
- **Atomic Commits**: ACID transactions guarantee crash resilience even during power loss.
