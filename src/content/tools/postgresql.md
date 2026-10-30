---
name: PostgreSQL
description: The World's Most Advanced Open Source Relational Database, renowned for reliability, feature robustness, and performance.
category: Databases
tags:
  - database
  - sql
  - open-source
  - relational
  - acid
officialUrl: https://www.postgresql.org/
repositoryUrl: https://git.postgresql.org/gitweb/?p=postgresql.git
documentationUrl: https://www.postgresql.org/docs/
license: PostgreSQL License (OSI Approved)
pricingModel: open-source
selfHosted: true
requiresCreditCard: false
freeTierLimitations:
  - 100% Free and unconstrained for on-premise and self-hosted instances.
  - Managed cloud providers may enforce their own compute/storage limits.
alternativesTo:
  - Oracle Database
  - Microsoft SQL Server
verificationStatus: verified
lastVerified: "2026-10-31"
featured: true
published: true
securityNotes:
  - Enforce SCRAM-SHA-256 password encryption.
  - Never expose port 5432 directly to the public internet without SSL and strict pg_hba.conf IP whitelisting.
installationInstructions: docker run --name postgres-satellite -e POSTGRES_PASSWORD=securepass -p 5432:5432 -d postgres:17-alpine
---

PostgreSQL is a powerful, open-source object-relational database system with over 35 years of active development that has earned it a strong reputation for reliability, feature robustness, and performance.

### Key Capabilities
- **ACID Compliance**: Full transaction integrity with multi-version concurrency control (MVCC).
- **Extensibility**: Native support for JSONB, PostGIS geospatial indexing, and custom extensions.
- **Enterprise Ready**: Point-in-time recovery (PITR), logical replication, and foreign data wrappers (FDWs).
