import React from 'react';
import { Download, GraduationCap, Briefcase, Award, Code2, CheckCircle2, FileText } from 'lucide-react';
import { PageTransition } from '../components/ui/PageTransition';
import { RESUME_DATA } from '../data/resume';
import { EXPERIENCES } from '../data/experience';
import { PROJECTS } from '../data/projects';
import { PageMasthead } from '../components/ui/PageMasthead';
import gestureOrbit from '../assets/gesture-orbit.svg';

export const Resume: React.FC = () => {
  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16 sm:space-y-24">
        <PageMasthead number="01" eyebrow="Resume" title="WEB RESUME" description="A concise, web-native version of Rahul R's supplied resume." artwork={gestureOrbit} artworkLabel="Skills / projects / experience"><span className="inline-flex items-center gap-2 px-5 py-3 border border-[var(--border-color)] font-mono text-sm text-[var(--text-muted)]"><Download className="w-4 h-4" /> DOWNLOAD CV [ADD UPDATED CV]</span></PageMasthead>

        {/* 01 / PROFILE */}
        <section className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-8 rounded-lg space-y-4">
          <h3 className="font-mono text-xs text-[var(--accent-color)] font-bold tracking-widest uppercase flex items-center gap-2">
            <FileText className="w-4 h-4" />
            01 / PROFILE
          </h3>
          <h2 className="text-3xl font-bold font-display text-[var(--text-primary)]">
            RAHUL R
          </h2>
          <div className="font-mono text-sm text-[var(--accent-color)] font-bold">
            B.Tech Artificial Intelligence & Data Science
          </div>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-3xl">
            Interested in artificial intelligence, data analytics, computer vision and software interfaces. The projects and experience below reflect the supplied resume.
          </p>
        </section>

        {/* 02 / EDUCATION */}
        <section className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-8 rounded-lg space-y-4">
          <h3 className="font-mono text-xs text-[var(--accent-color)] font-bold tracking-widest uppercase flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            02 / EDUCATION
          </h3>

          <div className="space-y-2 pt-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-xl font-bold font-display text-[var(--text-primary)]">
                {RESUME_DATA.education.degree}
              </h4>
              <span className="font-mono text-xs text-[var(--accent-color)] font-bold px-3 py-1 bg-[var(--accent-glow)] border border-[var(--accent-color)]/30 rounded">
                {RESUME_DATA.education.period}
              </span>
            </div>

            <div className="text-sm text-[var(--text-muted)]">
              {RESUME_DATA.education.institution}
            </div>

            <div className="font-mono text-sm text-[var(--accent-color)] font-bold pt-2">
              CGPA: {RESUME_DATA.education.cgpa}
            </div>
          </div>
        </section>

        {/* 03 / EXPERIENCE */}
        <section className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-8 rounded-lg space-y-6">
          <h3 className="font-mono text-xs text-[var(--accent-color)] font-bold tracking-widest uppercase flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            03 / EXPERIENCE
          </h3>

          <div className="space-y-8">
            {EXPERIENCES.map((exp) => (
              <div key={exp.id} className="border-b border-[var(--border-color)] pb-6 last:border-0 last:pb-0 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-lg font-bold font-display text-[var(--text-primary)]">
                    {exp.company} — <span className="text-[var(--accent-color)]">{exp.role}</span>
                  </h4>
                  <span className="font-mono text-xs text-[var(--text-muted)]">{exp.period}</span>
                </div>
                <ul className="space-y-1.5 pt-1">
                  {exp.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 font-mono text-xs text-[var(--text-muted)]">
                      <span className="text-[var(--accent-color)] font-bold">•</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* 04 / PROJECTS */}
        <section className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-8 rounded-lg space-y-6">
          <h3 className="font-mono text-xs text-[var(--accent-color)] font-bold tracking-widest uppercase flex items-center gap-2">
            <Code2 className="w-4 h-4" />
            04 / FEATURED PROJECTS
          </h3>

          <div className="space-y-6">
            {PROJECTS.map((proj) => (
              <div key={proj.id} className="border-b border-[var(--border-color)] pb-4 last:border-0 last:pb-0 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-base font-bold font-display text-[var(--text-primary)]">
                    {proj.title} {proj.badge && <span className="text-amber-400 font-mono text-xs font-normal">({proj.badge})</span>}
                  </h4>
                  <span className="font-mono text-xs text-[var(--text-muted)]">{proj.year}</span>
                </div>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  {proj.shortDescription}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 05 / SKILLS */}
        <section className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-8 rounded-lg space-y-6">
          <h3 className="font-mono text-xs text-[var(--accent-color)] font-bold tracking-widest uppercase flex items-center gap-2">
            <Code2 className="w-4 h-4" />
            05 / TECHNICAL SKILLS
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            <div>
              <div className="text-[var(--text-muted)] uppercase mb-2">Languages:</div>
              <div className="flex flex-wrap gap-1.5">
                {RESUME_DATA.skills.programming.map((s) => (
                  <span key={s} className="px-2.5 py-1 bg-[var(--bg-surface-secondary)] border border-[var(--border-color)] text-[var(--text-primary)]">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[var(--text-muted)] uppercase mb-2">Data & AI:</div>
              <div className="flex flex-wrap gap-1.5">
                {RESUME_DATA.skills.dataAndAi.map((s) => (
                  <span key={s} className="px-2.5 py-1 bg-[var(--bg-surface-secondary)] border border-[var(--border-color)] text-[var(--text-primary)]">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[var(--text-muted)] uppercase mb-2">Tools & Integration:</div>
              <div className="flex flex-wrap gap-1.5">
                {RESUME_DATA.skills.toolsAndDev.map((s) => (
                  <span key={s} className="px-2.5 py-1 bg-[var(--bg-surface-secondary)] border border-[var(--border-color)] text-[var(--text-primary)]">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 06 / CERTIFICATIONS */}
        <section className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-8 rounded-lg space-y-6">
          <h3 className="font-mono text-xs text-[var(--accent-color)] font-bold tracking-widest uppercase flex items-center gap-2">
            <Award className="w-4 h-4" />
            06 / CERTIFICATIONS
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            {RESUME_DATA.certifications.map((cert) => (
              <div
                key={cert.title}
                className="p-4 bg-[var(--bg-surface-secondary)] border border-[var(--border-color)] rounded flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-[var(--text-primary)]">{cert.title}</div>
                  <div className="text-[var(--text-muted)] text-[10px] uppercase mt-0.5">{cert.issuer}</div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-[var(--accent-color)]" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </PageTransition>
  );
};
