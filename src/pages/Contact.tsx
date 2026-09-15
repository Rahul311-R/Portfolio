import React from 'react';
import { Mail, MapPin, Terminal } from 'lucide-react';
import { PageTransition } from '../components/ui/PageTransition';
import { ContactForm } from '../components/forms/ContactForm';
import { GithubIcon, LinkedinIcon } from '../components/ui/SocialIcons';
import { PageMasthead } from '../components/ui/PageMasthead';
import { SOCIAL } from '../data/social';
import { PAGE_ARTWORK, SECTION_ARTWORK } from '../data/artwork';
import { ArtifactPlate } from '../components/transmission/ArtifactPlate';
import { PacketOrbit3D } from '../components/three/PacketOrbit3D';

export const Contact: React.FC = () => {
  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16 sm:space-y-24">
        <PageMasthead number="01" eyebrow="Contact" title="LET'S BUILD SOMETHING INTERESTING." description="Use the form to share an enquiry or idea. A form backend can be connected when contact delivery is configured." artwork={PAGE_ARTWORK.contact} artworkLabel="Signal / response / connection" />

        <ArtifactPlate src={SECTION_ARTWORK.handshake} caption="SIG 16 · HANDSHAKE PROTOCOL" label="SYN, ACK — every good conversation starts with a clean handshake" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Contact Details Column */}
          <div className="space-y-8 font-mono text-xs">
            <div className="p-6 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg space-y-4">
              <div className="text-[var(--accent-color)] font-bold uppercase pb-3 border-b border-[var(--border-color)] flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                <span>DIRECT TERMINAL CHANNELS</span>
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <span className="text-[var(--text-muted)] block uppercase mb-1">Location Base:</span>
                  <div className="flex items-center gap-2 text-sm text-[var(--text-primary)] font-bold">
                    <MapPin className="w-4 h-4 text-[var(--accent-color)]" />
                    <span>Coimbatore, Tamil Nadu, India</span>
                  </div>
                </div>

                <div>
                  <span className="text-[var(--text-muted)] block uppercase mb-1">Direct Email:</span>
                  <a
                    href={`mailto:${SOCIAL.email}`}
                    className="flex items-center gap-2 text-sm text-[var(--text-primary)] font-bold hover:text-[var(--accent-color)] transition-colors"
                  >
                    <Mail className="w-4 h-4 text-[var(--accent-color)]" />
                    <span className="underline decoration-[var(--border-strong)] underline-offset-4">{SOCIAL.email}</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="p-6 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg space-y-4">
              <div className="text-[var(--text-muted)] uppercase font-bold border-b border-[var(--border-color)] pb-2">
                PROFESSIONAL NETWORKS
              </div>

              <div className="space-y-3 pt-1">
                <a
                  href={SOCIAL.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-colors group"
                >
                  <GithubIcon className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-color)] transition-colors" />
                  <span className="underline decoration-[var(--border-strong)] underline-offset-4">{SOCIAL.github.replace('https://', '')}</span>
                </a>

                <a
                  href={SOCIAL.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-colors group"
                >
                  <LinkedinIcon className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-color)] transition-colors" />
                  <span className="underline decoration-[var(--border-strong)] underline-offset-4">{SOCIAL.linkedin.replace('https://www.', '').replace(/\/$/, '')}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 items-center gap-6 sm:grid-cols-[1fr_auto]">
              <p className="font-mono text-xs leading-relaxed text-[var(--text-muted)]">
                // Or catch a signal in the wild — the orbit below shows the channels live.
              </p>
              <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> Channel open
              </span>
            </div>
            <ContactForm />
            <PacketOrbit3D perRing={6} />
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
