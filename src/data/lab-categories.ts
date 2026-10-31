export interface LabCategoryMeta {
  id: string;
  name: string;
  slug: string;
  description: string;
  demoCount: number;
}

export const LAB_CATEGORIES: LabCategoryMeta[] = [
  {
    id: 'threejs',
    name: 'Three.js & WebGL',
    slug: 'threejs',
    description: 'Hardware-accelerated 3D scene graphs, particle geometries, and dynamic mesh renderers.',
    demoCount: 5,
  },
  {
    id: 'shaders',
    name: 'GLSL Shaders',
    slug: 'shaders',
    description: 'Hardware-calculated procedural fragment and vertex shaders running at 60fps.',
    demoCount: 2,
  },
  {
    id: 'scroll-effects',
    name: 'Scroll Storytelling',
    slug: 'scroll-effects',
    description: 'Cinematic camera interpolation, parallax progression, and section choreography.',
    demoCount: 1,
  },
  {
    id: 'templates',
    name: 'Production Templates',
    slug: 'templates',
    description: 'Drop-in Astro and React visual components with responsive canvas sizing.',
    demoCount: 4,
  },
  {
    id: 'react-three-fiber',
    name: 'React Three Fiber',
    slug: 'react-three-fiber',
    description: 'Declarative component wrappers for Three.js stateful islands.',
    demoCount: 2,
  },
  {
    id: 'prompts',
    name: '3D AI Prompts',
    slug: 'prompts',
    description: 'Battle-tested prompts for generating customized Three.js shaders and models with AI tools.',
    demoCount: 6,
  },
];
