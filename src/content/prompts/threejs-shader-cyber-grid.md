---
title: "Three.js Cosmic Grid & Fluid Shader Generator"
description: "Prompt for generating performant, GPU-accelerated GLSL custom vertex and fragment shaders with responsive canvas resizing and disposal routines."
category: "Three.js"
targetModel: "Claude 3.7 / GPT-4o"
variables:
  - "PRIMARY_COLOR"
  - "PARTICLE_COUNT"
exampleUsage: "Ask the AI model to generate a custom Three.js component using RawShaderMaterial."
published: true
lastVerified: "2026-10-31"
systemPrompt: |
  Write a modular Three.js WebGL animation in vanilla TypeScript:
  - Use RawShaderMaterial with precision mediump float.
  - Implement requestAnimationFrame with delta-time throttling.
  - Cleanly dispose of all geometries, materials, and renderer context on component unmount.
  - Detect WebGL support and provide an accessible CSS background fallback.
---

### Purpose
Ensures generated Three.js code adheres to high-performance rendering standards, avoids memory leaks, and handles context disposal cleanly.
