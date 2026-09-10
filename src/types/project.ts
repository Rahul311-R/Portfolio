export interface Metric {
  label: string;
  value: string;
}

export interface ProjectSection {
  title: string;
  content: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  categories: ('AI' | 'Computer Vision' | 'Data' | 'Web' | 'Experiments' | 'IoT' | 'Road Safety')[];
  technologies: string[];
  year: string;
  featured: boolean;
  image?: string;
  githubUrl?: string;
  liveUrl?: string;
  badge?: string;
  metrics?: Metric[];
  sections: ProjectSection[];
  architecture?: {
    nodes: string[];
    description: string;
  };
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  location?: string;
  summary: string;
  highlights: string[];
  skills: string[];
  badge?: string;
}

export interface Certification {
  title: string;
  issuer: string;
  date?: string;
  credentialUrl?: string;
}

export interface LabExperimentItem {
  id: string;
  title: string;
  category: string;
  description: string;
  technologies: string[];
  type: 'particle' | 'typography' | 'drawing' | 'color' | 'datavis';
  disclaimer: string;
}
