import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function LiquidShaderDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [speed, setSpeed] = useState(1.0);
  const [palette, setPalette] = useState<'neon' | 'plasma' | 'emerald'>('neon');

  const uniformsRef = useRef<Record<string, { value: any }>>({
    u_time: { value: 0 },
    u_resolution: { value: new THREE.Vector2(1, 1) },
    u_speed: { value: 1.0 },
    u_palette: { value: 0 },
  });

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform float u_speed;
    uniform int u_palette;
    varying vec2 vUv;

    void main() {
      vec2 st = gl_FragCoord.xy / u_resolution.xy;
      st.x *= u_resolution.x / u_resolution.y;

      float t = u_time * u_speed * 0.4;

      // Multi-layer procedural sine wave distortion
      vec2 p = st * 3.0;
      for (int i = 1; i < 4; i++) {
        float fi = float(i);
        p.x += 0.3 / fi * sin(fi * 3.0 * p.y + t * 0.6);
        p.y += 0.3 / fi * cos(fi * 3.0 * p.x + t * 0.6);
      }

      float r = cos(p.x + p.y + 1.0) * 0.5 + 0.5;
      float g = sin(p.x - p.y + 1.0) * 0.5 + 0.5;
      float b = sin(p.x + p.y + t) * 0.5 + 0.5;

      vec3 col = vec3(r, g, b);

      if (u_palette == 0) {
        // Neon Cyber (Cyan / Violet)
        col = mix(vec3(0.0, 0.94, 1.0), vec3(0.54, 0.36, 0.96), col.x);
      } else if (u_palette == 1) {
        // Deep Plasma (Rose / Gold)
        col = mix(vec3(0.92, 0.28, 0.6), vec3(0.96, 0.62, 0.04), col.y);
      } else if (u_palette == 2) {
        // Emerald Matrix (Emerald / Cyan)
        col = mix(vec3(0.06, 0.72, 0.5), vec3(0.0, 0.94, 1.0), col.z);
      }

      gl_FragColor = vec4(col * 0.85, 0.95);
    }
  `;

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    } catch {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: uniformsRef.current,
      transparent: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const resize = () => {
      if (!renderer || !container) return;
      const width = container.clientWidth;
      const height = container.clientHeight || 450;
      renderer.setSize(width, height, false);
      uniformsRef.current.u_resolution.value.set(width, height);
    };

    resize();
    window.addEventListener('resize', resize);

    let frameId = 0;
    const animate = (time: number) => {
      frameId = requestAnimationFrame(animate);
      uniformsRef.current.u_time.value = time * 0.001;
      renderer?.render(scene, camera);
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
      geometry.dispose();
      material.dispose();
      renderer?.dispose();
    };
  }, []);

  useEffect(() => {
    uniformsRef.current.u_speed.value = speed;
    uniformsRef.current.u_palette.value = palette === 'neon' ? 0 : palette === 'plasma' ? 1 : 2;
  }, [speed, palette]);

  return (
    <div ref={containerRef} className="relative w-full h-[450px] rounded-xl overflow-hidden bg-space-950 border border-border-subtle">
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Floating Shader Controls */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-3 bg-space-900/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-border-hover text-xs font-mono">
        <div className="flex items-center gap-1.5">
          <span className="text-text-muted">Palette:</span>
          {(['neon', 'plasma', 'emerald'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPalette(p)}
              className={`px-2 py-0.5 rounded capitalize transition-all ${
                palette === p
                  ? 'bg-cosmic-cyan text-space-950 font-bold'
                  : 'text-text-secondary hover:text-white bg-space-950'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-text-muted">Fluid Speed:</span>
          <input
            type="range"
            min={0.2}
            max={3.0}
            step={0.1}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-20 accent-cosmic-cyan cursor-pointer"
            aria-label="Fluid Motion Speed"
          />
          <span className="text-cosmic-cyan">{speed.toFixed(1)}x</span>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 text-[10px] font-mono text-text-muted bg-space-950/70 px-2.5 py-1 rounded border border-border-subtle">
        Hardware Fragment Shader &bull; Procedural Sine Wave Fluid Simulation
      </div>
    </div>
  );
}
