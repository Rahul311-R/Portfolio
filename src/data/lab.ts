import type { LabExperimentItem } from '../types/project';

export const LAB_EXPERIMENTS: LabExperimentItem[] = [
  {
    id: 'particle-field',
    title: 'Gravitational Particle Simulator',
    category: 'Canvas Physics / Interactive',
    description: 'An interactive HTML5 Canvas simulation with dynamic node connections, mouse gravitational attractors, and velocity decay vectors.',
    technologies: ['HTML5 Canvas', 'TypeScript', 'Physics Vectors', 'Kinetic Math'],
    type: 'particle',
    disclaimer: 'Experimental / Personal Work'
  },
  {
    id: 'generative-typography',
    title: 'Kinetic Matrix Typography',
    category: 'Creative Coding / Text',
    description: 'Interactive canvas typography that deconstructs "RAHUL R" text into interactive particle waves responsive to cursor proximity.',
    technologies: ['Canvas API', 'Font Rasterization', 'Particle Motion', 'Easing Functions'],
    type: 'typography',
    disclaimer: 'Experimental / Personal Work'
  },
  {
    id: 'gesture-canvas',
    title: 'Spatial Canvas Sandbox',
    category: 'Computer Vision Sim / Drawing',
    description: 'A WebGL/Canvas gesture sandbox simulating hand-tracking spatial drawing with dynamic brush sizes, neon trails, and velocity smoothing.',
    technologies: ['Canvas API', 'Smoothing Math', 'Trail Buffering', 'RGB Palette'],
    type: 'drawing',
    disclaimer: 'Experimental / Personal Work'
  },
  {
    id: 'color-generator',
    title: 'Algorithmic Palette Harmonizer',
    category: 'Computational Design / Color',
    description: 'A mathematical color scheme generator calculating dark-mode accent harmonies, contrast ratios, and HSL matrix interpolation.',
    technologies: ['HSL Color Math', 'Contrast Algorithms', 'CSS Variables', 'Generative Rules'],
    type: 'color',
    disclaimer: 'Experimental / Personal Work'
  },
  {
    id: 'datavis-nodes',
    title: 'Neural Data Stream Graph',
    category: 'Data Vis / Recharts & Canvas',
    description: 'A dynamic multi-layered topological node map representing mock real-time telemetry processing streams with animated packet flow.',
    technologies: ['Graph Theory', 'Canvas Vector Engine', 'Real-time Simulation', 'Recharts'],
    type: 'datavis',
    disclaimer: 'Experimental / Personal Work'
  }
];
