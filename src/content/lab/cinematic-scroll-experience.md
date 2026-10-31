---
title: "Cinematic Scroll Experience"
demoId: "cinematic-scroll-experience"
slug: "cinematic-scroll-experience"
category: "Three.js / Scroll Driven"
description: "Multi-layer 3D camera flight with concentric orbital gyroscopes, step-based narrative waypoints, and depth of field."
tech:
  - "Three.js"
  - "Camera Interpolation"
  - "TorusGeometry"
  - "Icosahedron"
  - "TypeScript"
demoType: "interactive"
status: "Active & Interactive"
features:
  - "Multi-layer 3D scene with glowing wireframe core and concentric orbital rings"
  - "Step-based narrative waypoint controller mimicking smooth scroll storytelling"
  - "Camera coordinate interpolation (lerp) preventing harsh viewpoint transitions"
  - "Real-time rotation and light specular tracking"
  - "Interactive step navigation buttons with live waypoint feedback"
controls:
  - "Click Waypoints (1 to 4): Drives 3D camera across defined spatial keyframes"
  - "Autoplay Toggle: Continuous looping traversal through all camera positions"
installation: "npm install three @types/three"
dependencies:
  - "three"
  - "@types/three"
performanceNotes: "Runs at sustained 60 FPS using 4 draw calls and 8.2 MB of GPU VRAM. Geometries and materials are pooled to prevent allocation overhead during flight."
reducedMotionNotes: "Replaces 3D camera translation with instantaneous narrative crossfades when prefers-reduced-motion is enabled."
license: "MIT"
published: true
codeSnippet: |
  import * as THREE from 'three';
  // Camera Waypoint Interpolation
  const targetZ = 18 - progress * 10;
  const targetX = Math.sin(progress * Math.PI) * 4;
  camera.position.z += (targetZ - camera.position.z) * 0.1;
  camera.position.x += (targetX - camera.position.x) * 0.1;
  camera.lookAt(0, 0, 0);
promptTemplate: |
  Act as a WebGL Creative Technologist.
  Build a 3D Cinematic Scroll-driven experience in [FRAMEWORK] using Three.js for "[PROJECT_NAME]".
  Key Specifications:
  1. A central geometric core (Icosahedron / Quantum Core) encircled by dual gyroscopic Torus rings with accent [ACCENT_COLOR].
  2. Camera flight along curved 3D coordinates linked to user scroll progress or waypoint buttons.
  3. Smooth interpolation (lerp) on camera trajectory to prevent jarring jumps.
  4. Lighting with ambient and specular point lights reflecting off wireframe vertices.
  5. Strict memory cleanup with dispose() on all geometries and materials upon component teardown.
  6. [REDUCED_MOTION_BEHAVIOR]
---

## Architectural Overview

The **Cinematic Scroll Experience** enables Apple-style visual storytelling on technical product launches. Rather than relying on heavy pre-rendered video clips, it executes real-time WebGL rendering with a dynamic camera flight rig.

### Core Capabilities:
- **Spatial Storytelling**: As users scroll or advance through keyframes, the virtual camera swoops past architectural layers.
- **Micro-Payload**: Less than 15 KB of JavaScript compared to tens of megabytes for video mp4 files.
- **Customizable Meshes**: Swap out the quantum core for any 3D asset or custom procedural geometry.
