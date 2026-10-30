---
title: "Glassmorphic 3D Card Physics"
category: "Glassmorphic 3D Cards"
description: "Interactive 3D tilt cards with dynamic specular reflection, real-time light angle tracking, and CSS transform fallbacks."
tech:
  - "CSS 3D Transforms"
  - "Vanilla JavaScript"
demoType: "code-preview"
status: "Ready for Implementation"
codeSnippet: |
  const card = document.querySelector('.card-3d');
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    card.style.transform = `perspective(1000px) rotateX(${-y / 15}deg) rotateY(${x / 15}deg)`;
  });
published: true
---

Combines hardware-accelerated CSS perspective transforms with dynamic radial highlights to simulate high-end glassmorphism with zero Three.js bundle overhead.
