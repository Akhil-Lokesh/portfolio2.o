import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import CustomCursor from './components/ui/CustomCursor';
import MatrixRain from './components/ui/MatrixRain';
import ErrorBoundary from './components/ErrorBoundary';
import Hub from './pages/Hub';
import { useTimeBasedEasterEggs } from './hooks/useTimeBasedEasterEggs';
import { useKonamiCode } from './hooks/useKonamiCode';
import { motion, AnimatePresence } from 'framer-motion';
import './styles/globals.css';

// Lazy load components for better performance
const About = React.lazy(() => import('./components/sections/About'));
const Work = React.lazy(() => import('./components/sections/Work'));
const Skills = React.lazy(() => import('./components/sections/Skills'));
const Contact = React.lazy(() => import('./components/sections/Contact'));

function App() {
  const timeFeatures = useTimeBasedEasterEggs();
  const { isKonamiActivated } = useKonamiCode();
  
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
          <Header />
          
          {/* Matrix Rain Easter Egg */}
          <MatrixRain isActive={isKonamiActivated} />
          
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
              <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center bg-background">
                  <div className="text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"
                    />
                    <p className="text-foreground/60 font-sans">Loading...</p>
                  </div>
                </div>
              }>
                <Routes>
                  <Route path="/" element={<Hub />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/work" element={<Work />} />
                  <Route path="/skills" element={<Skills timeFeatures={timeFeatures} konamiActive={isKonamiActivated} />} />
                  <Route path="/contact" element={<Contact />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </main>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
