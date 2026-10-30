---
name: Supabase
description: The open-source Firebase alternative providing a Postgres database, authentication, edge functions, and real-time subscriptions.
category: Databases
tags:
  - backend-as-a-service
  - postgres
  - authentication
  - storage
  - open-source
officialUrl: https://supabase.com/
repositoryUrl: https://github.com/supabase/supabase
documentationUrl: https://supabase.com/docs
license: Apache 2.0
pricingModel: freemium
selfHosted: true
requiresCreditCard: false
freeTierLimitations:
  - Free cloud tier includes 2 free projects, 500MB database, 1GB file storage, and 50,000 monthly active users.
  - Pauses inactive cloud projects after 1 week.
  - Unlimited when self-hosted via Docker.
alternativesTo:
  - Google Firebase
  - AWS Amplify
verificationStatus: verified
lastVerified: "2026-10-31"
featured: true
published: true
securityNotes:
  - Always configure Row Level Security (RLS) policies on every public table.
  - Never expose the service_role key in client-side code.
installationInstructions: npx supabase init && npx supabase start
---

Supabase packages enterprise-grade open-source tools around a dedicated PostgreSQL database, providing instant auto-generated REST and GraphQL APIs, row-level security, auth, and edge functions.
