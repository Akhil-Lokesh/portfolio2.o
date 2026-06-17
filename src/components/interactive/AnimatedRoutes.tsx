import React, { Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Routes, Route, useLocation } from 'react-router-dom';
import PageTransition from './PageTransition';
import Hub from '../../pages/Hub';
import { TimeBasedFeatures } from '../../types';

const About = React.lazy(() => import('../sections/About'));
const Work = React.lazy(() => import('../sections/Work'));
const Skills = React.lazy(() => import('../sections/Skills'));
const Contact = React.lazy(() => import('../sections/Contact'));

const PageFallback: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

interface AnimatedRoutesProps {
  timeFeatures: TimeBasedFeatures;
  konamiActive: boolean;
}

const AnimatedRoutes: React.FC<AnimatedRoutesProps> = ({ timeFeatures, konamiActive }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Hub /></PageTransition>} />
        <Route
          path="/about"
          element={
            <PageTransition>
              <Suspense fallback={<PageFallback />}>
                <About />
              </Suspense>
            </PageTransition>
          }
        />
        <Route
          path="/work"
          element={
            <PageTransition>
              <Suspense fallback={<PageFallback />}>
                <Work />
              </Suspense>
            </PageTransition>
          }
        />
        <Route
          path="/skills"
          element={
            <PageTransition>
              <Suspense fallback={<PageFallback />}>
                <Skills timeFeatures={timeFeatures} konamiActive={konamiActive} />
              </Suspense>
            </PageTransition>
          }
        />
        <Route
          path="/contact"
          element={
            <PageTransition>
              <Suspense fallback={<PageFallback />}>
                <Contact />
              </Suspense>
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
