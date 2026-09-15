import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const routeMeta = {
  '/': {
    title: 'RAHUL R | AI × DATA × CODE — Personal Portfolio & Digital Laboratory',
    description:
      'Personal portfolio and creative coding digital laboratory for Rahul R. Exploring AI, computer vision, data analytics, and interactive interfaces.',
  },
  '/about': {
    title: 'About | RAHUL R',
    description: 'Learn about Rahul R, his journey, interests, and the ideas that shape his work across AI, data, and interface design.',
  },
  '/projects': {
    title: 'Projects | RAHUL R',
    description: 'Explore Rahul R’s selected case studies, product-minded experiments, and practical work across AI, computer vision, and data.',
  },
  '/experience': {
    title: 'Experience | RAHUL R',
    description: 'Review Rahul R’s experience timeline, internship highlights, and the technical work that shaped his engineering path.',
  },
  '/resume': {
    title: 'Resume | RAHUL R',
    description: 'View Rahul R’s resume overview, technical strengths, and skill profile across AI, data, and software engineering.',
  },
  '/lab': {
    title: 'Lab | RAHUL R',
    description: 'Dive into Rahul R’s creative coding experiments, data visualisation studies, and interactive workbench projects.',
  },
  '/contact': {
    title: 'Contact | RAHUL R',
    description: 'Get in touch with Rahul R for collaborations, opportunities, and ideas related to AI, data, and interface engineering.',
  },
  '/now': {
    title: 'Now | RAHUL R',
    description: 'See Rahul R’s current focus, what he is learning, and what he is building right now.',
  },
  '/uses': {
    title: 'Uses | RAHUL R',
    description: 'Browse Rahul R’s setup, tools, workspace, and workflow choices across software, hardware, and creative development.',
  },
  '/writing': {
    title: 'Writing | RAHUL R',
    description: 'Read Rahul R’s writing on AI, data, design systems, engineering process, and practical learning notes.',
  },
  '/reading': {
    title: 'Reading | RAHUL R',
    description: 'Browse Rahul R’s reading list, studied papers, and resource notes on AI, systems thinking, and design.',
  },
};

export const PageMeta: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    const meta = path.startsWith('/projects/') ? routeMeta['/projects'] : routeMeta[path as keyof typeof routeMeta] ?? routeMeta['/'];

    document.title = meta.title;

    const description = document.head.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (description) {
      description.setAttribute('content', meta.description);
    }

    const ogTitle = document.head.querySelector('meta[property="og:title"]') as HTMLMetaElement | null;
    const ogDescription = document.head.querySelector('meta[property="og:description"]') as HTMLMetaElement | null;
    const twitterTitle = document.head.querySelector('meta[name="twitter:title"]') as HTMLMetaElement | null;
    const twitterDescription = document.head.querySelector('meta[name="twitter:description"]') as HTMLMetaElement | null;

    if (ogTitle) ogTitle.setAttribute('content', meta.title);
    if (ogDescription) ogDescription.setAttribute('content', meta.description);
    if (twitterTitle) twitterTitle.setAttribute('content', meta.title);
    if (twitterDescription) twitterDescription.setAttribute('content', meta.description);
  }, [location.pathname]);

  return null;
};
