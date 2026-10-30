import * as THREE from 'three';

export function initCosmicCanvas(containerId: string) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // 1. Reduced motion check
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  // 2. WebGL support check
  const isWebGLAvailable = () => {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch {
      return false;
    }
  };

  if (!isWebGLAvailable()) {
    console.info('WebGL not available, falling back to CSS cosmic gradient.');
    return;
  }

  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || 500;

  // Scene & Camera
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
  camera.position.z = 35;

  // Renderer
  let renderer: THREE.WebGLRenderer | null = null;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  } catch (e) {
    console.warn('Could not initialize WebGLRenderer', e);
    return;
  }

  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.domElement.style.position = 'absolute';
  renderer.domElement.style.top = '0';
  renderer.domElement.style.left = '0';
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.pointerEvents = 'none'; // Critical: never block user input
  container.appendChild(renderer.domElement);

  // Geometry: 1,000 deep space particles
  const particleCount = 1000;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const colorCyan = new THREE.Color('#00f0ff');
  const colorViolet = new THREE.Color('#8b5cf6');
  const colorWhite = new THREE.Color('#f4f8ff');

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 80;
    positions[i3 + 1] = (Math.random() - 0.5) * 60;
    positions[i3 + 2] = (Math.random() - 0.5) * 50;

    const rand = Math.random();
    const chosenColor = rand > 0.6 ? colorCyan : rand > 0.3 ? colorViolet : colorWhite;
    colors[i3] = chosenColor.r;
    colors[i3 + 1] = chosenColor.g;
    colors[i3 + 2] = chosenColor.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.15,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // Subtle Mouse Parallax
  let mouseX = 0;
  let mouseY = 0;
  const handleMouseMove = (e: MouseEvent) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  };
  window.addEventListener('mousemove', handleMouseMove, { passive: true });

  // Animation Loop with Visibility Check
  let animationFrameId: number;
  let isPaused = false;

  const animate = () => {
    if (!isPaused && renderer) {
      particles.rotation.y += 0.0006;
      particles.rotation.x += 0.0003;

      camera.position.x += (mouseX * 2 - camera.position.x) * 0.03;
      camera.position.y += (-mouseY * 2 - camera.position.y) * 0.03;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    }
    animationFrameId = requestAnimationFrame(animate);
  };

  const handleVisibilityChange = () => {
    isPaused = document.visibilityState === 'hidden';
  };
  document.addEventListener('visibilitychange', handleVisibilityChange);

  // Resize Listener
  const handleResize = () => {
    if (!renderer || !container) return;
    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
  };
  window.addEventListener('resize', handleResize, { passive: true });

  animate();

  // Cleanup handler
  return () => {
    cancelAnimationFrame(animationFrameId);
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('resize', handleResize);
    document.removeEventListener('visibilitychange', handleVisibilityChange);

    geometry.dispose();
    material.dispose();
    if (renderer) {
      renderer.dispose();
      renderer.forceContextLoss();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    }
  };
}
