import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import type { Project } from '../../types/project';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import roadTopology from '../../assets/road-topology.svg';
import gestureOrbit from '../../assets/gesture-orbit.svg';
import weatherFlow from '../../assets/weather-flow.svg';

const ARTWORK: Record<string, string> = {
  'road-condition-analyzer': roadTopology,
  'virtual-drawing-board': gestureOrbit,
  'weather-prediction-gui': weatherFlow,
};

/**
 * Draggable 3D coverflow. Drag (or arrow-key) through the projects —
 * cards swing in 3D around the active one, glide with momentum and snap.
 * The active project gets a real link + live region announcement.
 */
export const Coverflow3D: React.FC<{ projects: Project[] }> = ({ projects }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const posRef = useRef(0);
  const velRef = useRef(0);

  useEffect(() => {
    if (reducedMotion) return;
    const track = trackRef.current;
    if (!track || projects.length === 0) return;

    let dragging = false;
    let lastX = 0;
    let raf = 0;
    let lastActive = -1;
    let spacing = 300;

    const measure = () => {
      spacing = Math.max(220, Math.min(420, track.clientWidth * 0.52));
    };
    measure();
    window.addEventListener('resize', measure);

    const layout = () => {
      const pos = posRef.current;
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const off = i - pos;
        const abs = Math.abs(off);
        card.style.transform = `translateX(${(off * spacing).toFixed(1)}px) translateZ(${(-abs * 170).toFixed(1)}px) rotateY(${(off * -24).toFixed(2)}deg) scale(${(1 - Math.min(abs * 0.09, 0.32)).toFixed(3)})`;
        card.style.opacity = `${Math.max(0.15, 1 - abs * 0.3).toFixed(2)}`;
        card.style.zIndex = `${100 - Math.round(abs * 10)}`;
      });
      const rounded = Math.max(0, Math.min(projects.length - 1, Math.round(pos)));
      if (rounded !== lastActive) {
        lastActive = rounded;
        setActive(rounded);
      }
    };

    const render = () => {
      if (!dragging) {
        if (Math.abs(velRef.current) > 0.002) {
          posRef.current += velRef.current;
          velRef.current *= 0.94;
        } else {
          const target = Math.round(posRef.current);
          posRef.current += (target - posRef.current) * 0.14;
          if (Math.abs(target - posRef.current) < 0.001) posRef.current = target;
        }
        posRef.current = Math.max(0, Math.min(projects.length - 1, posRef.current));
      }
      layout();
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      velRef.current = 0;
      track.setPointerCapture?.(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      posRef.current -= dx / spacing;
      posRef.current = Math.max(-0.25, Math.min(projects.length - 1 + 0.25, posRef.current));
      velRef.current = -dx / spacing;
    };
    const onUp = () => {
      dragging = false;
      posRef.current = Math.max(0, Math.min(projects.length - 1, posRef.current));
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      const next = Math.max(0, Math.min(projects.length - 1, Math.round(posRef.current) + (e.key === 'ArrowRight' ? 1 : -1)));
      posRef.current = next;
      velRef.current = 0;
    };

    track.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    track.addEventListener('keydown', onKey as EventListener);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', measure);
      track.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      track.removeEventListener('keydown', onKey as EventListener);
    };
  }, [reducedMotion, projects.length]);

  const goTo = (i: number) => {
    // Drives the same rAF loop as dragging — the loop glides there and snaps.
    posRef.current = Math.max(0, Math.min(projects.length - 1, i));
    velRef.current = 0;
  };

  if (projects.length === 0) return null;
  const current = projects[active] ?? projects[0];

  if (reducedMotion) {
    return (
      <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4" role="list" aria-label="Projects">
        {projects.map((p) => (
          <NavLink
            key={p.id}
            to={`/projects/${p.slug}`}
            role="listitem"
            className="studio-panel w-72 shrink-0 snap-center overflow-hidden"
          >
            {ARTWORK[p.id] && <img src={ARTWORK[p.id]} alt="" className="h-40 w-full object-cover" />}
            <div className="p-5">
              <div className="font-display text-lg font-bold text-[var(--text-primary)]">{p.title}</div>
              <div className="mt-1 font-mono text-xs text-[var(--text-muted)]">{p.shortDescription}</div>
            </div>
          </NavLink>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div
        ref={trackRef}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Project coverflow. Drag or use left and right arrow keys to browse."
        className="relative h-[24rem] cursor-grab touch-none select-none overflow-hidden rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)] active:cursor-grabbing sm:h-[26rem]"
        style={{ perspective: '1600px' }}
      >
        <div className="bg-grid-pattern pointer-events-none absolute inset-0 opacity-50" />
        <div className="absolute left-1/2 top-1/2 h-0 w-0">
          {projects.map((p, i) => (
            <div
              key={p.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              aria-hidden={i !== active}
              className="absolute left-0 top-0 w-[17rem] -translate-x-1/2 -translate-y-1/2 sm:w-[19rem]"
              style={{ transformStyle: 'preserve-3d', willChange: 'transform, opacity' }}
            >
              <div className="studio-panel overflow-hidden shadow-2xl">
                <div className="artifact-frame h-44 border-x-0 border-t-0 sm:h-48">
                  {ARTWORK[p.id] && <img src={ARTWORK[p.id]} alt="" draggable={false} />}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090A10]/70 via-transparent to-transparent" />
                </div>
                <div className="p-5">
                  <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--accent-color)]">
                    {(p.categories[0] ?? 'Project').toUpperCase()} · {p.year}
                  </div>
                  <div className="mt-1.5 font-display text-xl font-bold text-[var(--text-primary)]">{p.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-3 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
          Drag to spin · ← → keys work too
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2" role="tablist" aria-label="Choose project">
          {projects.map((p, i) => (
            <button
              key={p.id}
              role="tab"
              aria-selected={i === active}
              aria-label={`Show ${p.title}`}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === active ? 'w-8 bg-[var(--accent-color)]' : 'w-2 bg-[var(--border-color)] hover:bg-[var(--text-muted)]'
              }`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => goTo(Math.max(0, active - 1))}
            disabled={active === 0}
            aria-label="Previous project"
            className="grid h-10 w-10 place-items-center rounded-full border border-[var(--border-color)] text-[var(--text-primary)] transition-colors hover:border-[var(--accent-color)] disabled:opacity-30"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => goTo(Math.min(projects.length - 1, active + 1))}
            disabled={active === projects.length - 1}
            aria-label="Next project"
            className="grid h-10 w-10 place-items-center rounded-full border border-[var(--border-color)] text-[var(--text-primary)] transition-colors hover:border-[var(--accent-color)] disabled:opacity-30"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
          <NavLink
            to={`/projects/${current.slug}`}
            className="ml-1 inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-color)] px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-90"
          >
            Open case study <ArrowUpRight className="h-4 w-4" />
          </NavLink>
        </div>
      </div>
      <div className="sr-only" role="status">
        Showing {current.title}
      </div>
    </div>
  );
};
