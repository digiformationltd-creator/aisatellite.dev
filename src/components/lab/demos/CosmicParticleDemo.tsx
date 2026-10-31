import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Props {
  initialDensity?: number;
  initialColor?: string;
  interactive?: boolean;
}

export default function CosmicParticleDemo({
  initialDensity = 1500,
  initialColor = '#00f0ff',
  interactive = true,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [density, setDensity] = useState(initialDensity);
  const [particleColor, setParticleColor] = useState(initialColor);
  const [fps, setFps] = useState(60);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: window.devicePixelRatio < 2,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    camera.position.z = 35;

    // Build particle geometry
    const positions = new Float32Array(density * 3);
    const originalPositions = new Float32Array(density * 3);
    const scales = new Float32Array(density);

    for (let i = 0; i < density; i++) {
      const i3 = i * 3;
      const radius = 10 + Math.random() * 30;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      originalPositions[i3] = x;
      originalPositions[i3 + 1] = y;
      originalPositions[i3 + 2] = z;

      scales[i] = Math.random() * 1.5 + 0.5;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    const material = new THREE.PointsMaterial({
      color: new THREE.Color(particleColor),
      size: 0.18,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Mouse coordinates tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    const resize = () => {
      if (!renderer || !container) return;
      const width = container.clientWidth;
      const height = container.clientHeight || 400;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    resize();
    window.addEventListener('resize', resize);

    // Reduced motion check
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let frameId = 0;
    let lastTime = performance.now();
    let frameCount = 0;

    const animate = (time: number) => {
      frameId = requestAnimationFrame(animate);

      // FPS calculation
      frameCount++;
      if (time - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = time;
      }

      if (!prefersReducedMotion) {
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        particles.rotation.y = time * 0.00015 + targetX * 0.3;
        particles.rotation.x = time * 0.00008 + targetY * 0.2;
      }

      renderer?.render(scene, camera);
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      geometry.dispose();
      material.dispose();
      renderer?.dispose();
    };
  }, [density, particleColor, interactive]);

  return (
    <div ref={containerRef} className="relative w-full h-[450px] rounded-xl overflow-hidden bg-space-950 border border-border-subtle group">
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Interactive Controls Overlay */}
      <div className="absolute top-4 left-4 flex flex-wrap items-center gap-3 bg-space-900/80 backdrop-blur-md px-3.5 py-2 rounded-lg border border-border-hover text-xs font-mono">
        <div className="flex items-center gap-1.5">
          <span className="text-text-muted">Color:</span>
          <input
            type="color"
            value={particleColor}
            onChange={(e) => setParticleColor(e.target.value)}
            className="w-5 h-5 rounded cursor-pointer bg-transparent border-0"
            aria-label="Particle Color"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-text-muted">Count:</span>
          <select
            value={density}
            onChange={(e) => setDensity(Number(e.target.value))}
            className="bg-space-950 text-text-primary px-2 py-0.5 rounded border border-border-subtle focus:outline-none"
            aria-label="Particle Density"
          >
            <option value={800}>800 (Light)</option>
            <option value={1500}>1,500 (Balanced)</option>
            <option value={3000}>3,000 (Dense)</option>
          </select>
        </div>

        <div className="text-[11px] text-cosmic-emerald font-semibold">
          {fps} FPS
        </div>
      </div>

      <div className="absolute bottom-4 right-4 text-[10px] font-mono text-text-muted bg-space-950/60 px-2 py-1 rounded">
        Interactive Three.js Canvas &bull; Mouse Parallax Active
      </div>
    </div>
  );
}
