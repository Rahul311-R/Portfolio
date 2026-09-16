import type { Certification } from '@/types/project';

export const RESUME_DATA = {
  name: 'RAHUL R',
  title: 'AI × DATA × CODE',
  tagline: 'Building useful things with code.',
  education: {
    degree: 'B.Tech – Artificial Intelligence & Data Science',
    institution: 'V.S.B College of Engineering Technical Campus, Coimbatore',
    period: '2022–2026',
    cgpa: '8.3 / 10'
  },
  skills: {
    programming: ['Python', 'Java', 'SQL'],
    dataAndAi: ['Pandas', 'OpenCV', 'Matplotlib', 'Computer Vision', 'Data Analytics', 'Power BI'],
    toolsAndDev: ['MySQL', 'Figma', 'Git', 'API Integration', 'GUI Development']
  },
  certifications: [
    {
      title: 'Oracle Cloud Foundations',
      issuer: 'Oracle'
    },
    {
      title: 'UI/UX Design',
      issuer: 'IBM'
    },
    {
      title: 'Power BI Mastery',
      issuer: 'Udemy'
    },
    {
      title: 'Figma for Designers',
      issuer: 'Simplilearn'
    }
  ] as Certification[]
};
