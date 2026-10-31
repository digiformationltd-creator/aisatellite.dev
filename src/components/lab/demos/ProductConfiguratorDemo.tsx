import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Palette, Sun, Shield } from 'lucide-react';

export default function ProductConfiguratorDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [activeMaterial, setActiveMaterial] = useState<'metallic' | 'matte' | 'cyber' | 'glass'>('metallic');
  const [accentColor, setAccentColor] = useState('#00f0ff');
  const [lightingPreset, setLightingPreset] = useState<'studio' | 'neon' | 'void'>('studio');

  const modelGroupRef = useRef<THREE.Group | null>(null);
  const materialsMapRef = useRef<Map<string, THREE.Material>>(new Map());

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
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 4, 14);
    camera.lookAt(0, 0, 0);

    // Dynamic Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x00f0ff, 1.5);
    dirLight1.position.set(5, 10, 7);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x8b5cf6, 1.2);
    dirLight2.position.set(-5, -5, -5);
    scene.add(dirLight2);

    // Build Procedural Orbital Satellite Model
    const modelGroup = new THREE.Group();
    modelGroupRef.current = modelGroup;

    // 1. Central Core Cube
    const coreGeom = new THREE.BoxGeometry(3, 3, 3);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      metalness: 0.8,
      roughness: 0.2,
    });
    const coreMesh = new THREE.Mesh(coreGeom, coreMat);
    modelGroup.add(coreMesh);

    // 2. Solar Wings
    const wingGeom = new THREE.BoxGeometry(6, 1.8, 0.1);
    const wingMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(accentColor),
      metalness: 0.9,
      roughness: 0.1,
      emissive: new THREE.Color(accentColor),
      emissiveIntensity: 0.2,
    });
    materialsMapRef.current.set('wing', wingMat);

    const leftWing = new THREE.Mesh(wingGeom, wingMat);
    leftWing.position.x = -5;
    modelGroup.add(leftWing);

    const rightWing = new THREE.Mesh(wingGeom, wingMat);
    rightWing.position.x = 5;
    modelGroup.add(rightWing);

    // 3. Sensor Dish Antenna
    const dishGeom = new THREE.ConeGeometry(1.2, 0.8, 32, 1, true);
    const dishMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.9,
      roughness: 0.1,
      wireframe: false,
    });
    const dishMesh = new THREE.Mesh(dishGeom, dishMat);
    dishMesh.position.y = 2.2;
    dishMesh.rotation.x = Math.PI;
    modelGroup.add(dishMesh);

    scene.add(modelGroup);

    // Simple Drag Rotation Controls
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      modelGroup.rotation.y += deltaX * 0.01;
      modelGroup.rotation.x += deltaY * 0.01;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

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

    let frameId = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (!isDragging) {
        modelGroup.rotation.y += 0.003;
      }
      renderer?.render(scene, camera);
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', resize);
      coreGeom.dispose();
      wingGeom.dispose();
      dishGeom.dispose();
      renderer?.dispose();
    };
  }, []);

  // Update Material and Color reactivity
  useEffect(() => {
    const wingMat = materialsMapRef.current.get('wing') as THREE.MeshStandardMaterial;
    if (wingMat) {
      wingMat.color.set(accentColor);
      wingMat.emissive.set(accentColor);

      if (activeMaterial === 'metallic') {
        wingMat.metalness = 0.95;
        wingMat.roughness = 0.1;
        wingMat.wireframe = false;
      } else if (activeMaterial === 'matte') {
        wingMat.metalness = 0.1;
        wingMat.roughness = 0.9;
        wingMat.wireframe = false;
      } else if (activeMaterial === 'cyber') {
        wingMat.metalness = 0.5;
        wingMat.roughness = 0.2;
        wingMat.wireframe = true;
      } else if (activeMaterial === 'glass') {
        wingMat.metalness = 0.1;
        wingMat.roughness = 0.05;
        wingMat.wireframe = false;
        wingMat.transparent = true;
        wingMat.opacity = 0.6;
      }
    }
  }, [accentColor, activeMaterial]);

  return (
    <div ref={containerRef} className="relative w-full h-[450px] rounded-xl overflow-hidden bg-space-950 border border-border-subtle cursor-grab active:cursor-grabbing select-none">
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Top Floating Control Deck */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="flex items-center gap-2 bg-space-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-border-hover pointer-events-auto text-xs font-mono">
          <span className="text-text-muted">Material:</span>
          {(['metallic', 'matte', 'cyber', 'glass'] as const).map((mat) => (
            <button
              key={mat}
              type="button"
              onClick={() => setActiveMaterial(mat)}
              className={`px-2 py-1 rounded capitalize transition-all ${
                activeMaterial === mat
                  ? 'bg-cosmic-cyan text-space-950 font-bold'
                  : 'text-text-secondary hover:text-white bg-space-950'
              }`}
            >
              {mat}
            </button>
          ))}
        </div>

        {/* Accent Color Palette */}
        <div className="flex items-center gap-2 bg-space-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-border-hover pointer-events-auto">
          {['#00f0ff', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setAccentColor(c)}
              style={{ backgroundColor: c }}
              className={`w-5 h-5 rounded-full transition-transform ${
                accentColor === c ? 'scale-125 ring-2 ring-white' : 'hover:scale-110 opacity-80'
              }`}
              aria-label={`Select Color ${c}`}
            />
          ))}
        </div>
      </div>

      <div className="absolute bottom-4 left-4 text-[10px] font-mono text-text-muted bg-space-950/70 px-2.5 py-1 rounded border border-border-subtle">
        Drag to Orbit 360&deg; &bull; Real-Time PBR Shader Evaluation
      </div>
    </div>
  );
}
