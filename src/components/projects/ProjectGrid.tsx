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
    <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
      <AnimatePresence>
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            className={index === 0 ? 'md:col-span-2' : ''}
            layout
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25 }}
          >
            <ProjectCard project={project} featured={project.featured} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};
