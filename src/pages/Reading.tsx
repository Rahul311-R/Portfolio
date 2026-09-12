import React from 'react';
import { FileText, ExternalLink, Star, ArrowRight, CheckCircle2 } from 'lucide-react';
import { PageTransition } from '../components/ui/PageTransition';
import { PageMasthead } from '../components/ui/PageMasthead';
import { Magnetic, SplitText } from '../components/ui/Animations';
import { FlipIn } from '../components/three/Scroll3D';
import { READING_DATA } from '../data/human';
import heroField from '../assets/hero-field.svg';

const statusLabel = {
  reading: { label: 'Reading', color: 'text-[var(--accent-color)]', bg: 'bg-[var(--accent-glow)] border-[var(--accent-color)]/30' },
  're-reading': { label: 'Re-reading', color: 'text-cyan-400', bg: 'bg-cyan-400/20 border-cyan-400/30' },
  finished: { label: 'Finished', color: 'text-emerald-400', bg: 'bg-emerald-400/20 border-emerald-400/30' },
  queue: { label: 'Queue', color: 'text-[var(--text-muted)]', bg: 'bg-[var(--bg-surface-secondary)] border-[var(--border-color)]' },
  studied: { label: 'Studied', color: 'text-purple-400', bg: 'bg-purple-400/20 border-purple-400/30' },
  read: { label: 'Read', color: 'text-emerald-400', bg: 'bg-emerald-400/20 border-emerald-400/30' },
  skimmed: { label: 'Skimmed', color: 'text-amber-400', bg: 'bg-amber-400/20 border-amber-400/30' },
};

export const Reading: React.FC = () => {
  const totalBooks = READING_DATA.books.length;
  const finishedBooks = READING_DATA.books.filter((b) => b.status === 'finished').length;
  const readingBooks = READING_DATA.books.filter((b) => b.status === 'reading' || b.status === 're-reading').length;

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16 sm:space-y-24">
        <PageMasthead
          number="01"
          eyebrow="Library"
          title="READING"
          description="Books, papers, and resources that shaped how I think about systems, learning, and craft. Ratings are personal, not objective."
          artwork={heroField}
          artworkLabel="Input / synthesis / reference"
        />

        <FlipIn as="section" delay={100} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="studio-panel p-4 rounded-xl text-center"><span className="font-display text-3xl font-bold text-[var(--text-primary)]">{totalBooks}</span><div className="text-[var(--text-muted)] font-mono text-xs uppercase">Books tracked</div></div>
          <div className="studio-panel p-4 rounded-xl text-center"><span className="font-display text-3xl font-bold text-emerald-400">{finishedBooks}</span><div className="text-[var(--text-muted)] font-mono text-xs uppercase">Finished</div></div>
          <div className="studio-panel p-4 rounded-xl text-center"><span className="font-display text-3xl font-bold text-[var(--accent-color)]">{readingBooks}</span><div className="text-[var(--text-muted)] font-mono text-xs uppercase">In progress</div></div>
        </FlipIn>

        <FlipIn as="section" delay={150}>
          <div className="eyebrow-rule">Books</div>
          <div className="mt-6 space-y-4">
            {READING_DATA.books.map((book, i) => {
              const s = statusLabel[book.status as keyof typeof statusLabel] || statusLabel.queue;
              const progress = Math.round((book.progress || 0) * 100);
              return (
                <FlipIn key={book.title} delay={200 + i * 60} className="studio-panel p-5 rounded-xl space-y-3 group">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <Magnetic>
                        <h3 className="font-display text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-color)] transition-colors">{book.title}</h3>
                      </Magnetic>
                      <p className="mt-1 text-sm text-[var(--text-muted)]">by {book.author}</p>
                      {book.note && <p className="mt-2 text-sm text-[var(--text-muted)] italic">"{book.note}"</p>}
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className={`px-2.5 py-1 font-mono text-[10px] uppercase rounded ${s.bg} ${s.color}`}>{s.label}</span>
                        {book.rating && (
                          <div className="flex items-center gap-1" aria-label={`Rating ${book.rating}/5`}>
                            {[1, 2, 3, 4, 5].map((n) => <Star key={n} className={`h-3.5 w-3.5 ${n <= book.rating ? 'fill-current text-amber-400' : 'text-[var(--border-color)]'} `} />)}
                          </div>
                        )}
                      </div>
                    </div>
{book.status === 'reading' || book.status === 're-reading' ? (
                        <div className="w-40 shrink-0">
                          <div className="h-2 bg-[var(--bg-surface-secondary)] rounded-full overflow-hidden">
                            <div className="h-full bg-[var(--accent-color)] rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                          </div>
                          <p className="mt-1 text-[11px] font-mono text-[var(--text-muted)]">{progress}% through</p>
                        </div>
                    ) : book.status === 'finished' ? (
                      <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0" />
                    ) : (
                      <div className="shrink-0" />
                    )}
                  </div>
                </FlipIn>
              );
            })}
          </div>
        </FlipIn>

        <FlipIn as="section" delay={300}>
          <div className="eyebrow-rule">Papers</div>
          <div className="mt-6 space-y-3">
            {READING_DATA.papers.map((paper, i) => (
              <FlipIn key={paper.title} delay={350 + i * 50} className="studio-panel p-4 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <Magnetic>
                    <h4 className="font-display text-base font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-color)] transition-colors">{paper.title}</h4>
                  </Magnetic>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">{paper.authors} · {paper.year} · {statusLabel[paper.status as keyof typeof statusLabel]?.label || paper.status}</p>
                </div>
                <Magnetic>
                  <a href={paper.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[var(--accent-color)] font-mono text-xs uppercase tracking-[0.12em] hover:gap-2 transition-all">
                    <span>Open</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </Magnetic>
              </FlipIn>
            ))}
          </div>
        </FlipIn>

        <FlipIn as="section" delay={450}>
          <div className="eyebrow-rule">Resources & Communities</div>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {READING_DATA.resources.map((res, i) => (
              <FlipIn key={res.name} delay={500 + i * 60} className="studio-panel p-5 rounded-xl space-y-2">
                <div className="flex items-center gap-2"><FileText className="h-5 w-5 text-[var(--accent-color)]" /><span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">{res.type}</span></div>
                <Magnetic>
                  <h4 className="font-display text-base font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-color)] transition-colors">{res.name}</h4>
                </Magnetic>
                <Magnetic>
                  <a href={res.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[var(--accent-color)] font-mono text-xs uppercase tracking-[0.12em] hover:gap-2 transition-all">
                    <span>Visit</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </Magnetic>
              </FlipIn>
            ))}
          </div>
        </FlipIn>

        <FlipIn as="section" delay={600} className="border-t border-[var(--border-color)] pt-8 text-center">
          <SplitText text="The best debugging tool is a good book. The best feature is a well-read mind." tag="p" className="text-[var(--text-muted)] max-w-xl mx-auto" stagger={0.02} />
        </FlipIn>
      </div>
    </PageTransition>
  );
};