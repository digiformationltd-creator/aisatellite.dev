import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ChevronRight, ArrowDown } from 'lucide-react';

export default function CinematicScrollDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { title: 'Stage 01: Low Earth Orbit', desc: 'Deploying sensory telemetry and neural communication arrays.', zPos: 40, yPos: 0, rotY: 0 },
    { title: 'Stage 02: Geostationary Ring', desc: 'Accelerating processing cluster across high-altitude relay corridors.', zPos: 25, yPos: 5, rotY: Math.PI / 4 },
    { title: 'Stage 03: Deep Space Hub', desc: 'Autonomous knowledge station operating beyond terrestrial cloud boundaries.', zPos: 12, yPos: -3, rotY: Math.PI / 2 },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    camera.position.z = 40;

    // Build concentric orbital rings
    const ringsGroup = new THREE.Group();
    for (let i = 0; i < 5; i++) {
      const ringGeom = new THREE.TorusGeometry(8 + i * 4, 0.08, 16, 100);
      const ringMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x00f0ff : 0x8b5cf6,
        transparent: true,
        opacity: 0.4 + i * 0.1,
      });
      const ringMesh = new THREE.Mesh(ringGeom, ringMat);
      ringMesh.rotation.x = Math.PI / 3 + i * 0.1;
      ringsGroup.add(ringMesh);
    }
    scene.add(ringsGroup);

    // Central Cosmic Core
    const coreGeom = new THREE.IcosahedronGeometry(3.5, 2);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.75,
    });
    const coreMesh = new THREE.Mesh(coreGeom, coreMat);
    scene.add(coreMesh);

    const resize = () => {
      if (!renderer || !container) return;
      const width = container.clientWidth;
      const height = container.clientHeight || 450;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    resize();
    window.addEventListener('resize', resize);

    let targetZ = steps[currentStep].zPos;
    let targetY = steps[currentStep].yPos;
    let targetRotY = steps[currentStep].rotY;

    let frameId = 0;
    const animate = (time: number) => {
      frameId = requestAnimationFrame(animate);

      // Smooth camera interpolation
      camera.position.z += (targetZ - camera.position.z) * 0.06;
      camera.position.y += (targetY - camera.position.y) * 0.06;

      ringsGroup.rotation.z = time * 0.0003;
      coreMesh.rotation.y = time * 0.0005;
      coreMesh.rotation.x = time * 0.0003;

      ringsGroup.rotation.y += (targetRotY - ringsGroup.rotation.y) * 0.05;

      renderer?.render(scene, camera);
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
      coreGeom.dispose();
      coreMat.dispose();
      renderer?.dispose();
    };
  }, [currentStep]);

  return (
    <div ref={containerRef} className="relative w-full h-[450px] rounded-xl overflow-hidden bg-space-950 border border-border-subtle flex flex-col justify-between p-6">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block pointer-events-none" />

      {/* Top Controls */}
      <div className="relative z-10 flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-widest text-cosmic-cyan bg-space-900/80 px-2.5 py-1 rounded border border-border-hover backdrop-blur-sm">
          Scroll-Driven Camera Interpolation
        </span>

        {/* Step buttons */}
        <div className="flex items-center gap-1.5 bg-space-900/80 backdrop-blur-md p-1 rounded-lg border border-border-subtle">
          {steps.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentStep(idx)}
              className={`w-7 h-7 rounded text-xs font-mono font-bold transition-all ${
                currentStep === idx
                  ? 'bg-cosmic-cyan text-space-950'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              0{idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Narrative Section Overlay */}
      <div className="relative z-10 max-w-md bg-space-900/70 backdrop-blur-md p-5 rounded-xl border border-white/10 shadow-2xl transition-all duration-300">
        <span className="text-[10px] font-mono uppercase text-cosmic-emerald font-bold tracking-wider block mb-1">
          Scene Coordinate {currentStep + 1} of 3
        </span>
        <h3 className="text-xl font-heading font-extrabold text-white mb-2">
          {steps[currentStep].title}
        </h3>
        <p className="text-xs text-text-secondary leading-relaxed mb-4">
          {steps[currentStep].desc}
        </p>

        <button
          type="button"
          onClick={() => setCurrentStep((prev) => (prev + 1) % steps.length)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-cosmic-cyan/15 hover:bg-cosmic-cyan/25 text-cosmic-cyan text-xs font-mono font-semibold border border-cosmic-cyan/30 transition-colors"
        >
          <span>Progress Trajectory</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="relative z-10 flex justify-end">
        <span className="text-[10px] font-mono text-text-muted bg-space-950/60 px-2 py-1 rounded">
          Camera Z: {steps[currentStep].zPos} &bull; Y: {steps[currentStep].yPos}
        </span>
      </div>
    </div>
  );
}
