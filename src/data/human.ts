export const NOW_DATA = {
  updated: '2026-09',
  focus: 'Finishing the portfolio rebuild; studying transformer architectures from first principles; reducing notification surface area.',
  learning: [
    'Attention mechanisms without frameworks',
    'Rust for systems-level tooling',
    'Shader composition in GLSL',
  ],
  building: [
    'This portfolio (React + TS + Vite + Tailwind)',
    'A tiny CLI for generating project scaffolding',
    'Hand-tracking drawing experiment (OpenCV → Web port)',
  ],
  listening: [
    'Nils Frahm — All Melody',
    'Jon Hopkins — Music for Psychedelic Therapy',
    'Hiroshi Yoshimura — Green',
  ],
  reading: [
    'Attention Is All You Need (re-read)',
    'Designing Data-Intensive Applications — Martin Kleppmann',
    'The Art of Doing Science and Engineering — Hamming',
  ],
  health: 'Morning walks, 7h sleep target, phone greyscale after 21:00',
  location: 'Coimbatore, Tamil Nadu',
};

export const USES_DATA = {
  hardware: [
    { name: 'Laptop', spec: 'MacBook Air M2, 16GB, 512GB — daily driver' },
    { name: 'External', spec: 'LG 27" 4K USB-C, Ergo arm' },
    { name: 'Keyboard', spec: 'Keychron K3 v2 (low-profile Gateron Red)' },
    { name: 'Mouse', spec: 'Logitech MX Master 3S' },
    { name: 'Audio', spec: 'Sony WH-1000XM5 + Audio-Technica ATH-M50x' },
    { name: 'Phone', spec: 'iPhone 15 Pro, greyscale + focus modes' },
  ],
  editor: {
    name: 'VS Code (Insiders)',
    extensions: [
      'GitHub Copilot',
      'ESLint + Prettier',
      'Tailwind CSS IntelliSense',
      'Error Lens',
      'GitLens',
      'Indent Rainbow',
      'Todo Tree',
    ],
    theme: 'Tokyo Night Storm (custom accent)',
    font: 'JetBrains Mono, ligatures on, 13.5pt, line height 1.6',
  },
  terminal: {
    shell: 'zsh + Oh My Zsh',
    prompt: 'Starship (minimal, git + node + rust + time)',
    tools: ['eza', 'bat', 'fd', 'ripgrep', 'fzf', 'zoxide', 'gh', 'lazygit'],
  },
  languages: {
    daily: ['TypeScript', 'Python', 'SQL'],
    exploring: ['Rust', 'Go', 'GLSL'],
    comfortable: ['Java', 'JavaScript', 'HTML/CSS'],
  },
  workflow: [
    'Trunk-based dev, small PRs, conventional commits',
    'Local-first: sqlite for prototypes, pg for real things',
    'Figma → code (auto-layout → flex/grid)',
    'Notion for project notes, Obsidian for learning logs',
    'Raycast for everything (clipboard, snippets, window mgmt)',
  ],
  design: ['Figma (free tier)', 'Excalidraw for architecture sketches', 'svg.guide for path debugging'],
  hosting: ['Vercel (static)', 'Railway (small services)', 'Cloudflare Pages (experiments)'],
  databases: ['PostgreSQL (prod)', 'SQLite (local)', 'DuckDB (analytics)'],
  monitoring: ['Sentry (errors)', 'Plausible (privacy analytics)', 'UptimeRobot'],
};

export const WRITING_DATA = [
  {
    slug: 'attention-from-scratch',
    title: 'Attention from Scratch: NumPy Implementation Notes',
    date: '2026-08-15',
    excerpt: 'Walking through the attention matrix step by step — shapes, masks, and why scaled dot-product works. No framework, just arrays.',
    tags: ['ML', 'Python', 'Learning'],
    readingTime: '12 min',
    status: 'published',
  },
  {
    slug: 'portfolio-architecture',
    title: 'Portfolio Architecture: Content-First, Art-Driven',
    date: '2026-09-01',
    excerpt: 'How I separated data from presentation, built generative artwork in SVG, and kept the bundle small with route-level splitting.',
    tags: ['React', 'TypeScript', 'Design Systems'],
    readingTime: '8 min',
    status: 'published',
  },
  {
    slug: 'hand-tracking-web',
    title: 'Porting OpenCV Hand Tracking to the Browser',
    date: '2026-07-20',
    excerpt: 'MediaPipe Hands + WebGL canvas — latency, coordinate spaces, and making it feel like a native drawing tool.',
    tags: ['Computer Vision', 'WebGL', 'MediaPipe'],
    readingTime: '15 min',
    status: 'draft',
  },
  {
    slug: 'sql-window-functions',
    title: 'Window Functions I Wish I Knew Earlier',
    date: '2026-06-10',
    excerpt: 'ROW_NUMBER, LAG/LEAD, NTILE, and frame clauses — practical patterns for analytics dashboards.',
    tags: ['SQL', 'Data Analytics'],
    readingTime: '6 min',
    status: 'published',
  },
];

export const READING_DATA = {
  books: [
    { title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', status: 'reading', progress: 0.62, rating: null, note: 'The bible for systems thinking.' },
    { title: 'The Art of Doing Science and Engineering', author: 'Richard Hamming', status: 'reading', progress: 0.34, rating: null, note: 'You and your research.' },
    { title: 'Attention Is All You Need', author: 'Vaswani et al.', status: 're-reading', progress: 1.0, rating: 5, note: 'Every pass reveals something new.' },
    { title: 'Clean Architecture', author: 'Robert C. Martin', status: 'finished', progress: 1.0, rating: 4, note: 'Good principles, dogmatic in places.' },
    { title: 'Staff Engineer', author: 'Will Larson', status: 'queue', progress: 0.0, rating: null, note: 'For the path ahead.' },
  ],
  papers: [
    { title: 'Attention Is All You Need', authors: 'Vaswani et al.', year: 2017, status: 'studied', link: '[ADD LINK]' },
    { title: 'BERT: Pre-training of Deep Bidirectional Transformers', authors: 'Devlin et al.', year: 2018, status: 'read', link: '[ADD LINK]' },
    { title: 'Scaling Laws for Neural Language Models', authors: 'Kaplan et al.', year: 2020, status: 'skimmed', link: '[ADD LINK]' },
    { title: 'LoRA: Low-Rank Adaptation of Large Language Models', authors: 'Hu et al.', year: 2021, status: 'read', link: '[ADD LINK]' },
  ],
  resources: [
    { name: 'The Illustrated Transformer', type: 'Visual guide', link: '[ADD LINK]' },
    { name: 'Stanford CS231n (2023)', type: 'Course', link: '[ADD LINK]' },
    { name: 'MLOps Community', type: 'Community', link: '[ADD LINK]' },
    { name: 'Papers with Code', type: 'Paper + code index', link: '[ADD LINK]' },
  ],
};