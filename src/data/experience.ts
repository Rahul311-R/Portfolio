import type { ExperienceItem } from '../types/project';

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: 'accenture',
    company: 'ACCENTURE',
    role: 'Data Analytics Intern',
    period: 'September 2024',
    location: 'Remote / Virtual Internship',
    summary: 'Analyzed multi-source enterprise datasets to discover operational patterns, optimize reporting workflows, and deliver actionable business recommendations.',
    highlights: [
      'Analyzed 3+ enterprise datasets using advanced Excel analytics and Power BI modeling.',
      'Reduced manual reporting effort by approximately 30% through automated dashboard templates.',
      'Contributed data-driven insights and interactive visualizations for process improvement strategies.'
    ],
    skills: ['Data Analytics', 'Power BI', 'Excel', 'Data Visualization', 'Process Optimization'],
    badge: 'Enterprise Analytics'
  },
  {
    id: 'vault-of-code',
    company: 'VAULT OF CODE',
    role: 'Web Development Intern',
    period: 'September 2024 – October 2024',
    location: 'Remote Internship',
    summary: 'Built and styled modern, responsive web application interfaces using a mobile-first philosophy and collaborative version control.',
    highlights: [
      'Developed 5+ responsive web pages with mobile-first layouts and optimized cross-browser styling.',
      'Collaborated on 15+ repository commits following Git-based feature branching workflows.',
      'Achieved a UI bug resolution improvement of 20% by identifying layout breaks and performance bottlenecks.'
    ],
    skills: ['Web Development', 'HTML/CSS/JS', 'Git Workflow', 'Mobile-First Design', 'UI Optimization'],
    badge: 'Frontend Engineering'
  },
  {
    id: 'tata',
    company: 'TATA',
    role: 'Data Visualization Trainee',
    period: '2024',
    location: 'Trainee Program',
    summary: 'Completed structured professional training in data processing, visual storytelling, and business intelligence techniques.',
    highlights: [
      'Engaged in structured training covering data processing techniques and business intelligence toolsets.',
      'Applied key visualization principles to build clean mock BI dashboards for executive decision scenarios.',
      'Formulated data presentation frameworks emphasizing clarity, metric hierarchy, and user accessibility.'
    ],
    skills: ['Data Visualization', 'Business Intelligence', 'Data Modeling', 'Dashboard Design'],
    badge: 'BI & Storytelling'
  }
];
