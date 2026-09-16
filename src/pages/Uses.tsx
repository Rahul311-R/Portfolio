import React from 'react';
import { Monitor, Terminal, Code, Database, Server, Palette, Link as LinkIcon } from 'lucide-react';
import { PageTransition } from '@/components/ui/PageTransition';
import { PageMasthead } from '@/components/ui/PageMasthead';
import { Magnetic, SplitText } from '@/components/ui/Animations';
import { FlipIn } from '@/components/three/Scroll3D';
import { TiltCard } from '@/components/ui/TiltCard';
import { USES_DATA } from '@/data/human';
import { PAGE_ARTWORK } from '@/data/artwork';
import { WaveTunnel3D } from '@/components/three/WaveTunnel3D';

export const Uses: React.FC = () => {
  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16 sm:space-y-24">
        <PageMasthead
          number="01"
          eyebrow="Environment"
          title="USES"
          description="The tools, hardware, and workflows I reach for daily. Minimal, borrowed, and constantly edited."
          artwork={PAGE_ARTWORK.uses}
          artworkLabel="Setup / tools / flow"
        />

        <FlipIn as="section" delay={100} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {USES_DATA.hardware.map((item, i) => (
            <FlipIn key={item.name} delay={150 + i * 50}>
              <TiltCard maxTilt={7} className="studio-panel p-5 rounded-xl space-y-2 h-full">
                <div className="flex items-center gap-2 [transform:translateZ(28px)]"><Monitor className="h-5 w-5 text-[var(--accent-color)]" /><span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">{item.name}</span></div>
                <p className="text-sm text-[var(--text-primary)] [transform:translateZ(14px)]">{item.spec}</p>
              </TiltCard>
            </FlipIn>
          ))}
        </FlipIn>

        <FlipIn as="section" delay={200}>
          <div className="eyebrow-rule">Editor & Terminal</div>
        </FlipIn>
        <FlipIn as="section" delay={250} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FlipIn delay={300}>
            <TiltCard maxTilt={6} className="studio-panel p-6 rounded-xl space-y-4 h-full">
            <div className="flex items-center gap-2 [transform:translateZ(28px)]"><Code className="h-5 w-5 text-[var(--accent-color)]" /><SplitText text="VS Code (Insiders)" tag="h3" className="font-display text-lg font-bold" /></div>
            <dl className="space-y-2 text-sm">
              <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5">
                <dt className="text-[var(--text-muted)] font-mono">Theme</dt>
                <dd className="text-[var(--text-primary)]">{USES_DATA.editor.theme}</dd>
                <dt className="text-[var(--text-muted)] font-mono">Font</dt>
                <dd className="text-[var(--text-primary)]">{USES_DATA.editor.font}</dd>
              </div>
            </dl>
            <div className="border-t border-[var(--border-color)] pt-4">
              <span className="font-mono text-xs text-[var(--text-muted)]">Extensions</span>
              <div className="flex flex-wrap gap-2 mt-2 [transform:translateZ(14px)]">
                {USES_DATA.editor.extensions.map((ext) => (
                  <span key={ext} className="px-2.5 py-1 bg-[var(--bg-surface-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-xs rounded">{ext}</span>
                ))}
              </div>
            </div>
            </TiltCard>
          </FlipIn>

          <FlipIn delay={350}>
            <TiltCard maxTilt={6} className="studio-panel p-6 rounded-xl space-y-4 h-full">
            <div className="flex items-center gap-2 [transform:translateZ(28px)]"><Terminal className="h-5 w-5 text-[var(--accent-color)]" /><SplitText text="Terminal" tag="h3" className="font-display text-lg font-bold" /></div>
            <dl className="space-y-2 text-sm">
              <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5">
                <dt className="text-[var(--text-muted)] font-mono">Shell</dt>
                <dd className="text-[var(--text-primary)]">{USES_DATA.terminal.shell}</dd>
                <dt className="text-[var(--text-muted)] font-mono">Prompt</dt>
                <dd className="text-[var(--text-primary)]">{USES_DATA.terminal.prompt}</dd>
              </div>
            </dl>
            <div className="border-t border-[var(--border-color)] pt-4">
              <span className="font-mono text-xs text-[var(--text-muted)]">CLI tools</span>
              <div className="flex flex-wrap gap-2 mt-2 [transform:translateZ(14px)]">
                {USES_DATA.terminal.tools.map((tool) => (
                  <span key={tool} className="px-2.5 py-1 bg-[var(--bg-surface-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-xs rounded">{tool}</span>
                ))}
              </div>
            </div>
            </TiltCard>
          </FlipIn>
        </FlipIn>

        <FlipIn as="section" delay={400}>
          <div className="eyebrow-rule">Languages & Workflow</div>
        </FlipIn>
        <FlipIn as="section" delay={450} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FlipIn delay={500}>
            <TiltCard maxTilt={6} className="studio-panel p-6 rounded-xl space-y-4 h-full">
            <div className="flex items-center gap-2 [transform:translateZ(28px)]"><Database className="h-5 w-5 text-[var(--accent-color)]" /><SplitText text="LANGUAGES" tag="h3" className="font-display text-lg font-bold" /></div>
            <div className="space-y-3">
              {Object.entries(USES_DATA.languages).map(([key, langs]) => (
                <div key={key} className="space-y-1.5">
                  <span className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--accent-color)]">{key.toUpperCase()}</span>
                  <div className="flex flex-wrap gap-2">
                    {langs.map((l) => (
                      <span key={l} className="px-2.5 py-1 bg-[var(--bg-surface-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-xs rounded">{l}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            </TiltCard>
          </FlipIn>

          <FlipIn delay={550}>
            <TiltCard maxTilt={6} className="studio-panel p-6 rounded-xl space-y-4 h-full">
            <div className="flex items-center gap-2 [transform:translateZ(28px)]"><LinkIcon className="h-5 w-5 text-[var(--accent-color)]" /><SplitText text="WORKFLOW" tag="h3" className="font-display text-lg font-bold" /></div>
            <ul className="space-y-2 text-[var(--text-muted)]">
              {USES_DATA.workflow.map((item, i) => (
                <FlipIn key={item} delay={600 + i * 50} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--accent-color)] shrink-0" />
                  <li>{item}</li>
                </FlipIn>
              ))}
            </ul>
            </TiltCard>
          </FlipIn>
        </FlipIn>

        <FlipIn as="section" delay={650}>
          <div className="eyebrow-rule">Design, Hosting & Data</div>
        </FlipIn>
        <FlipIn as="section" delay={700} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: 'Design', items: USES_DATA.design, Icon: Palette },
            { label: 'Hosting', items: USES_DATA.hosting, Icon: Server },
            { label: 'Databases', items: USES_DATA.databases, Icon: Database },
          ].map(({ label, items, Icon }, i) => (
            <FlipIn key={label} delay={750 + i * 80}>
              <TiltCard maxTilt={7} className="studio-panel p-5 rounded-xl space-y-3 h-full">
                <div className="flex items-center gap-2 [transform:translateZ(28px)]"><Icon className="h-5 w-5 text-[var(--accent-color)]" /><span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">{label}</span></div>
                <div className="flex flex-wrap gap-2 [transform:translateZ(14px)]">
                  {items.map((item) => (
                    <span key={item} className="px-2.5 py-1 bg-[var(--bg-surface-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-xs rounded">{item}</span>
                  ))}
                </div>
              </TiltCard>
            </FlipIn>
          ))}
        </FlipIn>

        {/* Data path tunnel — the journey of a keystroke through this setup */}
        <FlipIn as="section" delay={800}>
          <div className="eyebrow-rule mb-4">The data path · keystroke to deploy</div>
          <WaveTunnel3D />
        </FlipIn>

        <FlipIn as="section" delay={850} className="border-t border-[var(--border-color)] pt-8 text-center">
          <Magnetic>
            <button className="px-5 py-2.5 border border-[var(--border-color)] text-[var(--text-primary)] font-mono text-sm rounded hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] transition-colors">
              This list changes. Last edited {new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}.
            </button>
          </Magnetic>
        </FlipIn>
      </div>
    </PageTransition>
  );
};