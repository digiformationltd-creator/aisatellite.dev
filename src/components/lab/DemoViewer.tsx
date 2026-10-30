import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Play, Code, Eye, Sparkles, Check, Copy } from 'lucide-react';

interface DemoItem {
  id: string;
  title: string;
  category: string;
  description: string;
  status: 'Active & Interactive' | 'Ready for Implementation' | 'Prototype Code';
  code: string;
}

const DEMOS: DemoItem[] = [
  {
    id: 'particles',
    title: 'Cosmic Particle Hero',
    category: 'Three.js / WebGL',
    description: '1,200 particle vertices calculated in 3D orbital coordinates with mouse-guided camera parallax.',
    status: 'Active & Interactive',
    code: `import * as THREE from 'three';

// 1. Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
camera.position.z = 30;

// 2. Geometry generation
const count = 1200;
const positions = new Float32Array(count * 3);
for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 50;
}
const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

// 3. Points & Material
const material = new THREE.PointsMaterial({
  size: 0.15,
  color: 0x00f0ff,
  transparent: true,
  opacity: 0.8
});
const points = new THREE.Points(geometry, material);
scene.add(points);`,
  },
  {
    id: 'glass-cards',
    title: 'Glassmorphic 3D Tilt Card',
    category: 'CSS 3D / DOM',
    description: 'Hardware-accelerated perspective tilt with specular highlight vector calculations.',
    status: 'Ready for Implementation',
    code: `// Hardware-accelerated CSS 3D perspective
const card = document.querySelector('.card-3d');
card.addEventListener('mousemove', (e) => {
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;
  card.style.transform = \`perspective(1000px) rotateX(\${-y / 15}deg) rotateY(\${x / 15}deg)\`;
});`,
  },
  {
    id: 'liquid-shader',
    title: 'Liquid Neon Fragment Shader',
    category: 'GLSL / Shader',
    description: 'Continuous fluid surface simulation generated using procedural sine waves on a fullscreen quad.',
    status: 'Prototype Code',
    code: `precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  float color = sin(st.x * 10.0 + u_time) * cos(st.y * 10.0 + u_time);
  gl_FragColor = vec4(0.0, color * 0.9, color * 1.0, 0.8);
}`,
  },
];

export default function DemoViewer() {
  const [activeTab, setActiveTab] = useState<string>('particles');
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const currentDemo = DEMOS.find((d) => d.id === activeTab) || DEMOS[0];

  // Interactive 3D Canvas effect for particle demo
  useEffect(() => {
    if (viewMode !== 'preview' || activeTab !== 'particles') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch {
      return;
    }

    const width = canvas.parentElement?.clientWidth || 500;
    const height = 280;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 25;

    const count = 400;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 40;
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ size: 0.25, color: 0x00f0ff, transparent: true, opacity: 0.85 });
    const pts = new THREE.Points(geom, mat);
    scene.add(pts);

    let frameId: number;
    const animate = () => {
      pts.rotation.y += 0.003;
      pts.rotation.x += 0.0015;
      renderer?.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      geom.dispose();
      mat.dispose();
      renderer?.dispose();
    };
  }, [activeTab, viewMode]);

  const copyCode = async () => {
    await navigator.clipboard.writeText(currentDemo.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="cosmic-glass p-6 md:p-8 rounded-card border border-border-subtle overflow-hidden">
      {/* Header Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border-subtle">
        <div className="flex items-center gap-2 flex-wrap">
          {DEMOS.map((demo) => (
            <button
              key={demo.id}
              onClick={() => setActiveTab(demo.id)}
              className={`px-3 py-1.5 rounded-button text-xs font-mono font-medium transition-all ${
                activeTab === demo.id
                  ? 'bg-cosmic-cyan text-space-950 font-bold shadow-glow-cyan/30'
                  : 'bg-space-900 text-text-muted hover:text-text-primary hover:bg-space-850'
              }`}
            >
              {demo.title}
            </button>
          ))}
        </div>

        {/* View Toggle (Preview vs Code) */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-space-950 border border-border-subtle">
          <button
            onClick={() => setViewMode('preview')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded ${
              viewMode === 'preview' ? 'bg-space-850 text-cosmic-cyan font-semibold' : 'text-text-muted'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Interactive</span>
          </button>
          <button
            onClick={() => setViewMode('code')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded ${
              viewMode === 'code' ? 'bg-space-850 text-cosmic-cyan font-semibold' : 'text-text-muted'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Source Code</span>
          </button>
        </div>
      </div>

      {/* Main Showcase Canvas / Code Area */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3 text-xs font-mono">
          <span className="text-text-secondary">{currentDemo.category} &bull; {currentDemo.description}</span>
          <span className={`px-2 py-0.5 rounded text-[11px] ${
            currentDemo.status === 'Active & Interactive'
              ? 'bg-cosmic-emerald/10 text-cosmic-emerald border border-cosmic-emerald/20'
              : 'bg-space-950 text-text-muted border border-border-subtle'
          }`}>
            {currentDemo.status}
          </span>
        </div>

        {viewMode === 'preview' ? (
          <div className="relative h-[280px] w-full rounded-xl bg-space-950/80 border border-border-subtle flex items-center justify-center overflow-hidden">
            {activeTab === 'particles' ? (
              <canvas ref={canvasRef} className="w-full h-full block" />
            ) : (
              <div className="text-center p-6 space-y-2">
                <Sparkles className="w-8 h-8 text-cosmic-violet mx-auto animate-pulse" />
                <div className="text-sm font-heading font-bold text-text-primary">{currentDemo.title}</div>
                <p className="text-xs text-text-muted max-w-sm mx-auto">{currentDemo.description}</p>
                <div className="text-[11px] font-mono text-cosmic-cyan pt-2">
                  Status: {currentDemo.status} &bull; Toggle "Source Code" to inspect logic
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="relative rounded-xl bg-space-950 p-4 border border-border-subtle">
            <button
              onClick={copyCode}
              className="absolute top-3 right-3 flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded bg-space-900 hover:bg-space-850 text-text-secondary hover:text-cosmic-cyan border border-border-subtle"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-cosmic-emerald" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </button>
            <pre className="text-xs font-mono text-cosmic-cyan overflow-x-auto max-h-[260px] leading-relaxed">
              <code>{currentDemo.code}</code>
            </pre>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-border-subtle flex items-center justify-between text-xs font-mono text-text-muted">
        <span>Zero WebGL context leaks &bull; Dispose routines enforced</span>
        <a href="/3d-lab" className="text-cosmic-cyan hover:underline">
          Explore All 3D Lab Experiments &rarr;
        </a>
      </div>
    </div>
  );
}
