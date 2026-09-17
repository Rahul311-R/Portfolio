import React from 'react';
import { Calendar, Clock, ExternalLink, Tag, Loader2 } from 'lucide-react';
import { PageTransition } from '@/components/ui/PageTransition';
import { PageMasthead } from '@/components/ui/PageMasthead';
import { SplitText, Magnetic } from '@/components/ui/Animations';
import { FlipIn } from '@/components/three/Scroll3D';
import { WRITING_DATA } from '@/data/human';
import { PAGE_ARTWORK } from '@/data/artwork';
import { SignalHelix3D } from '@/components/three/SignalHelix3D';

export const Writing: React.FC = () => {
  const published = WRITING_DATA.filter((w) => w.status === 'published');
  const drafts = WRITING_DATA.filter((w) => w.status === 'draft');

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16 sm:space-y-24">
        <PageMasthead
          number="01"
          eyebrow="Notes & Articles"
          title="WRITING"
          description="Technical notes I've polished into articles, plus drafts I'm still shaping. No content calendar — just topics I needed to understand better."
          artwork={PAGE_ARTWORK.writing}
          artworkLabel="Words / code / clarity"
        />

        <FlipIn as="section" delay={100} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="studio-panel p-4 rounded-xl text-center"><span className="font-display text-3xl font-bold text-[var(--text-primary)]">{published.length}</span><div className="text-[var(--text-muted)] font-mono text-xs uppercase">Published</div></div>
          <div className="studio-panel p-4 rounded-xl text-center"><span className="font-display text-3xl font-bold text-[var(--text-primary)]">{drafts.length}</span><div className="text-[var(--text-muted)] font-mono text-xs uppercase">In Draft</div></div>
          <div className="studio-panel p-4 rounded-xl text-center"><span className="font-display text-3xl font-bold text-[var(--text-primary)]">{WRITING_DATA.length}</span><div className="text-[var(--text-muted)] font-mono text-xs uppercase">Total</div></div>
        </FlipIn>

        {/* The drafting helix — ideas winding into words */}
        <FlipIn as="section" delay={120}>
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <SignalHelix3D />
            </div>
            <div className="order-1 lg:order-2">
              <div className="eyebrow-rule">The helix · live</div>
              <h2 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-[var(--text-primary)] sm:text-3xl">
                Ideas wind into words.
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--text-muted)]">
                Drafting is a double helix: one strand of research, one strand of
                rewriting, twisted together until it stands up on its own.
                Drag the helix — it keeps your momentum.
              </p>
            </div>
          </div>
        </FlipIn>

        {published.length > 0 && (
          <FlipIn as="section" delay={150}>
            <div className="eyebrow-rule">Published</div>
            <div className="mt-6 space-y-4">
              {published.map((post, i) => (
                <FlipIn key={post.slug} delay={200 + i * 80} className="studio-panel p-5 rounded-xl hover:border-[var(--accent-color)] transition-colors group">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <Magnetic>
                        <h3 className="font-display text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-color)] transition-colors">{post.title}</h3>
                      </Magnetic>
                      <p className="mt-2 text-sm text-[var(--text-muted)] line-clamp-2">{post.excerpt}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] font-mono text-[var(--text-muted)]">
                        <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {post.readingTime}</span>
                        {post.tags.map((tag) => (
                          <span key={tag} className="flex items-center gap-1 px-2 py-0.5 bg-[var(--bg-surface-secondary)] border border-[var(--border-color)] rounded"><Tag className="h-3 w-3" /> {tag}</span>
                        ))}
                      </div>
                    </div>
                    <Magnetic>
                      <a href={`/writing/${post.slug}`} className="flex items-center gap-1.5 text-[var(--accent-color)] font-mono text-xs uppercase tracking-[0.12em] hover:gap-2 transition-all" aria-label={`Read ${post.title}`}>
                        <span>Read</span>
                        <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </a>
                    </Magnetic>
                  </div>
                </FlipIn>
              ))}
            </div>
          </FlipIn>
        )}

        {drafts.length > 0 && (
          <FlipIn as="section" delay={300}>
            <div className="eyebrow-rule">In Progress</div>
            <div className="mt-6 space-y-4">
              {drafts.map((post, i) => (
                <FlipIn key={post.slug} delay={350 + i * 80} className="studio-panel p-5 rounded-xl border border-amber-400/30 bg-amber-400/5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-amber-400/20 border border-amber-400/40 text-amber-300 font-mono text-[10px] uppercase rounded">Draft</span>
                        <Loader2 className="h-4 w-4 text-[var(--tone-amber)] animate-spin" aria-hidden="true" />
                      </div>
                      <h3 className="mt-2 font-display text-lg font-bold text-[var(--text-primary)]">{post.title}</h3>
                      <p className="mt-2 text-sm text-[var(--text-muted)] line-clamp-2">{post.excerpt}</p>
                      <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-mono text-[var(--text-muted)]">
                        {post.tags.map((tag) => (
                          <span key={tag} className="px-2 py-0.5 bg-[var(--bg-surface-secondary)] border border-[var(--border-color)] rounded">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </FlipIn>
              ))}
            </div>
          </FlipIn>
        )}

        <FlipIn as="section" delay={500} className="border-t border-[var(--border-color)] pt-8">
          <SplitText text="Writing is thinking in public. These notes exist because I couldn't find them elsewhere when I needed them." tag="p" className="text-center text-[var(--text-muted)] max-w-2xl mx-auto" stagger={0.02} />
        </FlipIn>
      </div>
    </PageTransition>
  );
};