import React from 'react';
import { FileCode2 } from 'lucide-react';

const LINES: { tokens: { text: string; tone: 'muted' | 'plain' | 'accent' | 'string' | 'keyword' }[] }[] = [
  { tokens: [{ text: '// DragCube3D.tsx — idle spin + drag momentum', tone: 'muted' }] },
  { tokens: [{ text: 'const', tone: 'keyword' }, { text: ' render = () => {', tone: 'plain' }] },
  { tokens: [{ text: '  if', tone: 'keyword' }, { text: ' (!drag.current.active) {', tone: 'plain' }] },
  { tokens: [{ text: '    rot.y', tone: 'plain' }, { text: ' += ', tone: 'muted' }, { text: 'velY;', tone: 'plain' }] },
  { tokens: [{ text: '    velY', tone: 'plain' }, { text: ' += ', tone: 'muted' }, { text: '(IDLE', tone: 'accent' }, { text: ' - velY) * ', tone: 'muted' }, { text: '0.02', tone: 'string' }, { text: ';', tone: 'plain' }] },
  { tokens: [{ text: '  }', tone: 'plain' }] },
  { tokens: [{ text: '  cube.style.transform', tone: 'plain' }, { text: ' = ', tone: 'muted' }, { text: '`rotateX(', tone: 'string' }, { text: '${rot.x}', tone: 'accent' }, { text: 'deg)…`;', tone: 'string' }] },
  { tokens: [{ text: '  raf', tone: 'plain' }, { text: ' = ', tone: 'muted' }, { text: 'requestAnimationFrame', tone: 'accent' }, { text: '(render);', tone: 'plain' }] },
  { tokens: [{ text: '};', tone: 'plain' }] },
];

const toneClass: Record<string, string> = {
  muted: 'text-[var(--visual-muted)] opacity-70',
  plain: 'text-[var(--visual-ink)]',
  accent: 'text-[var(--accent-color)]',
  string: 'text-[var(--tone-emerald)]',
  keyword: 'text-[var(--tone-purple)]',
};

/**
 * Real code from this codebase — the inertia loop behind the draggable
 * 3D cube — shown as a static, honest artifact. No simulated terminal.
 */
export const CodePanel: React.FC = () => {
  return (
    <div className="visual-stage relative w-full overflow-hidden rounded-lg border border-[var(--border-color)] font-mono text-xs">
      <div className="relative z-10 flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-rose-500/70" />
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-500/70" />
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
          <span className="ml-2 flex items-center gap-1.5 text-[11px] text-[var(--visual-muted)]">
            <FileCode2 className="h-3.5 w-3.5 text-[var(--accent-color)]" /> DragCube3D.tsx
          </span>
        </div>
        <span className="text-[10px] uppercase tracking-[0.12em] text-[var(--visual-muted)]">
          From this site
        </span>
      </div>
      <pre className="relative z-10 overflow-x-auto p-4 leading-relaxed sm:p-5 sm:text-[13px]">
        <code>
          {LINES.map((line, i) => (
            <div key={i} className="table-row">
              <span className="table-cell select-none pr-4 text-right text-[var(--visual-muted)] opacity-40">{i + 1}</span>
              <span className="table-cell whitespace-pre">
                {line.tokens.map((t, j) => (
                  <span key={j} className={toneClass[t.tone]}>
                    {t.text}
                  </span>
                ))}
              </span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
};
