import React, { useState, useMemo } from 'react';
import { PageTransition } from '@/components/ui/PageTransition';
import { ProjectFilters, CATEGORIES } from '@/components/projects/ProjectFilters';
import type { CategoryFilter } from '@/components/projects/ProjectFilters';
import { ProjectGrid } from '@/components/projects/ProjectGrid';
import { PROJECTS } from '@/data/projects';
import { PageMasthead } from '@/components/ui/PageMasthead';
import { Coverflow3D } from '@/components/three/Coverflow3D';
import { PAGE_ARTWORK } from '@/data/artwork';
import { PacketOrbit3D } from '@/components/three/PacketOrbit3D';

export const Projects: React.FC = () => {
  const [currentFilter, setCurrentFilter] = useState<CategoryFilter>('ALL');

  // Compute count of projects per filter category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      ALL: PROJECTS.length
    };

    CATEGORIES.forEach((cat) => {
      if (cat === 'ALL') return;
      counts[cat] = PROJECTS.filter((p) => {
        if (cat === 'AI') return p.categories.includes('AI');
        if (cat === 'COMPUTER VISION') return p.categories.includes('Computer Vision');
        if (cat === 'DATA') return p.categories.includes('Data');
        if (cat === 'WEB') return p.categories.includes('Web');
        if (cat === 'EXPERIMENTS') return p.categories.includes('Experiments');
        return false;
      }).length;
    });

    return counts;
  }, []);

  // Filter projects list
  const filteredProjects = useMemo(() => {
    if (currentFilter === 'ALL') return PROJECTS;
    return PROJECTS.filter((p) => {
      if (currentFilter === 'AI') return p.categories.includes('AI');
      if (currentFilter === 'COMPUTER VISION') return p.categories.includes('Computer Vision');
      if (currentFilter === 'DATA') return p.categories.includes('Data');
      if (currentFilter === 'WEB') return p.categories.includes('Web');
      if (currentFilter === 'EXPERIMENTS') return p.categories.includes('Experiments');
      return true;
    });
  }, [currentFilter]);

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-14 sm:space-y-20">
        <PageMasthead number="01" eyebrow="Selected work" title="PROJECT GALLERY" description="A focused collection of practical work across artificial intelligence, computer vision, data and interface development." artwork={PAGE_ARTWORK.projects} artworkLabel="Systems / signals / surfaces" />

        <section aria-label="Featured coverflow">
          <div className="eyebrow-rule mb-5">Drag through the work</div>
          <Coverflow3D projects={PROJECTS} />
        </section>

        <section aria-label="Work in orbit" className="studio-panel rounded-xl p-6 sm:p-8">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
            <div>
              <div className="eyebrow-rule">Signal hub / live</div>
              <h2 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-[var(--text-primary)] sm:text-3xl">
                Work in orbit.
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--text-muted)]">
                Every project is a satellite in the same system — capture, process, transmit.
                The orbit below is live; drag it to spin the fleet.
              </p>
            </div>
            <PacketOrbit3D />
          </div>
        </section>

        <section aria-label="Project collection">
          <div className="eyebrow-rule mb-5">Filter the collection</div>
          <ProjectFilters currentFilter={currentFilter} onFilterChange={setCurrentFilter} counts={categoryCounts} />

          <ProjectGrid projects={filteredProjects} />
        </section>
      </div>
    </PageTransition>
  );
};
