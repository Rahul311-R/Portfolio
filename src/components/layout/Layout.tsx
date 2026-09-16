import React, { useEffect } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CommandMenu } from './CommandMenu';
import { ScrollControls } from './ScrollControls';
import { AmbientField } from '@/components/ambient/AmbientField';
import { ScrollProgress } from '@/components/ambient/ScrollProgress';
import { Cursor } from '@/components/premium/Cursor';
import { KonamiTerminal } from '@/components/premium/KonamiTerminal';
import { initSmoothScroll } from '@/lib/smoothScroll';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Lenis inertial scrolling for the whole app; destroyed on unmount.
  useEffect(() => initSmoothScroll(), []);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] relative selection:bg-[var(--accent-color)] selection:text-white">
      {/* Cinematic grain + custom cursor (decorative, pointer-events-none) */}
      <div className="grain" aria-hidden="true" />
      <Cursor />
      <KonamiTerminal />

      {/* Living background + scroll HUD (shared MotionEngine clock) */}
      <AmbientField />
      <ScrollProgress />

      {/* Navbar */}
      <Navbar />

      {/* Global Command Palette */}
      <CommandMenu />
      <ScrollControls />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 pt-16">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
