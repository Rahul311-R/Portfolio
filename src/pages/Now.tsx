import React from 'react';
import { Zap, Music, BookOpen, Heart } from 'lucide-react';
import { PageTransition } from '@/components/ui/PageTransition';
import { PageMasthead } from '@/components/ui/PageMasthead';
import { SplitText } from '@/components/ui/Animations';
import { FlipIn } from '@/components/three/Scroll3D';
import { NOW_DATA } from '@/data/human';
import { PAGE_ARTWORK } from '@/data/artwork';
import { SignalBus } from '@/components/transmission/SignalBus';

export const Now: React.FC = () => {
  const now = new Date();
  const month = now.toLocaleString('default', { month: 'short', year: 'numeric' });

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16 sm:space-y-24">
        <PageMasthead
          number="01"
          eyebrow={`Updated ${month}`}
          title="NOW"
          description="What I'm focused on, learning, building, and consuming right now. Updated manually when things shift."
          artwork={PAGE_ARTWORK.now}
          artworkLabel="Current snapshot / field notes"
        />

        <FlipIn as="section" delay={100}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="eyebrow-rule">Last updated</div>
            <div className="eyebrow-rule">Location</div>
            <div className="eyebrow-rule">Timezone</div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            <div className="studio-panel p-4 rounded-xl"><span className="font-mono text-sm text-[var(--text-muted)]">{NOW_DATA.updated}</span></div>
            <div className="studio-panel p-4 rounded-xl"><span className="font-mono text-sm text-[var(--text-muted)]">{NOW_DATA.location}</span></div>
            <div className="studio-panel p-4 rounded-xl"><span className="font-mono text-sm text-[var(--text-muted)]">IST (UTC+5:30)</span></div>
          </div>
        </FlipIn>

        <FlipIn delay={150}>
          <div className="eyebrow-rule">Primary focus</div>
        </FlipIn>
        <FlipIn delay={200}>
          <p className="mt-3 text-lg leading-relaxed text-[var(--text-primary)] max-w-3xl">{NOW_DATA.focus}</p>
        </FlipIn>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <FlipIn as="section" delay={250} className="studio-panel p-6 rounded-xl space-y-4">
            <div className="flex items-center gap-2"><Zap className="h-5 w-5 text-[var(--accent-color)]" /><SplitText text="LEARNING" tag="h3" className="font-display text-lg font-bold" /></div>
            <ul className="space-y-2.5 text-[var(--text-muted)]">
              {NOW_DATA.learning.map((item, i) => (
                <FlipIn key={item} delay={300 + i * 60} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--accent-color)] shrink-0" />
                  <li>{item}</li>
                </FlipIn>
              ))}
            </ul>
          </FlipIn>

          <FlipIn as="section" delay={350} className="studio-panel p-6 rounded-xl space-y-4">
            <div className="flex items-center gap-2"><Zap className="h-5 w-5 text-[var(--accent-color)]" /><SplitText text="BUILDING" tag="h3" className="font-display text-lg font-bold" /></div>
            <ul className="space-y-2.5 text-[var(--text-muted)]">
              {NOW_DATA.building.map((item, i) => (
                <FlipIn key={item} delay={400 + i * 60} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--accent-color)] shrink-0" />
                  <li>{item}</li>
                </FlipIn>
              ))}
            </ul>
          </FlipIn>

          <FlipIn as="section" delay={450} className="studio-panel p-6 rounded-xl space-y-4">
            <div className="flex items-center gap-2"><Music className="h-5 w-5 text-[var(--accent-color)]" /><SplitText text="LISTENING" tag="h3" className="font-display text-lg font-bold" /></div>
            <ul className="space-y-2.5 text-[var(--text-muted)]">
              {NOW_DATA.listening.map((item, i) => (
                <FlipIn key={item} delay={500 + i * 60} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--accent-color)] shrink-0" />
                  <li>{item}</li>
                </FlipIn>
              ))}
            </ul>
          </FlipIn>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FlipIn as="section" delay={550} className="studio-panel p-6 rounded-xl space-y-4">
            <div className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-[var(--accent-color)]" /><SplitText text="READING" tag="h3" className="font-display text-lg font-bold" /></div>
            <ul className="space-y-2.5 text-[var(--text-muted)]">
              {NOW_DATA.reading.map((item, i) => (
                <FlipIn key={item} delay={600 + i * 60} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--accent-color)] shrink-0" />
                  <li>{item}</li>
                </FlipIn>
              ))}
            </ul>
          </FlipIn>

          <FlipIn as="section" delay={650} className="studio-panel p-6 rounded-xl space-y-4">
            <div className="flex items-center gap-2"><Heart className="h-5 w-5 text-[var(--tone-rose)]" /><SplitText text="HEALTH & RHYTHM" tag="h3" className="font-display text-lg font-bold" /></div>
            <p className="text-[var(--text-muted)]">{NOW_DATA.health}</p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-3 py-1 bg-[var(--bg-surface-secondary)] border border-[var(--border-color)] text-[var(--text-muted)] font-mono text-xs">Morning walks</span>
              <span className="px-3 py-1 bg-[var(--bg-surface-secondary)] border border-[var(--border-color)] text-[var(--text-muted)] font-mono text-xs">7h sleep target</span>
              <span className="px-3 py-1 bg-[var(--bg-surface-secondary)] border border-[var(--border-color)] text-[var(--text-muted)] font-mono text-xs">Phone greyscale post-21:00</span>
            </div>
          </FlipIn>
        </div>

        {/* Live status strip */}
        <FlipIn as="section" delay={700} className="studio-panel rounded-xl p-4 sm:p-6">
          <div className="eyebrow-rule mb-3">Live relays · all channels nominal</div>
          <SignalBus height={120} lanes={3} />
        </FlipIn>

        <FlipIn as="section" delay={750} className="border-t border-[var(--border-color)] pt-8 text-center">
          <p className="font-mono text-xs text-[var(--text-muted)]">This page is a manual snapshot. It drifts. That's the point.</p>
        </FlipIn>
      </div>
    </PageTransition>
  );
};