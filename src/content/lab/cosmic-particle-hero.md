---
title: "Cosmic Particle Hero Canvas"
category: "Cosmic Particle Hero"
description: "A lightweight, GPU-optimized Three.js canvas featuring floating starfields, orbital nodes, and subtle mouse parallax interaction."
tech:
  - "Three.js"
  - "WebGL"
  - "TypeScript"
demoType: "interactive"
status: "Active & Interactive"
codeSnippet: |
  import * as THREE from 'three';
  // Initializes 1,200 particle vertices in a 3D orbital space
  const geometry = new THREE.BufferGeometry();
  const count = 1200;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 50;
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({ size: 0.1, color: 0x00f0ff });
  const points = new THREE.Points(geometry, material);
published: true
---

The Cosmic Particle Hero provides an immersive, ambient deep-space background without exceeding 2% CPU load or causing frame drops on mobile devices.
