import React from 'react';
import { ParallaxLayer } from '../ui/Animations';
import { ScrubHero } from '../three/Scroll3D';
import { CarrierWave } from './CarrierWave';

interface ArtifactPlateProps {
  src: string;
  /** Mono caption shown in the corner chip, e.g. "SIG 12 · OPERATING PRINCIPLES". */
  caption: string;
  /** Short human description shown at the bottom of the plate. */
  label: string;
  /** Aspect ratio class; defaults to the 16/9 section-plate shape. */
  aspect?: string;
  /** Adds scroll-scrub tilt for hero-adjacent plates. */
  scrub?: boolean;
  className?: string;
}

/**
 * Section-level image plate: framed Transmission-series artwork with the
 * series caption chip and a soft gradient for text legibility. Purely
 * decorative (empty alt) and reused everywhere so in-page imagery stays
 * visually coherent instead of ad-hoc.
 */
export const ArtifactPlate: React.FC<ArtifactPlateProps> = ({
  src,
  caption,
  label,
  aspect = 'aspect-[16/9]',
  scrub = false,
  className = '',
}) => {
  const frame = (
    <div className={`artifact-frame visual-stage relative ${aspect} w-full overflow-hidden rounded-2xl ${className}`}>
      <ParallaxLayer speed={0.05} max={30} className="absolute inset-0">
        <img src={src} alt="" loading="lazy" decoding="async" className="h-full w-full scale-110 object-cover" />
      </ParallaxLayer>
      <CarrierWave />
      <div className="absolute inset-0 bg-gradient-to-t from-[#08090D]/80 via-transparent to-transparent" />
      <div className="absolute left-4 top-4 font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--accent-secondary)]">
        {caption}
      </div>
      <div className="absolute bottom-4 left-4 right-4 z-10 font-mono text-[10px] uppercase tracking-[0.14em] text-white/65">
        {label}
      </div>
    </div>
  );

  if (!scrub) return frame;
  return (
    <ScrubHero maxTilt={4} drift={18}>
      {frame}
    </ScrubHero>
  );
};
