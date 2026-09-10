import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/layout/Layout';
const Home = lazy(() => import('./pages/Home').then((module) => ({ default: module.Home })));
const About = lazy(() => import('./pages/About').then((module) => ({ default: module.About })));
const Projects = lazy(() => import('./pages/Projects').then((module) => ({ default: module.Projects })));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail').then((module) => ({ default: module.ProjectDetail })));
const Experience = lazy(() => import('./pages/Experience').then((module) => ({ default: module.Experience })));
const Resume = lazy(() => import('./pages/Resume').then((module) => ({ default: module.Resume })));
const Lab = lazy(() => import('./pages/Lab').then((module) => ({ default: module.Lab })));
const Contact = lazy(() => import('./pages/Contact').then((module) => ({ default: module.Contact })));
const NotFound = lazy(() => import('./pages/NotFound').then((module) => ({ default: module.NotFound })));
const Now = lazy(() => import('./pages/Now').then((module) => ({ default: module.Now })));
const Uses = lazy(() => import('./pages/Uses').then((module) => ({ default: module.Uses })));
const Writing = lazy(() => import('./pages/Writing').then((module) => ({ default: module.Writing })));
const Reading = lazy(() => import('./pages/Reading').then((module) => ({ default: module.Reading })));

// ScrollToTop component to reset window scroll position on route navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Layout>
          <Suspense fallback={<div className="min-h-[40vh] grid place-items-center font-mono text-xs text-[var(--text-muted)]">LOADING VIEW...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:slug" element={<ProjectDetail />} />
              <Route path="/experience" element={<Experience />} />
              <Route path="/resume" element={<Resume />} />
              <Route path="/lab" element={<Lab />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/now" element={<Now />} />
              <Route path="/uses" element={<Uses />} />
              <Route path="/writing" element={<Writing />} />
              <Route path="/reading" element={<Reading />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
