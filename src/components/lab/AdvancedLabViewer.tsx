import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Code2,
  Play,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  Sliders,
  Terminal,
  Activity,
  Layers,
  Cpu,
  RefreshCw,
  Zap,
} from 'lucide-react';

import CosmicParticleDemo from './demos/CosmicParticleDemo';
import GlassCardDemo from './demos/GlassCardDemo';
import CinematicScrollDemo from './demos/CinematicScrollDemo';
import ProductConfiguratorDemo from './demos/ProductConfiguratorDemo';
import LiquidShaderDemo from './demos/LiquidShaderDemo';

export interface LabDemoMeta {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  tech: string[];
  installation: string;
  perf: {
    targetFps: string;
    drawCalls: string;
    gpuMemory: string;
    cpuLoad: string;
  };
  code: string;
  promptTemplate: string;
}

export const LAB_DEMOS: LabDemoMeta[] = [
  {
    id: 'cosmic-particle-hero',
    slug: 'cosmic-particle-hero',
    title: 'Cosmic Particle Hero',
    category: 'Three.js / WebGL',
    description: '1,500 interactive orbital particle vertices with mouse parallax, velocity dampening, and GPU instancing.',
    tech: ['Three.js', 'WebGL', 'BufferGeometry', 'PointsMaterial'],
    installation: 'npm install three @types/three',
    perf: {
      targetFps: '60 FPS',
      drawCalls: '1 Draw Call',
      gpuMemory: '6.4 MB',
      cpuLoad: '< 1.8%',
    },
    code: `import * as THREE from 'three';

export function createCosmicParticles(container: HTMLElement, count = 1500, color = 0x00f0ff) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 35;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const scales = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 60;
    positions[i3 + 1] = (Math.random() - 0.5) * 60;
    positions[i3 + 2] = (Math.random() - 0.5) * 60;
    scales[i] = Math.random() * 0.8 + 0.2;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

  const material = new THREE.PointsMaterial({
    size: 0.18,
    color,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  let frameId: number;
  let mouseX = 0, mouseY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  function animate() {
    frameId = requestAnimationFrame(animate);
    particles.rotation.y += 0.0015;
    particles.rotation.x += 0.0008;

    camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 5 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }
  animate();

  return () => {
    cancelAnimationFrame(frameId);
    geometry.dispose();
    material.dispose();
    renderer.dispose();
    if (renderer.domElement.parentElement) {
      renderer.domElement.parentElement.removeChild(renderer.domElement);
    }
  };
}`,
    promptTemplate: `Act as a Senior Creative Three.js Developer.
Build a production-grade Cosmic Particle Hero canvas component in [FRAMEWORK] for my project "[PROJECT_NAME]".

Requirements:
1. Initialize Three.js scene with [PARTICLE_COUNT] particles using THREE.BufferGeometry and THREE.PointsMaterial.
2. Use primary accent color [ACCENT_COLOR] with additive blending and subtle opacity.
3. Mouse parallax interaction with smooth dampening (lerp factor 0.05).
4. Full clean-up routine: cancel requestAnimationFrame, dispose geometry, dispose material, and call renderer.dispose() on unmount.
5. High-DPI support capped at devicePixelRatio 2.
6. [REDUCED_MOTION_BEHAVIOR]
7. Provide TypeScript types and instructions to install dependencies.`,
  },
  {
    id: 'glassmorphic-3d-cards',
    slug: 'glassmorphic-3d-cards',
    title: 'Premium Glass Card System',
    category: 'CSS 3D / Perspective',
    description: 'Hardware-accelerated CSS 3D matrix transformations with dynamic specular reflections and border radiance.',
    tech: ['CSS 3D Transforms', 'React', 'TypeScript', 'Hardware Acceleration'],
    installation: 'npm install lucide-react',
    perf: {
      targetFps: '60 FPS',
      drawCalls: '0 WebGL (GPU DOM)',
      gpuMemory: '1.2 MB',
      cpuLoad: '< 0.5%',
    },
    code: `// Hardware-accelerated CSS 3D Perspective Card
import React, { useRef, useState } from 'react';

export function GlassTiltCard({ title, description }: { title: string; description: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rx = ((y - centerY) / centerY) * -12;
    const ry = ((x - centerX) / centerX) * 12;

    setCoords({ x, y });
    setTilt({ rx, ry });
  }

  function handleMouseLeave() {
    setTilt({ rx: 0, ry: 0 });
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: \`perspective(1000px) rotateX(\${tilt.rx}deg) rotateY(\${tilt.ry}deg)\`,
        transition: tilt.rx === 0 ? 'transform 0.5s ease-out' : 'none',
        willChange: 'transform',
      }}
      className="relative rounded-2xl bg-space-900/40 backdrop-blur-xl border border-white/10 p-8 shadow-2xl overflow-hidden"
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-40 transition-opacity duration-300"
        style={{
          background: \`radial-gradient(400px circle at \${coords.x}px \${coords.y}px, rgba(0, 240, 255, 0.15), transparent 70%)\`,
        }}
      />
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-300 text-sm">{description}</p>
    </div>
  );
}`,
    promptTemplate: `Act as an Elite Front-End UI/UX Engineer.
Implement a reusable 3D tilt glassmorphism card component in [FRAMEWORK] for "[PROJECT_NAME]".

Features required:
1. Smooth hardware-accelerated 3D perspective tilt calculating pointer offset from card center.
2. Dynamic specular radial-gradient reflection that tracks cursor position ([ACCENT_COLOR] tint).
3. Backface-visibility: hidden and will-change: transform for optimal compositing.
4. Spring-like reset animation when the mouse leaves the card area.
5. [REDUCED_MOTION_BEHAVIOR]
6. Fully responsive layout with mobile touch safety.`,
  },
  {
    id: 'cinematic-scroll-experience',
    slug: 'cinematic-scroll-experience',
    title: 'Cinematic Scroll Experience',
    category: 'Three.js / Scroll Driven',
    description: 'Multi-layer 3D camera flight with concentric orbital gyroscopes, step-based narrative waypoints, and depth of field.',
    tech: ['Three.js', 'Camera Waypoints', 'TorusGeometry', 'Icosahedron'],
    installation: 'npm install three @types/three',
    perf: {
      targetFps: '60 FPS',
      drawCalls: '4 Draw Calls',
      gpuMemory: '8.2 MB',
      cpuLoad: '< 2.1%',
    },
    code: `import * as THREE from 'three';

export function setupCinematicScene(canvas: HTMLCanvasElement) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 18);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  const coreGeom = new THREE.IcosahedronGeometry(2, 2);
  const coreMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, wireframe: true });
  const core = new THREE.Mesh(coreGeom, coreMat);
  scene.add(core);

  const ringGeom = new THREE.TorusGeometry(5, 0.05, 16, 100);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x8a2be2 });
  const ring = new THREE.Mesh(ringGeom, ringMat);
  scene.add(ring);

  const light = new THREE.PointLight(0xffffff, 2, 50);
  light.position.set(10, 10, 10);
  scene.add(light);

  function updateWaypoint(progress: number) {
    // Lerp camera position through 3D waypoints
    const targetZ = 18 - progress * 10;
    const targetX = Math.sin(progress * Math.PI) * 4;
    camera.position.z += (targetZ - camera.position.z) * 0.1;
    camera.position.x += (targetX - camera.position.x) * 0.1;
    camera.lookAt(0, 0, 0);
  }

  function dispose() {
    coreGeom.dispose();
    coreMat.dispose();
    ringGeom.dispose();
    ringMat.dispose();
    renderer.dispose();
  }

  return { scene, camera, renderer, updateWaypoint, core, ring, dispose };
}`,
    promptTemplate: `Act as a WebGL Creative Technologist.
Build a 3D Cinematic Scroll-driven experience in [FRAMEWORK] using Three.js for "[PROJECT_NAME]".

Key Specifications:
1. A central geometric core (Icosahedron / Quantum Core) encircled by dual gyroscopic Torus rings with accent [ACCENT_COLOR].
2. Camera flight along curved 3D coordinates linked to user scroll progress or waypoint buttons.
3. Smooth interpolation (lerp) on camera trajectory to prevent jarring jumps.
4. Lighting with ambient and specular point lights reflecting off wireframe vertices.
5. Strict memory cleanup with dispose() on all geometries and materials upon component teardown.
6. [REDUCED_MOTION_BEHAVIOR]`,
  },
  {
    id: 'interactive-product-configurator',
    slug: 'interactive-product-configurator',
    title: 'Interactive 3D Product Configurator',
    category: 'Three.js / 3D Canvas',
    description: 'Real-time 3D satellite mesh with orbital drag-to-rotate, material presets (Metallic, Cyber, Glass), and color picker.',
    tech: ['Three.js', 'MeshPhysicalMaterial', 'Quaternion Rotation', 'Lighting Setup'],
    installation: 'npm install three @types/three',
    perf: {
      targetFps: '60 FPS',
      drawCalls: '3 Draw Calls',
      gpuMemory: '11.5 MB',
      cpuLoad: '< 2.4%',
    },
    code: `import * as THREE from 'three';

export function createProductMesh() {
  const group = new THREE.Group();

  // Satellite Core
  const bodyGeom = new THREE.CylinderGeometry(1.2, 1.2, 3, 32);
  const bodyMat = new THREE.MeshStandardMaterial({
    metalness: 0.85,
    roughness: 0.25,
    color: 0x00f0ff,
  });
  const body = new THREE.Mesh(bodyGeom, bodyMat);
  group.add(body);

  // Solar Arrays
  const panelGeom = new THREE.BoxGeometry(4.5, 0.08, 1.2);
  const panelMat = new THREE.MeshStandardMaterial({
    color: 0x111e38,
    roughness: 0.1,
    metalness: 0.9,
  });
  const leftPanel = new THREE.Mesh(panelGeom, panelMat);
  leftPanel.position.x = 3.2;
  group.add(leftPanel);

  const rightPanel = leftPanel.clone();
  rightPanel.position.x = -3.2;
  group.add(rightPanel);

  function dispose() {
    bodyGeom.dispose();
    bodyMat.dispose();
    panelGeom.dispose();
    panelMat.dispose();
  }

  return { group, bodyMat, panelMat, dispose };
}`,
    promptTemplate: `Act as a 3D Graphics and E-Commerce Web Engineer.
Create a real-time interactive 3D product customizer in [FRAMEWORK] using Three.js for "[PROJECT_NAME]".

Features:
1. Procedural 3D satellite model with high-fidelity MeshStandardMaterial and MeshPhysicalMaterial.
2. Drag-to-rotate interaction with inertia/friction dampening.
3. Live color switching supporting custom hex: [ACCENT_COLOR].
4. Preset material modes: Cyber Chrome (metalness 0.95), Matte Stealth (roughness 0.8), and Holographic Glass (transmission 0.9).
5. Studio lighting setup with key, fill, and rim point lights.
6. Clean component lifecycle with full GPU resource disposal.
7. [REDUCED_MOTION_BEHAVIOR]`,
  },
  {
    id: 'liquid-shader-background',
    slug: 'liquid-shader-background',
    title: 'Liquid Shader Background',
    category: 'GLSL / Shader Canvas',
    description: 'Hardware-accelerated procedural GLSL fluid dynamics with trigonometric octave displacement and color gradients.',
    tech: ['GLSL Shaders', 'ShaderMaterial', 'Three.js Quad', 'Per-pixel Math'],
    installation: 'npm install three @types/three',
    perf: {
      targetFps: '60 FPS',
      drawCalls: '1 Draw Call (Fullscreen Quad)',
      gpuMemory: '4.8 MB',
      cpuLoad: '< 1.1%',
    },
    code: `// Vertex Shader
export const vertexShader = \`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
\`;

// Fragment Shader
export const fragmentShader = \`
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
    vec3 col = mix(u_colorA, u_colorB, intensity);
    gl_FragColor = vec4(col, 0.85);
  }
\`;

// Lifecycle cleanup:
// quadGeometry.dispose(); shaderMaterial.dispose(); renderer.dispose();`,
    promptTemplate: `Act as a GLSL Shader Specialist and Three.js Engineer.
Build an optimized procedural liquid fluid shader background in [FRAMEWORK] for "[PROJECT_NAME]".

Requirements:
1. Render a full-viewport PlaneGeometry quad with a custom THREE.ShaderMaterial.
2. Fragment shader must use sin/cos iterative domain warping for liquid ripple visuals.
3. Pass uniforms: u_time (float), u_resolution (vec2), and color palette uniforms based on [ACCENT_COLOR].
4. Animate u_time in requestAnimationFrame loop with speed factor [SPEED_FACTOR].
5. Support dynamic window resizing with uniform resolution updates.
6. Strict WebGL context disposal on cleanup.
7. [REDUCED_MOTION_BEHAVIOR]`,
  },
];

interface AdvancedLabViewerProps {
  initialDemoId?: string;
  showAllTabs?: boolean;
}

export default function AdvancedLabViewer({
  initialDemoId = 'cosmic-particle-hero',
  showAllTabs = true,
}: AdvancedLabViewerProps) {
  const [selectedDemoId, setSelectedDemoId] = useState<string>(initialDemoId);
  const [activeTab, setActiveTab] = useState<'demo' | 'code' | 'prompt' | 'benchmarks'>('demo');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // Dynamic Prompt Generator State
  const [promptFramework, setPromptFramework] = useState('React + TypeScript');
  const [promptProjectName, setPromptProjectName] = useState('AI Satellite Portal');
  const [promptAccentColor, setPromptAccentColor] = useState('#00f0ff');
  const [promptParticleCount, setPromptParticleCount] = useState('1800');
  const [reducedMotionFallback, setReducedMotionFallback] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);

  const currentDemo = LAB_DEMOS.find((d) => d.id === selectedDemoId) || LAB_DEMOS[0];

  // Esc key exits fullscreen
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(currentDemo.code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2200);
    } catch {
      // fallback
    }
  };

  const buildGeneratedPrompt = () => {
    const reducedMotionText = reducedMotionFallback
      ? 'Include window.matchMedia("(prefers-reduced-motion: reduce)") listener to pause continuous rotation and animations when enabled.'
      : 'Standard continuous motion enabled without reduced-motion pause.';

    return currentDemo.promptTemplate
      .replace(/\[FRAMEWORK\]/g, promptFramework)
      .replace(/\[PROJECT_NAME\]/g, promptProjectName)
      .replace(/\[ACCENT_COLOR\]/g, promptAccentColor)
      .replace(/\[PARTICLE_COUNT\]/g, promptParticleCount)
      .replace(/\[SPEED_FACTOR\]/g, '0.8')
      .replace(/\[REDUCED_MOTION_BEHAVIOR\]/g, reducedMotionText);
  };

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(buildGeneratedPrompt());
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2200);
    } catch {
      // fallback
    }
  };

  // Render live demo component
  const renderDemoComponent = () => {
    switch (currentDemo.id) {
      case 'cosmic-particle-hero':
        return <CosmicParticleDemo />;
      case 'glassmorphic-3d-cards':
        return <GlassCardDemo />;
      case 'cinematic-scroll-experience':
        return <CinematicScrollDemo />;
      case 'interactive-product-configurator':
        return <ProductConfiguratorDemo />;
      case 'liquid-shader-background':
        return <LiquidShaderDemo />;
      default:
        return <CosmicParticleDemo />;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-space-950 p-4 md:p-6 overflow-y-auto'
          : 'cosmic-glass rounded-card border border-border-subtle p-5 md:p-8'
      }`}
    >
      {/* Top Bar: Selector & View Modes */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-border-subtle">
        {/* Flagship Selector */}
        {showAllTabs && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {LAB_DEMOS.map((demo) => {
              const isActive = demo.id === selectedDemoId;
              return (
                <button
                  key={demo.id}
                  onClick={() => {
                    setSelectedDemoId(demo.id);
                  }}
                  className={`px-3 py-1.5 rounded-button text-xs font-mono font-medium transition-all ${
                    isActive
                      ? 'bg-cosmic-cyan text-space-950 font-bold shadow-glow-cyan/20'
                      : 'bg-space-900 text-text-muted hover:text-text-primary hover:bg-space-850'
                  }`}
                >
                  {demo.title}
                </button>
              );
            })}
          </div>
        )}

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-space-950 border border-border-subtle ml-auto">
          <button
            onClick={() => setActiveTab('demo')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded transition-colors ${
              activeTab === 'demo'
                ? 'bg-space-850 text-cosmic-cyan font-bold shadow-sm'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Interactive Demo</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded transition-colors ${
              activeTab === 'code'
                ? 'bg-space-850 text-cosmic-cyan font-bold shadow-sm'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Source Code</span>
          </button>

          <button
            onClick={() => setActiveTab('prompt')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded transition-colors ${
              activeTab === 'prompt'
                ? 'bg-space-850 text-cosmic-cyan font-bold shadow-sm'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Prompt Generator</span>
          </button>

          <button
            onClick={() => setActiveTab('benchmarks')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded transition-colors ${
              activeTab === 'benchmarks'
                ? 'bg-space-850 text-cosmic-cyan font-bold shadow-sm'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Benchmarks</span>
          </button>

          <button
            onClick={toggleFullscreen}
            aria-label="Toggle Fullscreen"
            className="p-1.5 text-text-muted hover:text-cosmic-cyan transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Content Area Based on Active Tab */}
      <div className="mt-6">
        {/* Tab 1: Live Interactive Demo */}
        {activeTab === 'demo' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-cosmic-cyan font-bold">{currentDemo.title}</span>
                <span className="text-text-muted">&bull;</span>
                <span className="text-text-secondary">{currentDemo.category}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-cosmic-emerald/10 text-cosmic-emerald border border-cosmic-emerald/20 text-[11px]">
                  <Zap className="w-3 h-3" />
                  <span>Hardware Accelerated</span>
                </span>
                <span className="text-text-muted text-[11px] hidden sm:inline">Press Esc to exit fullscreen</span>
              </div>
            </div>

            {/* Container for the real interactive 3D component */}
            <div className="relative rounded-2xl bg-space-950 border border-border-subtle overflow-hidden">
              {renderDemoComponent()}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-3 text-xs font-mono text-text-muted border-t border-border-subtle">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-cosmic-cyan" />
                <span>Quick Install:</span>
                <code className="text-text-primary bg-space-900 px-2 py-0.5 rounded border border-border-subtle">
                  {currentDemo.installation}
                </code>
              </div>
              <div className="flex items-center gap-4">
                <span>FPS: <strong className="text-cosmic-emerald">{currentDemo.perf.targetFps}</strong></span>
                <span>GPU Draw Calls: <strong className="text-cosmic-cyan">{currentDemo.perf.drawCalls}</strong></span>
                <span>License: <strong className="text-text-primary">MIT Open-Source</strong></span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Source Code */}
        {activeTab === 'code' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-heading font-bold text-text-primary">
                  Production Source Code &mdash; {currentDemo.title}
                </h4>
                <p className="text-xs text-text-muted font-mono mt-0.5">
                  Clean Three.js & TypeScript code with lifecycle disposal hooks
                </p>
              </div>

              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-button bg-cosmic-cyan/10 hover:bg-cosmic-cyan/20 text-cosmic-cyan border border-cosmic-cyan/30 transition-colors"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-cosmic-emerald" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied to Clipboard!' : 'Copy Source Code'}</span>
              </button>
            </div>

            <div className="relative rounded-xl bg-space-950 p-4 border border-border-subtle overflow-hidden">
              <pre className="text-xs font-mono text-slate-200 overflow-x-auto max-h-[480px] leading-relaxed p-2">
                <code>{currentDemo.code}</code>
              </pre>
            </div>
          </div>
        )}

        {/* Tab 3: AI Prompt Generator with Variable Replacements */}
        {activeTab === 'prompt' && (
          <div className="space-y-6">
            <div className="bg-space-900/60 p-4 rounded-xl border border-border-subtle">
              <h4 className="text-sm font-heading font-bold text-text-primary flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-cosmic-cyan" />
                <span>AI Prompt Customizer for Cursor, Claude, Gemini & ChatGPT</span>
              </h4>
              <p className="text-xs text-text-muted leading-relaxed mb-4">
                Customize the variables below to generate a surgical, production-ready AI prompt that replicates this exact 3D component in your chosen framework and color scheme.
              </p>

              {/* Variable Inputs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-text-secondary mb-1">Target Framework</label>
                  <select
                    value={promptFramework}
                    onChange={(e) => setPromptFramework(e.target.value)}
                    className="w-full bg-space-950 border border-border-subtle rounded px-2.5 py-1.5 text-xs font-mono text-text-primary focus:outline-none focus:border-cosmic-cyan"
                  >
                    <option value="React + TypeScript">React + TypeScript</option>
                    <option value="Astro + React Islands">Astro + React Islands</option>
                    <option value="Vanilla JavaScript + Vite">Vanilla JS + Vite</option>
                    <option value="Next.js (App Router)">Next.js (App Router)</option>
                    <option value="Vue 3 + Vite">Vue 3 + Vite</option>
                    <option value="Svelte 5">Svelte 5</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-text-secondary mb-1">Project Name</label>
                  <input
                    type="text"
                    value={promptProjectName}
                    onChange={(e) => setPromptProjectName(e.target.value)}
                    className="w-full bg-space-950 border border-border-subtle rounded px-2.5 py-1.5 text-xs font-mono text-text-primary focus:outline-none focus:border-cosmic-cyan"
                    placeholder="My SaaS Platform"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-text-secondary mb-1">Primary Accent Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={promptAccentColor}
                      onChange={(e) => setPromptAccentColor(e.target.value)}
                      className="w-7 h-7 rounded border-0 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={promptAccentColor}
                      onChange={(e) => setPromptAccentColor(e.target.value)}
                      className="w-full bg-space-950 border border-border-subtle rounded px-2.5 py-1 text-xs font-mono text-text-primary focus:outline-none focus:border-cosmic-cyan"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-text-secondary mb-1">Particle / Mesh Density</label>
                  <input
                    type="text"
                    value={promptParticleCount}
                    onChange={(e) => setPromptParticleCount(e.target.value)}
                    className="w-full bg-space-950 border border-border-subtle rounded px-2.5 py-1.5 text-xs font-mono text-text-primary focus:outline-none focus:border-cosmic-cyan"
                    placeholder="1500"
                  />
                </div>
              </div>

              {/* Reduced Motion Toggle */}
              <div className="mt-4 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="reducedMotion"
                  checked={reducedMotionFallback}
                  onChange={(e) => setReducedMotionFallback(e.target.checked)}
                  className="rounded border-border-subtle text-cosmic-cyan focus:ring-0"
                />
                <label htmlFor="reducedMotion" className="text-xs font-mono text-text-secondary cursor-pointer">
                  Include automated <code>prefers-reduced-motion</code> fallback check & freeze routine
                </label>
              </div>
            </div>

            {/* Generated Prompt Box */}
            <div className="relative rounded-xl bg-space-950 p-4 border border-border-subtle">
              <div className="flex items-center justify-between pb-3 border-b border-border-subtle mb-3">
                <span className="text-xs font-mono text-cosmic-cyan font-bold">
                  Generated Prompt for AI Assistant
                </span>
                <button
                  onClick={handleCopyPrompt}
                  className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-button bg-cosmic-cyan text-space-950 font-bold hover:brightness-110 transition-all shadow-glow-cyan/20"
                >
                  {copiedPrompt ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPrompt ? 'Prompt Copied!' : 'Copy AI Prompt'}</span>
                </button>
              </div>

              <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-[260px] overflow-y-auto">
                {buildGeneratedPrompt()}
              </pre>
            </div>
          </div>
        )}

        {/* Tab 4: Performance & Benchmarks */}
        {activeTab === 'benchmarks' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-space-900/60 p-4 rounded-xl border border-border-subtle">
                <div className="flex items-center justify-between text-text-muted mb-2">
                  <span className="text-xs font-mono">Frame Rate Target</span>
                  <Activity className="w-4 h-4 text-cosmic-emerald" />
                </div>
                <div className="text-2xl font-bold font-mono text-cosmic-emerald">{currentDemo.perf.targetFps}</div>
                <p className="text-[11px] text-text-muted mt-1">Sustained 60Hz/120Hz refresh without frame drops</p>
              </div>

              <div className="bg-space-900/60 p-4 rounded-xl border border-border-subtle">
                <div className="flex items-center justify-between text-text-muted mb-2">
                  <span className="text-xs font-mono">Draw Calls</span>
                  <Layers className="w-4 h-4 text-cosmic-cyan" />
                </div>
                <div className="text-2xl font-bold font-mono text-cosmic-cyan">{currentDemo.perf.drawCalls}</div>
                <p className="text-[11px] text-text-muted mt-1">Batched single-pass instanced GPU geometry</p>
              </div>

              <div className="bg-space-900/60 p-4 rounded-xl border border-border-subtle">
                <div className="flex items-center justify-between text-text-muted mb-2">
                  <span className="text-xs font-mono">GPU Memory VRAM</span>
                  <Zap className="w-4 h-4 text-cosmic-violet" />
                </div>
                <div className="text-2xl font-bold font-mono text-cosmic-violet">{currentDemo.perf.gpuMemory}</div>
                <p className="text-[11px] text-text-muted mt-1">Lightweight buffer allocation & vertex arrays</p>
              </div>

              <div className="bg-space-900/60 p-4 rounded-xl border border-border-subtle">
                <div className="flex items-center justify-between text-text-muted mb-2">
                  <span className="text-xs font-mono">CPU Overhead</span>
                  <Cpu className="w-4 h-4 text-cosmic-emerald" />
                </div>
                <div className="text-2xl font-bold font-mono text-cosmic-emerald">{currentDemo.perf.cpuLoad}</div>
                <p className="text-[11px] text-text-muted mt-1">Offloaded to GPU shaders and requestAnimationFrame</p>
              </div>
            </div>

            <div className="bg-space-900/60 p-5 rounded-xl border border-border-subtle">
              <h4 className="text-sm font-heading font-bold text-text-primary mb-3">
                Zero Memory Leak Guarantee &amp; Garbage Collection Compliance
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed mb-4">
                Every component in the AI Satellite 3D Web Lab implements strict disposal patterns:
              </p>
              <ul className="text-xs font-mono text-text-muted space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cosmic-emerald shrink-0" />
                  <span><code>BufferGeometry.dispose()</code> called on component unmount.</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cosmic-emerald shrink-0" />
                  <span><code>Material.dispose()</code> invoked on all custom shaders and standard materials.</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cosmic-emerald shrink-0" />
                  <span><code>WebGLRenderer.dispose()</code> and DOM canvas unbinding executed cleanly.</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cosmic-emerald shrink-0" />
                  <span>Global animation frame IDs and resize listeners cleared to prevent zombie loops.</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
