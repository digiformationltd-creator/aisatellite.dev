import * as THREE from 'three';
import { type TechnologyResource } from '../../lib/radar/schemas';

export interface RadarSceneConfig {
  container: HTMLElement;
  resources: TechnologyResource[];
  onSelectResource?: (resource: TechnologyResource) => void;
}

export class TechnologyRadar3D {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private animFrameId: number | null = null;
  private sweepLine!: THREE.Line;
  private nodeMeshes: THREE.Mesh[] = [];
  private resources: TechnologyResource[] = [];
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2(-100, -100);
  private onSelectResource?: (resource: TechnologyResource) => void;
  private isDisposed = false;

  constructor(config: RadarSceneConfig) {
    this.container = config.container;
    this.resources = config.resources;
    this.onSelectResource = config.onSelectResource;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x03050b, 0.003);

    const width = this.container.clientWidth || 800;
    const height = this.container.clientHeight || 500;

    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    this.camera.position.set(0, 180, 220);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    this.initRadarElements();
    this.initTechnologyNodes();
    this.bindEvents();
    this.animate();
  }

  private initRadarElements() {
    // 1. Concentric Range Rings
    const ringRadii = [40, 80, 120, 160];
    ringRadii.forEach((r, idx) => {
      const ringGeo = new THREE.RingGeometry(r - 0.5, r, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: idx === ringRadii.length - 1 ? 0x56e5ff : 0x101a2d,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: idx === ringRadii.length - 1 ? 0.4 : 0.25,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      this.scene.add(ringMesh);
    });

    // 2. Crosshair Grid Lines
    const gridHelper = new THREE.PolarGridHelper(160, 8, 4, 64, 0x56e5ff, 0x1e2c45);
    gridHelper.position.y = -0.1;
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.35;
    this.scene.add(gridHelper);

    // 3. Rotating Sweep Line
    const sweepGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0.5, 0),
      new THREE.Vector3(160, 0.5, 0),
    ]);
    const sweepMat = new THREE.LineBasicMaterial({
      color: 0x56e5ff,
      transparent: true,
      opacity: 0.8,
    });
    this.sweepLine = new THREE.Line(sweepGeo, sweepMat);
    this.scene.add(this.sweepLine);
  }

  private initTechnologyNodes() {
    const sphereGeo = new THREE.SphereGeometry(3, 16, 16);

    this.resources.forEach((res, index) => {
      // Determine radius and angle based on category & index
      const angle = (index / Math.max(1, this.resources.length)) * Math.PI * 2;
      const radius = 50 + (index % 4) * 28;

      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = Math.sin(index) * 8;

      const isVerified = res.verificationStatus === 'verified';
      const nodeMat = new THREE.MeshBasicMaterial({
        color: isVerified ? 0x56e5ff : 0x9875ff,
      });

      const nodeMesh = new THREE.Mesh(sphereGeo, nodeMat);
      nodeMesh.position.set(x, y, z);
      nodeMesh.userData = { resource: res };

      this.scene.add(nodeMesh);
      this.nodeMeshes.push(nodeMesh);
    });
  }

  private bindEvents() {
    window.addEventListener('resize', this.onResize);
    this.container.addEventListener('mousemove', this.onMouseMove);
    this.container.addEventListener('click', this.onClick);
  }

  private onResize = () => {
    if (this.isDisposed) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    if (width === 0 || height === 0) return;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  private onMouseMove = (e: MouseEvent) => {
    const rect = this.container.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  };

  private onClick = () => {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.nodeMeshes);
    if (intersects.length > 0 && this.onSelectResource) {
      const selected = intersects[0].object.userData.resource as TechnologyResource;
      this.onSelectResource(selected);
    }
  };

  private animate = () => {
    if (this.isDisposed) return;

    // Rotate sweep line
    if (this.sweepLine) {
      this.sweepLine.rotation.y += 0.015;
    }

    // Pulse nodes gently
    const time = Date.now() * 0.002;
    this.nodeMeshes.forEach((mesh, idx) => {
      const scale = 1 + Math.sin(time + idx) * 0.15;
      mesh.scale.set(scale, scale, scale);
    });

    this.renderer.render(this.scene, this.camera);
    this.animFrameId = requestAnimationFrame(this.animate);
  };

  public dispose() {
    this.isDisposed = true;
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    window.removeEventListener('resize', this.onResize);
    this.container.removeEventListener('mousemove', this.onMouseMove);
    this.container.removeEventListener('click', this.onClick);

    this.nodeMeshes.forEach((m) => {
      m.geometry.dispose();
      (m.material as THREE.Material).dispose();
    });
    this.renderer.dispose();
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
