---
name: Cloudflare Pages
description: Fast, secure, and free JAMstack hosting platform for frontend developers with automated Git deployments and global edge CDN delivery.
category: Free Hosting
tags:
  - hosting
  - jamstack
  - edge-cdn
  - serverless
  - free-ssl
officialUrl: https://pages.cloudflare.com/
repositoryUrl: https://github.com/cloudflare/workers-sdk
documentationUrl: https://developers.cloudflare.com/pages/
license: Proprietary Service (Open SDK)
pricingModel: free-forever
selfHosted: false
requiresCreditCard: false
freeTierLimitations:
  - Free tier offers unlimited bandwidth, unlimited static requests, and 500 builds per month.
  - 100 custom domains per account.
  - Subdomains hosted free on *.pages.dev.
alternativesTo:
  - Vercel Pro
  - Netlify Starter
verificationStatus: verified
lastVerified: "2026-10-31"
featured: true
published: true
securityNotes:
  - Built-in DDoS protection and automated TLS 1.3 SSL certificates.
  - Environment variables and secrets encrypted at rest.
installationInstructions: npx wrangler pages deploy dist --project-name my-app
---

Cloudflare Pages provides frontend teams with an instant global edge hosting platform backed by Cloudflare's 300+ city global anycast network. With zero egress fees and automated Git builds, it is the premier platform for static sites and full-stack edge applications.
