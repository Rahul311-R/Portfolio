import React from 'react';
import { PageTransition } from '../components/ui/PageTransition';
import { PageMasthead } from '../components/ui/PageMasthead';
import { ScrollReveal, SplitText, Magnetic, Float } from '../components/ui/Animations';
import { RESUME_DATA } from '../data/resume';
import { GraduationCap, Terminal, MapPin, Heart, Music, BookOpen, Coffee, Camera, Gamepad2, Mountain, Sun, Moon } from 'lucide-react';
import weatherFlow from '../assets/weather-flow.svg';

const JOURNEY = [
  { year: '2022', title: 'Started B.Tech', detail: 'Joined V.S.B College of Engineering, Coimbatore. First time living away from home. Discovered computer vision in second semester.', tone: 'origin' },
  { year: '2023', title: 'First Internship', detail: 'TATA Data Visualization Trainee program. Learned that clean data beats clever models. Built my first dashboard that someone actually used.', tone: 'growth' },
  { year: '2024', title: 'Three Internships', detail: 'Accenture (data analytics), Vault of Code (web dev), plus the road condition patent published. Realized I like the messy middle between research and product.', tone: 'acceleration' },
  { year: '2025', title: 'Capstone & Portfolio', detail: 'Road condition analyzer as final year project. Started this portfolio. Learned that shipping teaches more than perfecting.', tone: 'synthesis' },
  { year: '2026', title: 'Graduation', detail: 'CGPA 8.3. Looking for roles where I can keep building at the intersection of AI, data, and interfaces. Still learning daily.', tone: 'current' },
];

const VALUES = [
  { icon: MapPin, label: 'Context First', description: 'Every problem lives in a specific context — user, environment, constraints. Ignore context, build the wrong thing.' },
  { icon: Heart, label: 'Useful Over Clever', description: 'A simple solution that ships beats a brilliant one that doesn\'t. Complexity is a cost, not a feature.' },
  { icon: BookOpen, label: 'Learn in Public', description: 'Writing, coding, and sharing imperfect work accelerates learning. This portfolio is that practice.' },
  { icon: Camera, label: 'Craft the Details', description: 'Micro-interactions, copy, loading states, error messages — they\'re not polish, they\'re the product.' },
];

const INTERESTS = [
  { icon: Music, label: 'Ambient & Electronic', detail: 'Nils Frahm, Jon Hopkins, Hiroshi Yoshimura. Music without lyrics for deep work.' },
  { icon: BookOpen, label: 'Systems & History', detail: 'Kleppmann, Hamming, Feynman. How complex systems work and how people think.' },
  { icon: Coffee, label: 'Coffee Ritual', detail: 'V60 pour-over, single origin, morning only. A small daily ceremony.' },
  { icon: Mountain, label: 'Walking', detail: 'No podcasts, no music. Just steps and thoughts. Best debugging tool.' },
  { icon: Gamepad2, label: 'Strategy Games', detail: 'Factorio, Civilization, Oxygen Not Included. Systems thinking as play.' },
  { icon: Camera, label: 'Film Photography', detail: 'Analog constraint forces intention. Pentax K1000, Portra 400.' },
];

const QUOTES = [
  'Code is a liability. The less you write, the less you maintain.',
  'The best abstraction is no abstraction — until you feel the pain.',
  'Data doesn\'t speak. You interrogate it.',
  'A dashboard nobody opens is just expensive wallpaper.',
  'Shipping is a skill. Practice it daily.',
];

export const About: React.FC = () => {
  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-20 sm:space-y-28">
        {/* Hero Masthead with artwork */}
        <PageMasthead
          number="01"
          eyebrow="Profile"
          title="ABOUT ME"
          description="A practical interest in combining data, AI, software and visual interfaces — grounded in the supplied resume, shaped by daily practice."
          artwork={weatherFlow}
          artworkLabel="Interests / context / craft"
        />

        {/* Quick stat cards */}
        <ScrollReveal as="section" delay={100} className="grid grid-cols-2 sm:grid-cols-4 gap-px overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--border-color)]">
          {[
            ['Base', 'Coimbatore, India'],
            ['Degree', 'B.Tech AI & Data Science'],
            ['Period', '2022–2026'],
            ['CGPA', '8.3 / 10'],
          ].map(([label, value]) => (
            <div key={label} className="bg-[var(--bg-surface)] px-4 py-4 sm:px-5 sm:py-5">
              <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">{label}</div>
              <div className="mt-1.5 font-display text-sm sm:text-base font-bold text-[var(--text-primary)]">{value}</div>
            </div>
          ))}
        </ScrollReveal>

        {/* Journey Timeline */}
        <ScrollReveal as="section" delay={150}>
          <div className="eyebrow-rule">Journey</div>
          <div className="mt-8 relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-[var(--border-color)]" />
            {JOURNEY.map((item, i) => (
              <ScrollReveal key={item.year} delay={200 + i * 80} className="relative pl-20 pb-10 last:pb-0">
                <div className="absolute left-8 top-1 w-3 h-3 rounded-full border-2 border-[var(--accent-color)] bg-[var(--bg-primary)]" />
                <div className="studio-panel p-5 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-xs text-[var(--accent-color)] font-bold">{item.year}</span>
                    <h3 className="font-display text-lg font-bold text-[var(--text-primary)]">{item.title}</h3>
                    <span className={`px-2 py-0.5 text-[10px] font-mono uppercase rounded ${
                      item.tone === 'origin' ? 'bg-blue-500/20 border-blue-500/30 text-blue-400' :
                      item.tone === 'growth' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' :
                      item.tone === 'acceleration' ? 'bg-purple-500/20 border-purple-500/30 text-purple-400' :
                      item.tone === 'synthesis' ? 'bg-amber-500/20 border-amber-500/30 text-amber-400' :
                      'bg-[var(--accent-color)]/20 border-[var(--accent-color)]/30 text-[var(--accent-color)]'
                    }`}>{item.tone}</span>
                  </div>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">{item.detail}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>

        {/* Philosophy / Values */}
        <ScrollReveal as="section" delay={400}>
          <div className="eyebrow-rule">Operating Principles</div>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => (
              <ScrollReveal key={v.label} delay={450 + i * 60} className="studio-panel p-6 rounded-xl space-y-3 group">
                <Magnetic>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[var(--accent-glow)] rounded-lg"><v.icon className="h-5 w-5 text-[var(--accent-color)]" /></div>
                    <h3 className="font-display text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-color)] transition-colors">{v.label}</h3>
                  </div>
                </Magnetic>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{v.description}</p>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>

        {/* Personal Quotes */}
        <ScrollReveal as="section" delay={600}>
          <div className="eyebrow-rule">Notes to Self</div>
          <div className="mt-8 space-y-4">
            {QUOTES.map((quote, i) => (
              <ScrollReveal key={i} delay={650 + i * 60} className="studio-panel p-5 rounded-xl relative border-l-4 border-[var(--accent-color)]/50 group">
                <div className="absolute top-3 left-3 text-[var(--accent-color)]/30 text-4xl font-display">"</div>
                <Magnetic>
                  <p className="relative z-10 text-base font-medium text-[var(--text-primary)] leading-relaxed italic pr-8">{quote}</p>
                </Magnetic>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>

        {/* Non-work Interests */}
        <ScrollReveal as="section" delay={800}>
          <div className="eyebrow-rule">When Not Building</div>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {INTERESTS.map((interest, i) => (
              <ScrollReveal key={interest.label} delay={850 + i * 60} className="studio-panel p-6 rounded-xl space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-[var(--bg-surface-secondary)] rounded-lg"><interest.icon className="h-5 w-5 text-[var(--accent-color)]" /></div>
                  <h3 className="font-display text-base font-bold text-[var(--text-primary)]">{interest.label}</h3>
                </div>
                <p className="text-sm text-[var(--text-muted)]">{interest.detail}</p>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>

        {/* Daily Rhythm */}
        <ScrollReveal as="section" delay={1000}>
          <div className="eyebrow-rule">A Typical Day</div>
          <div className="mt-8 studio-panel p-6 rounded-xl space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              {[
                { icon: Sun, time: '06:00', label: 'Wake', detail: 'Walk, no phone' },
                { icon: Coffee, time: '07:00', label: 'Coffee', detail: 'V60, single origin' },
                { icon: Terminal, time: '08:00–12:00', label: 'Deep Work', detail: 'Code, write, learn' },
                { icon: BookOpen, time: '13:00–14:00', label: 'Read', detail: 'Paper or book' },
                { icon: Terminal, time: '14:00–18:00', label: 'Build', detail: 'Projects, experiments' },
                { icon: Mountain, time: '18:30', label: 'Walk', detail: 'No audio' },
                { icon: Music, time: '20:00', label: 'Wind Down', detail: 'Ambient, no screens' },
                { icon: Moon, time: '22:00', label: 'Sleep', detail: '7h target' },
              ].map((item, i) => (
                <ScrollReveal key={item.time} delay={1050 + i * 40} className="p-4 bg-[var(--bg-surface-secondary)] rounded-lg space-y-2">
                  <div className="flex items-center justify-center gap-2"><item.icon className="h-4 w-4 text-[var(--accent-color)]" /><span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--accent-color)]">{item.time}</span></div>
                  <div className="font-display text-sm font-bold text-[var(--text-primary)]">{item.label}</div>
                  <div className="text-[11px] text-[var(--text-muted)]">{item.detail}</div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Skills matrix - compact */}
        <ScrollReveal as="section" delay={1200}>
          <div className="eyebrow-rule">Technical Stack (Resume)</div>
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="studio-panel p-6 rounded-xl space-y-4">
              <div className="flex items-center gap-2"><Terminal className="h-5 w-5 text-[var(--accent-color)]" /><span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">Languages</span></div>
              <div className="flex flex-wrap gap-2">
                {RESUME_DATA.skills.programming.map((s) => (
                  <span key={s} className="px-3 py-1 bg-[var(--bg-surface-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-xs rounded">{s}</span>
                ))}
              </div>
            </div>
            <div className="studio-panel p-6 rounded-xl space-y-4">
              <div className="flex items-center gap-2"><Terminal className="h-5 w-5 text-[var(--accent-color)]" /><span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">Data & Vision</span></div>
              <div className="flex flex-wrap gap-2">
                {RESUME_DATA.skills.dataAndAi.map((s) => (
                  <span key={s} className="px-3 py-1 bg-[var(--bg-surface-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-xs rounded">{s}</span>
                ))}
              </div>
            </div>
            <div className="studio-panel p-6 rounded-xl space-y-4">
              <div className="flex items-center gap-2"><Terminal className="h-5 w-5 text-[var(--accent-color)]" /><span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">Tools & Integration</span></div>
              <div className="flex flex-wrap gap-2">
                {RESUME_DATA.skills.toolsAndDev.map((s) => (
                  <span key={s} className="px-3 py-1 bg-[var(--bg-surface-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-xs rounded">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Education detail */}
        <ScrollReveal as="section" delay={1300}>
          <div className="eyebrow-rule">Education</div>
          <div className="mt-8 studio-panel p-6 rounded-xl space-y-4">
            <div className="flex items-center gap-3 text-[var(--accent-color)] font-mono text-xs font-bold">
              <GraduationCap className="w-5 h-5" />
              <span>ACADEMIC DEGREES</span>
            </div>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-2xl font-bold font-display text-[var(--text-primary)]">{RESUME_DATA.education.degree}</h3>
                <span className="px-3 py-1 bg-[var(--accent-glow)] text-[var(--accent-color)] border border-[var(--accent-color)]/30 text-xs font-mono font-bold">{RESUME_DATA.education.period}</span>
              </div>
              <p className="text-base text-[var(--text-muted)]">{RESUME_DATA.education.institution}</p>
              <div className="pt-2 font-mono text-sm text-[var(--accent-color)] font-bold">CGPA: {RESUME_DATA.education.cgpa}</div>
            </div>
            <div className="pt-4 border-t border-[var(--border-color)]">
              <p className="text-sm text-[var(--text-muted)]">Relevant coursework: Machine Learning, Computer Vision, Data Mining, Database Systems, Software Engineering, Signal Processing, Linear Algebra, Probability & Statistics.</p>
            </div>
          </div>
        </ScrollReveal>

        {/* Closing thought */}
        <ScrollReveal as="section" delay={1400} className="border-t border-[var(--border-color)] pt-12 text-center">
          <Float amplitude={6} duration={8}>
            <SplitText text="Building useful things with code. One commit at a time." tag="p" className="text-[var(--text-muted)] max-w-xl mx-auto font-display text-lg" stagger={0.03} />
          </Float>
        </ScrollReveal>
      </div>
    </PageTransition>
  );
};