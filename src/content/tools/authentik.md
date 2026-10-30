---
name: Authentik
description: An open-source Identity Provider focused on flexibility and versatility, with support for modern protocols like OAuth2, SAML, LDAP, and SCIM.
category: Authentication
tags:
  - auth
  - sso
  - identity
  - security
  - open-source
officialUrl: https://goauthentik.io/
repositoryUrl: https://github.com/goauthentik/authentik
documentationUrl: https://docs.goauthentik.io/
license: GPL-3.0
pricingModel: open-source
selfHosted: true
requiresCreditCard: false
freeTierLimitations:
  - Community edition is 100% free with unlimited users and all protocols included.
alternativesTo:
  - Okta
  - Ping Identity
verificationStatus: verified
lastVerified: "2026-10-31"
featured: false
published: true
securityNotes:
  - Enforce WebAuthn/FIDO2 hardware security keys for admin authentication flows.
installationInstructions: docker compose -f docker-compose.yml up -d
---

Authentik is an all-in-one identity provider designed for microservices, home labs, and enterprise environments, providing transparent user self-service and flow customizability.
