---
title: "Liquid Neon GLSL Fragment Shader"
category: "Liquid Shader Background"
description: "A continuous fluid surface simulation generated using Perlin noise and procedural sine waves on a fullscreen quad."
tech:
  - "GLSL"
  - "Three.js"
  - "WebGL"
demoType: "code-preview"
status: "Prototype Code"
codeSnippet: |
  precision mediump float;
  uniform float u_time;
  uniform vec2 u_resolution;
  void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    float color = sin(st.x * 10.0 + u_time) * cos(st.y * 10.0 + u_time);
    gl_FragColor = vec4(vec3(0.0, color * 0.9, color * 1.0), 0.7);
  }
published: true
---

Renders a dynamic flowing nebula shader on an isolated GPU thread, delivering ambient motion with minimal memory bandwidth usage.
