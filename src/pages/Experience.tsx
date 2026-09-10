import React from 'react';
import { PageTransition } from '../components/ui/PageTransition';
import { ExperienceTimeline } from '../components/timeline/ExperienceTimeline';
import { MetricCard } from '../components/ui/MetricCard';
import { PageMasthead } from '../components/ui/PageMasthead';
import gestureOrbit from '../assets/gesture-orbit.svg';

export const Experience: React.FC = () => {
  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16 sm:space-y-24">
        <PageMasthead number="01" eyebrow="Timeline" title="EXPERIENCE" description="Internships and structured training in data analytics, web development and visualisation from the supplied resume." artwork={gestureOrbit} artworkLabel="Learning / making / iterating" />

        {/* Factual Highlights Snapshot Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricCard
            label="Accenture Internship"
            value="~30%"
            sublabel="Reporting Effort Reduced via Automation"
          />
          <MetricCard
            label="Vault of Code Internship"
            value="20%"
            sublabel="UI Bug Resolution Efficiency Improvement"
          />
          <MetricCard label="TATA Training" value="2024" sublabel="Data processing and BI tools" />
        </div>

        <div className="pt-2">
          <h3 className="font-mono text-xs text-[var(--accent-color)] uppercase font-bold tracking-widest mb-8">
            // CAREER CHRONOLOGY
          </h3>
          <ExperienceTimeline />
        </div>
      </div>
    </PageTransition>
  );
};
