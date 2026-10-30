---
name: Keycloak
description: Open Source Identity and Access Management for modern applications and services, featuring SSO, OAuth 2.0, and OpenID Connect.
category: Authentication
tags:
  - auth
  - sso
  - openid-connect
  - saml
  - security
officialUrl: https://www.keycloak.org/
repositoryUrl: https://github.com/keycloak/keycloak
documentationUrl: https://www.keycloak.org/documentation
license: Apache 2.0
pricingModel: open-source
selfHosted: true
requiresCreditCard: false
freeTierLimitations:
  - Complete software suite is 100% free with no user count caps or feature gating.
alternativesTo:
  - Auth0
  - Okta
verificationStatus: verified
lastVerified: "2026-10-31"
featured: false
published: true
securityNotes:
  - Require HTTPS across all realms.
  - Integrate with enterprise LDAP or hardened PostgreSQL storage.
installationInstructions: docker run -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:latest start-dev
---

Keycloak adds authentication to applications and secures services with minimal effort. No need to deal with storing users or authenticating users.
