import React, { Suspense, lazy } from 'react';
import { FlaskConical, ArrowDownRight, ShieldAlert } from 'lucide-react';
import { PageTransition } from '@/components/ui/PageTransition';
import { ParticleFieldExperiment } from '@/components/lab/ParticleFieldExperiment';
import { NeuralNetworkInspector } from '@/components/lab/NeuralNetworkInspector';
import { DynamicColorGenerator } from '@/components/lab/DynamicColorGenerator';
import { ParticleSphere3D } from '@/components/three/ParticleSphere3D';
import { TiltCard } from '@/components/ui/TiltCard';
import { LazyMount } from '@/components/ui/LazyMount';
import { PAGE_ARTWORK } from '@/data/artwork';
import { WaveTunnel3D } from '@/components/three/WaveTunnel3D';

const InteractiveCanvas = lazy(() => import('@/components/lab/InteractiveCanvas').then((m) => ({ default: m.InteractiveCanvas })));
const DataVisExperiment = lazy(() => import('@/components/lab/DataVisExperiment').then((m) => ({ default: m.DataVisExperiment })));
const SphereExperiment = lazy(() => import('@/components/lab/SphereExperiment').then((m) => ({ default: m.SphereExperiment })));
const TerrainExperiment = lazy(() => import('@/components/lab/TerrainExperiment').then((m) => ({ default: m.TerrainExperiment })));

const ExperimentFallback: React.FC<{ label: string }> = ({ label }) => (
  <div className="grid min-h-[20rem] w-full place-items-center rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] font-mono text-xs text-[var(--text-muted)]">
    {label}
  </div>
);

const experiments = [
  ['particle-field', '01', 'Particle field'],
  ['network-inspector', '02', 'Parameter playground'],
  ['drawing-canvas', '03', 'Drawing canvas'],
  ['color-generator', '04', 'Colour generator'],
  ['data-visualisation', '05', 'Generative data sketch'],
  ['particle-sphere', '06', '3D particle sphere'],
  ['terrain-drift', '07', 'Wireframe terrain'],
  ['wave-tunnel', '08', 'Wave tunnel (3D)']
] as const;

export const Lab: React.FC = () => {
  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16 sm:space-y-24">
        <section className="relative artifact-frame visual-stage min-h-[31rem] sm:min-h-[35rem] rounded-2xl">
          <img src={PAGE_ARTWORK.lab} alt="" className="absolute inset-0 h-full w-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#08090D]/92 via-[#08090D]/55 to-[#08090D]/15" />
          <div className="absolute inset-y-0 right-0 hidden w-1/2 md:block" aria-hidden="true">
            <ParticleSphere3D fluid transparent points={110} />
          </div>
          <div className="relative z-10 h-full min-h-[31rem] sm:min-h-[35rem] p-7 sm:p-10 md:p-14 flex flex-col justify-between">
            <div className="inline-flex self-start items-center gap-2 rounded-full border border-white/20 bg-black/25 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/80 backdrop-blur-sm"><FlaskConical className="h-3.5 w-3.5 text-[var(--accent-secondary)]" /> The Lab / Personal experiments</div>
            <div className="max-w-4xl">
              <div className="eyebrow-rule text-white/70">Creative coding field notes</div>
              <h1 className="mt-5 font-display text-[clamp(3.7rem,9vw,8rem)] font-extrabold leading-[0.82] tracking-[-0.07em] text-white">// EXPERIMENTS</h1>
              <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-white/70">A browser-native playground for motion, drawing, colour and data. Every piece is an experimental study, not a client or production project. The sphere on the right is live — drag it.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono uppercase tracking-[0.12em] text-white/65"><span>Move through the modules</span><ArrowDownRight className="h-4 w-4 text-[var(--accent-secondary)]" /><span>Interact directly</span><ArrowDownRight className="h-4 w-4 text-[var(--accent-secondary)]" /><span>Make an observation</span></div>
          </div>
        </section>

        <section className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-px overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--border-color)]" aria-label="Lab experiment navigation">
          {experiments.map(([id, number, label]) => <a key={id} href={`#${id}`} className="group bg-[var(--bg-surface)] p-4 sm:p-5 transition-colors hover:bg-[var(--bg-surface-secondary)]"><div className="font-mono text-[10px] text-[var(--accent-color)]">{number}</div><div className="mt-2 font-display text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-color)]">{label}</div></a>)}
        </section>

        <div className="flex items-start gap-3 rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-amber-700 dark:text-amber-300">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
          <p className="font-mono text-xs leading-relaxed">Experimental / Personal Work. These interactive pieces are creative-coding studies and do not represent client work or production systems.</p>
        </div>

        <div className="space-y-16 sm:space-y-24">
          <section id="particle-field" className="scroll-mt-24"><TiltCard maxTilt={4}><ParticleFieldExperiment /></TiltCard></section>
          <section id="network-inspector" className="scroll-mt-24"><TiltCard maxTilt={4}><NeuralNetworkInspector /></TiltCard></section>
          <section id="drawing-canvas" className="scroll-mt-24"><TiltCard maxTilt={4}><LazyMount minHeight={460} fallbackLabel="Loading drawing canvas…"><Suspense fallback={<ExperimentFallback label="Loading drawing canvas…" />}><InteractiveCanvas /></Suspense></LazyMount></TiltCard></section>
          <section id="color-generator" className="scroll-mt-24"><TiltCard maxTilt={4}><DynamicColorGenerator /></TiltCard></section>
          <section id="data-visualisation" className="scroll-mt-24"><TiltCard maxTilt={4}><LazyMount minHeight={420} fallbackLabel="Loading data visualisation…"><Suspense fallback={<ExperimentFallback label="Loading data visualisation…" />}><DataVisExperiment /></Suspense></LazyMount></TiltCard></section>
          <section id="particle-sphere" className="scroll-mt-24"><TiltCard maxTilt={4}><LazyMount minHeight={520} fallbackLabel="Loading 3D particle sphere…"><Suspense fallback={<ExperimentFallback label="Loading 3D particle sphere…" />}><SphereExperiment /></Suspense></LazyMount></TiltCard></section>
          <section id="terrain-drift" className="scroll-mt-24"><TiltCard maxTilt={4}><LazyMount minHeight={520} fallbackLabel="Loading wireframe terrain…"><Suspense fallback={<ExperimentFallback label="Loading wireframe terrain…" />}><TerrainExperiment /></Suspense></LazyMount></TiltCard></section>
          <section id="wave-tunnel" className="scroll-mt-24"><TiltCard maxTilt={4}><WaveTunnel3D /></TiltCard></section>
        </div>
      </div>
    </PageTransition>
  );
};
