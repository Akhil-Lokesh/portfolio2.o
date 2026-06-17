import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/layout/Header';
import CustomCursor from './components/ui/CustomCursor';
import MatrixRain from './components/ui/MatrixRain';
import ErrorBoundary from './components/ErrorBoundary';
import AnimatedRoutes from './components/interactive/AnimatedRoutes';
import ScrollToTop from './components/interactive/ScrollToTop';
import ScrollProgress from './components/interactive/ScrollProgress';
import CommandPalette from './components/interactive/CommandPalette';
import { useTimeBasedEasterEggs } from './hooks/useTimeBasedEasterEggs';
import { useKonamiCode } from './hooks/useKonamiCode';
import { motion, AnimatePresence } from 'framer-motion';
import './styles/globals.css';

function App() {
  const timeFeatures = useTimeBasedEasterEggs();
  const { isKonamiActivated } = useKonamiCode();
  const [matrixManual, setMatrixManual] = useState(false);
  const triggerMatrix = useCallback(() => {
    setMatrixManual(true);
    setTimeout(() => setMatrixManual(false), 8000);
  }, []);

  // Add dark theme class to document on mount
  React.useEffect(() => {
    document.documentElement.classList.add('dark');

    // Console Easter Egg for Developers
    console.log(`
%c👋 Hey there, fellow dev!
%cI see you're checking under the hood. I like your style.
%c
%c🎯 Fun fact: This portfolio has 0 console errors (I hope!)
%c🚀 Built with React, TypeScript, and lots of caffeine
%c💡 Try typing 'easter()' in the console for a surprise...
`,
      'color: #0047FF; font-size: 16px; font-weight: bold;',
      'color: #00CFFD; font-size: 14px;',
      '',
      'color: #7000FF; font-size: 12px;',
      'color: #00CFFD; font-size: 12px;',
      'color: #0047FF; font-size: 12px;'
    );

    // Secret console command
    (window as any).easter = () => {
      console.log(`
%c🥚 You found the easter egg!
%cHere's my tech stack complexity level: undefined
%c
%cPS: Thanks for being curious. That's the mark of a good developer! 🚀
`,
        'color: #7000FF; font-size: 14px; font-weight: bold;',
        'color: #00CFFD; font-size: 12px;',
        '',
        'color: #0047FF; font-size: 10px;'
      );
    };

    return () => {};
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <div className="App bg-background text-foreground min-h-screen dark">
          <CustomCursor enabled={true} />
          <ScrollToTop />
          <ScrollProgress />
          <CommandPalette onTriggerMatrix={triggerMatrix} />
          <Header />

          {/* Matrix Rain Easter Egg */}
          <MatrixRain isActive={isKonamiActivated || matrixManual} />

          {/* Time-Based Easter Egg Message */}
          <AnimatePresence>
            {timeFeatures.timeMessage && (
              <motion.div
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 300 }}
                className="fixed top-20 right-4 z-40 bg-surface/90 backdrop-blur-md border border-accent/20 rounded-xl p-3 shadow-lg"
              >
                <p className="text-sm text-foreground/80 font-sans">
                  {timeFeatures.timeMessage}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <main>
            <ErrorBoundary>
              <AnimatedRoutes timeFeatures={timeFeatures} konamiActive={isKonamiActivated} />
            </ErrorBoundary>
          </main>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
