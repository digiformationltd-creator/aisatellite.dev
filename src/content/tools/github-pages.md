---
name: GitHub Pages
description: Public web pages hosted directly from your GitHub repository, perfect for open-source documentation, portfolios, and blogs.
category: Free Hosting
tags:
  - hosting
  - git
  - static
  - open-source
  - jekyll
officialUrl: https://pages.github.com/
repositoryUrl: https://github.com/github/pages-gem
documentationUrl: https://docs.github.com/en/pages
license: Proprietary Service (Open Integrations)
pricingModel: free-forever
selfHosted: false
requiresCreditCard: false
freeTierLimitations:
  - 1GB site repository limit, 100GB monthly soft bandwidth limit, 10 builds per hour.
  - Requires public repository for free personal accounts.
alternativesTo:
  - GitLab Pages
  - Bitbucket Cloud
verificationStatus: verified
lastVerified: "2026-10-31"
featured: false
published: true
securityNotes:
  - Only serve static client-side files; sensitive keys must never be committed to repository branches.
installationInstructions: git checkout -b gh-pages && git push origin gh-pages
---

GitHub Pages is a static site hosting service that takes HTML, CSS, and JavaScript files straight from a repository on GitHub, optionally runs the files through a build process, and publishes a website.
