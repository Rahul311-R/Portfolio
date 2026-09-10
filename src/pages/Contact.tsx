import React from 'react';
import { Mail, MapPin, Terminal } from 'lucide-react';
import { PageTransition } from '../components/ui/PageTransition';
import { ContactForm } from '../components/forms/ContactForm';
import { GithubIcon, LinkedinIcon } from '../components/ui/SocialIcons';
import { PageMasthead } from '../components/ui/PageMasthead';
import weatherFlow from '../assets/weather-flow.svg';

export const Contact: React.FC = () => {
  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16 sm:space-y-24">
        <PageMasthead number="01" eyebrow="Contact" title="LET'S BUILD SOMETHING INTERESTING." description="Use the form to share an enquiry or idea. A form backend can be connected when contact delivery is configured." artwork={weatherFlow} artworkLabel="Signal / response / connection" />

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
                  <span className="flex items-center gap-2 text-sm text-[var(--text-primary)] font-bold">
                    <Mail className="w-4 h-4 text-[var(--accent-color)]" />
                    <span>[ADD LINK]</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg space-y-4">
              <div className="text-[var(--text-muted)] uppercase font-bold border-b border-[var(--border-color)] pb-2">
                PROFESSIONAL NETWORKS
              </div>

              <div className="space-y-3 pt-1">
                <span className="flex items-center gap-2 text-xs text-[var(--text-primary)]">
                  <GithubIcon className="w-4 h-4 text-[var(--text-muted)]" />
                  <span>GitHub Profile [ADD LINK]</span>
                </span>

                <span className="flex items-center gap-2 text-xs text-[var(--text-primary)]">
                  <LinkedinIcon className="w-4 h-4 text-[var(--text-muted)]" />
                  <span>LinkedIn Profile [ADD LINK]</span>
                </span>
              </div>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
