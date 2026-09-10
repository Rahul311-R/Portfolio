import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export const ScrollControls: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min((window.scrollY / max) * 100, 100) : 0);
      setVisible(window.scrollY > 560);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 z-[60] h-px bg-[var(--accent-color)] transition-[width] duration-150" style={{ width: `${progress}%` }} aria-hidden="true" />
      {visible && <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-5 right-5 z-30 grid h-11 w-11 place-items-center rounded-full studio-panel text-[var(--text-primary)] transition-transform hover:-translate-y-1 hover:border-[var(--accent-color)]" aria-label="Scroll to top"><ArrowUp className="h-4 w-4" /></button>}
    </>
  );
};
