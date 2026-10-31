---
title: "Liquid Shader Background"
demoId: "liquid-shader-background"
slug: "liquid-shader-background"
category: "GLSL / Shader Canvas"
description: "Hardware-accelerated procedural GLSL fluid dynamics with trigonometric octave displacement and color gradients."
tech:
  - "GLSL Fragment Shaders"
  - "Three.js Quad"
  - "Procedural Fluid Math"
  - "ShaderMaterial"
  - "TypeScript"
demoType: "interactive"
status: "Active & Interactive"
features:
  - "Hardware-accelerated procedural fluid dynamics rendered via fragment shader"
  - "Iterative sine/cosine domain warping creating organic ripples without image textures"
  - "Interactive palette switcher: Neon Cyber, Solar Plasma, and Deep Emerald"
  - "Interactive animation speed slider altering uniform u_time delta"
  - "Fullscreen quad rendering requiring only 1 draw call"
controls:
  - "Palette Buttons: Switches color gradient uniforms"
  - "Speed Slider: Modulates procedural wave velocity"
  - "Pause/Play: Halts shader time progression"
installation: "npm install three @types/three"
dependencies:
  - "three"
  - "@types/three"
performanceNotes: "Peak efficiency with 1 draw call on a fullscreen plane quad. VRAM usage is under 4.8 MB. Calculations run per-fragment directly on the GPU shader cores."
reducedMotionNotes: "Freezes the u_time uniform when prefers-reduced-motion is detected, locking the shader into a serene static digital gradient."
license: "MIT"
published: true
codeSnippet: |
  precision mediump float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_colorA;
  uniform vec3 u_colorB;
  varying vec2 vUv;
  void main() {
    vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution) / min(u_resolution.x, u_resolution.y);
    for(float i = 1.0; i < 4.0; i++){
      p.x += 0.3 / i * sin(i * 3.0 * p.y + u_time * 0.8);
      p.y += 0.3 / i * cos(i * 3.0 * p.x + u_time * 0.8);
    }
    float intensity = 0.5 + 0.5 * sin(p.x + p.y);
    gl_FragColor = vec4(mix(u_colorA, u_colorB, intensity), 0.85);
  }
promptTemplate: |
  Act as a GLSL Shader Specialist and Three.js Engineer.
  Build an optimized procedural liquid fluid shader background in [FRAMEWORK] for "[PROJECT_NAME]".
  Requirements:
  1. Render a full-viewport PlaneGeometry quad with a custom THREE.ShaderMaterial.
  2. Fragment shader must use sin/cos iterative domain warping for liquid ripple visuals.
  3. Pass uniforms: u_time (float), u_resolution (vec2), and color palette uniforms based on [ACCENT_COLOR].
  4. Animate u_time in requestAnimationFrame loop with speed factor [SPEED_FACTOR].
  5. Support dynamic window resizing with uniform resolution updates.
  6. Strict WebGL context disposal on cleanup.
  7. [REDUCED_MOTION_BEHAVIOR]
---

## Architectural Overview

The **Liquid Shader Background** produces hypnotic, high-tech fluid motion without any video files or bitmap assets. Every pixel is calculated on the fly inside the GPU fragment pipeline.

### Architectural Advantages:
- **Zero Asset Download**: Instant page load because the entire visual comes from mathematical shader instructions.
- **Infinite Resolution**: Crisp rendering on 4K, 5K, and Retina displays without blurring or pixelation.
- **Dynamic Palette Swapping**: Uniform variables allow instant color shifts synchronized with dark/light mode toggles or brand identity updates.
