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
    return;
  }

  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || 650;

  // Scene & Camera
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
  camera.position.set(0, 2, 28);

  // Renderer with high visual fidelity and power efficiency
  let renderer: THREE.WebGLRenderer | null = null;
  try {
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
  } catch {
    return;
  }

  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.domElement.style.position = 'absolute';
  renderer.domElement.style.top = '0';
  renderer.domElement.style.left = '0';
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.pointerEvents = 'none'; // Never block user input
  container.appendChild(renderer.domElement);

  // ====================================================
  // LIGHTING
  // ====================================================
  // Sun directional light with warm-white brilliance
  const sunLight = new THREE.DirectionalLight(0xf5faff, 2.4);
  sunLight.position.set(-25, 20, 15);
  scene.add(sunLight);

  // Ambient deep space illumination with atmospheric blue tone
  const ambientLight = new THREE.AmbientLight(0x101a2d, 1.4);
  scene.add(ambientLight);

  // Orbital blue rim light
  const earthRimLight = new THREE.PointLight(0x56e5ff, 2.0, 50);
  earthRimLight.position.set(0, -10, 10);
  scene.add(earthRimLight);

  // ====================================================
  // 1. REALISTIC MULTI-LAYER STARFIELD
  // ====================================================
  const starCount = 2200;
  const starPositions = new Float32Array(starCount * 3);
  const starColors = new Float32Array(starCount * 3);

  const colIceWhite = new THREE.Color('#F5FAFF');
  const colOrbitalCyan = new THREE.Color('#56E5FF');
  const colNebulaViolet = new THREE.Color('#9875FF');
  const colAuroraTeal = new THREE.Color('#40E5C3');

  for (let i = 0; i < starCount; i++) {
    const i3 = i * 3;
    starPositions[i3] = (Math.random() - 0.5) * 120;
    starPositions[i3 + 1] = (Math.random() - 0.5) * 80 + 10;
    starPositions[i3 + 2] = -10 - Math.random() * 80;

    const r = Math.random();
    const c = r > 0.75 ? colOrbitalCyan : r > 0.55 ? colNebulaViolet : r > 0.4 ? colAuroraTeal : colIceWhite;
    starColors[i3] = c.r;
    starColors[i3 + 1] = c.g;
    starColors[i3 + 2] = c.b;
  }

  const starGeometry = new THREE.BufferGeometry();
  starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

  const starMaterial = new THREE.PointsMaterial({
    size: 0.18,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
  });

  const starfield = new THREE.Points(starGeometry, starMaterial);
  scene.add(starfield);

  // Slow drifting space dust / orbital particles
  const dustCount = 350;
  const dustPositions = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    const i3 = i * 3;
    dustPositions[i3] = (Math.random() - 0.5) * 45;
    dustPositions[i3 + 1] = (Math.random() - 0.5) * 35;
    dustPositions[i3 + 2] = (Math.random() - 0.5) * 20 + 5;
  }
  const dustGeometry = new THREE.BufferGeometry();
  dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
  const dustMaterial = new THREE.PointsMaterial({
    size: 0.08,
    color: 0x56e5ff,
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending,
  });
  const orbitalDust = new THREE.Points(dustGeometry, dustMaterial);
  scene.add(orbitalDust);

  // ====================================================
  // 2. CINEMATIC EARTH HORIZON WITH ATMOSPHERIC GLOW
  // ====================================================
  const earthRadius = 52;
  const earthGeometry = new THREE.SphereGeometry(earthRadius, 64, 48);

  // Realistic deep navy orbital body with dark specular finish
  const earthMaterial = new THREE.MeshPhongMaterial({
    color: 0x050a18,
    emissive: 0x02050e,
    specular: 0x368bff,
    shininess: 25,
  });

  const earth = new THREE.Mesh(earthGeometry, earthMaterial);
  // Positioned so the curved northern limb sweeps across the bottom-right
  earth.position.set(4, -50, -4);
  scene.add(earth);

  // Atmospheric Rim Glow Layer
  const atmosphereRadius = earthRadius + 0.65;
  const atmosphereGeometry = new THREE.SphereGeometry(atmosphereRadius, 64, 48);
  const atmosphereMaterial = new THREE.MeshLambertMaterial({
    color: 0x368bff,
    emissive: 0x56e5ff,
    transparent: true,
    opacity: 0.22,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
  });
  const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
  atmosphere.position.copy(earth.position);
  scene.add(atmosphere);

  // ====================================================
  // 3. REALISTIC 3D ORBITAL SATELLITE STATION
  // ====================================================
  const satellite = new THREE.Group();

  // Central Avionics Body
  const busGeo = new THREE.BoxGeometry(2.0, 1.2, 1.2);
  const busMat = new THREE.MeshStandardMaterial({
    color: 0x162238,
    metalness: 0.85,
    roughness: 0.25,
  });
  const busMesh = new THREE.Mesh(busGeo, busMat);
  satellite.add(busMesh);

  // Gold Thermal Foil Detail Panel on front
  const foilGeo = new THREE.PlaneGeometry(1.6, 0.9);
  const foilMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    metalness: 0.95,
    roughness: 0.15,
  });
  const foilMesh = new THREE.Mesh(foilGeo, foilMat);
  foilMesh.position.set(0, 0, 0.61);
  satellite.add(foilMesh);

  // Solar Array Trusses
  const trussMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.9, roughness: 0.3 });
  const leftTrussGeo = new THREE.CylinderGeometry(0.06, 0.06, 2.2, 8);
  const leftTruss = new THREE.Mesh(leftTrussGeo, trussMat);
  leftTruss.rotation.z = Math.PI / 2;
  leftTruss.position.set(-1.8, 0, 0);
  satellite.add(leftTruss);

  const rightTruss = leftTruss.clone();
  rightTruss.position.set(1.8, 0, 0);
  satellite.add(rightTruss);

  // Dual High-Efficiency Solar Panel Wings (Photovoltaic Blue-Black)
  const solarPanelGeo = new THREE.BoxGeometry(3.2, 1.3, 0.04);
  const solarPanelMat = new THREE.MeshStandardMaterial({
    color: 0x071b30,
    emissive: 0x0e3a66,
    metalness: 0.6,
    roughness: 0.2,
  });

  const leftWing = new THREE.Mesh(solarPanelGeo, solarPanelMat);
  leftWing.position.set(-4.2, 0, 0);
  leftWing.rotation.x = 0.2;
  satellite.add(leftWing);

  const rightWing = new THREE.Mesh(solarPanelGeo, solarPanelMat);
  rightWing.position.set(4.2, 0, 0);
  rightWing.rotation.x = 0.2;
  satellite.add(rightWing);

  // High-Gain Parabolic Dish Antenna
  const dishGeo = new THREE.ConeGeometry(0.85, 0.35, 24, 1, true);
  const dishMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    metalness: 0.9,
    roughness: 0.2,
    side: THREE.DoubleSide,
  });
  const dish = new THREE.Mesh(dishGeo, dishMat);
  dish.rotation.x = -Math.PI / 2.8;
  dish.rotation.z = 0.4;
  dish.position.set(0, 1.1, 0.3);
  satellite.add(dish);

  // Dish Feed Horn Mast
  const hornGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.7, 8);
  const horn = new THREE.Mesh(hornGeo, trussMat);
  horn.rotation.x = -Math.PI / 2.8;
  horn.position.set(0, 1.45, 0.5);
  satellite.add(horn);

  // Pulsing Optical Telemetry Beacon
  const beaconGeo = new THREE.SphereGeometry(0.12, 16, 16);
  const beaconMat = new THREE.MeshBasicMaterial({ color: 0x56e5ff });
  const beacon = new THREE.Mesh(beaconGeo, beaconMat);
  beacon.position.set(0, -0.7, 0.5);
  satellite.add(beacon);

  const beaconLight = new THREE.PointLight(0x56e5ff, 1.5, 6);
  beaconLight.position.copy(beacon.position);
  satellite.add(beaconLight);

  // Position satellite in the upper-right orbital field
  satellite.position.set(11, 4.5, 6);
  satellite.rotation.set(-0.35, 0.55, -0.2);
  scene.add(satellite);

  // ====================================================
  // 4. INTERACTION, PARALLAX & ANIMATION LOOP
  // ====================================================
  let mouseX = 0;
  let mouseY = 0;
  let targetCamX = 0;
  let targetCamY = 2;

  const handleMouseMove = (e: MouseEvent) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    targetCamX = mouseX * 2.8;
    targetCamY = 2 - mouseY * 1.8;
  };
  window.addEventListener('mousemove', handleMouseMove, { passive: true });

  let animationFrameId: number;
  let isPaused = false;
  let clock = new THREE.Clock();

  const animate = () => {
    if (!isPaused && renderer) {
      const elapsed = clock.getElapsedTime();

      // Slow orbital drift
      starfield.rotation.y = elapsed * 0.008;
      starfield.rotation.x = elapsed * 0.003;

      orbitalDust.rotation.y = elapsed * 0.015;
      orbitalDust.position.y = Math.sin(elapsed * 0.5) * 0.4;

      // Earth slow planetary rotation
      earth.rotation.y = elapsed * 0.004;
      atmosphere.rotation.y = elapsed * 0.004;

      // Satellite attitude adjustments & majestic orbital roll
      satellite.rotation.y = 0.55 + Math.sin(elapsed * 0.3) * 0.08;
      satellite.rotation.x = -0.35 + Math.cos(elapsed * 0.25) * 0.06;
      satellite.position.y = 4.5 + Math.sin(elapsed * 0.4) * 0.35;

      // Telemetry beacon pulse
      const pulse = Math.sin(elapsed * 4.0);
      beaconMat.color.setHex(pulse > 0 ? 0x56e5ff : 0x368bff);
      beaconLight.intensity = Math.max(0.4, (pulse + 1) * 1.2);

      // Smooth camera dampening (cinematic feel)
      camera.position.x += (targetCamX - camera.position.x) * 0.04;
      camera.position.y += (targetCamY - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }
    animationFrameId = requestAnimationFrame(animate);
  };

  const handleVisibilityChange = () => {
    isPaused = document.visibilityState === 'hidden';
  };
  document.addEventListener('visibilitychange', handleVisibilityChange);

  const handleResize = () => {
    if (!renderer || !container) return;
    const newWidth = container.clientWidth || window.innerWidth;
    const newHeight = container.clientHeight || 650;
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

    starGeometry.dispose();
    starMaterial.dispose();
    dustGeometry.dispose();
    dustMaterial.dispose();
    earthGeometry.dispose();
    earthMaterial.dispose();
    atmosphereGeometry.dispose();
    atmosphereMaterial.dispose();
    busGeo.dispose();
    busMat.dispose();
    foilGeo.dispose();
    foilMat.dispose();
    leftTrussGeo.dispose();
    trussMat.dispose();
    solarPanelGeo.dispose();
    solarPanelMat.dispose();
    dishGeo.dispose();
    dishMat.dispose();
    hornGeo.dispose();
    beaconGeo.dispose();
    beaconMat.dispose();

    if (renderer) {
      renderer.dispose();
      renderer.forceContextLoss();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    }
  };
}
