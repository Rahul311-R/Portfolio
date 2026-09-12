import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Project } from '../../types/project';
import { ProjectCard } from './ProjectCard';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface ProjectGridProps {
  projects: Project[];
}

export const ProjectGrid: React.FC<ProjectGridProps> = ({ projects }) => {
  const reducedMotion = useReducedMotion();

  if (projects.length === 0) {
    return (
      <div className="p-12 bg-[var(--bg-surface-secondary)] border border-[var(--border-color)] text-center font-mono text-xs text-[var(--text-muted)]">
        NO PROJECTS MATCHING CURRENT FILTER SELECTION.
      </div>
    );
  }

  if (reducedMotion) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {projects.map((project, index) => (
          <div key={project.id} className={index === 0 ? 'md:col-span-2' : ''}>
            <ProjectCard project={project} featured={project.featured} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      layout
      className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
      style={{ perspective: '1400px' }}
    >
      <AnimatePresence>
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            className={index === 0 ? 'md:col-span-2' : ''}
            layout
            initial={{ opacity: 0, y: 56, rotateX: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, rotateX: 10, scale: 0.97 }}
            transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.2), ease: [0.2, 0.8, 0.2, 1] }}
            style={{ transformOrigin: 'center bottom' }}
          >
            <ProjectCard project={project} featured={project.featured} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};
