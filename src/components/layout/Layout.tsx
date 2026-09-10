import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CommandMenu } from './CommandMenu';
import { ScrollControls } from './ScrollControls';
import { CursorGlow } from '../ui/Animations';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] relative selection:bg-[var(--accent-color)] selection:text-white">
      {/* Navbar */}
      <Navbar />

      {/* Global Command Palette */}
      <CommandMenu />
      <ScrollControls />
      <CursorGlow />

      {/* Main Content Area */}
      <main className="flex-1 pt-16">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
