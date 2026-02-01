import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { NavigationSection } from '../types';
import Logo from '../components/ui/Logo';
import FlowingBackground from '../components/ui/FlowingBackground';

const Hub: React.FC = () => {
  const navigationSections: NavigationSection[] = [
    {
      id: 'about',
      title: 'About Me',
      description: 'The story behind the solutions',
      timeEstimate: '2 min read',
      icon: '👨‍💻',
      path: '/about'
    },
    {
      id: 'work',
      title: 'My Work',
      description: '7 projects that solved real problems',
      timeEstimate: '5 min explore',
      icon: '💻',
      path: '/work'
    },
    {
      id: 'skills',
      title: 'My Skills',
      description: 'How I combine tech to create impact',
      timeEstimate: '1 min interactive',
      icon: '⚡',
      path: '/skills'
    },
    {
      id: 'contact',
      title: 'Contact Me',
      description: 'Let\'s build something together',
      timeEstimate: '30 sec',
      icon: '📧',
      path: '/contact'
    }
  ];

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const greetingVariants = {
    initial: { y: 50, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const cardVariants = {
    initial: { y: 30, opacity: 0, scale: 0.95 },
    animate: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 relative">
      <FlowingBackground />
      <motion.div
        className="w-full max-w-4xl mx-auto text-center relative z-10"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
          {/* Greeting Section */}
          <motion.div
            variants={greetingVariants}
            className="mb-8 sm:mb-12"
          >
            <h1 className="mb-4 sm:mb-6">
              <div className="text-foreground font-ubuntu font-bold tracking-normal text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3 leading-tight">Hey! this is</div>
              <Link to="/about">
                <motion.div 
                  className="relative inline-block cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span 
                    id="nameText"
                    className="font-signature font-medium text-4xl sm:text-6xl md:text-8xl inline-block relative z-10"
                    style={{
                      backgroundImage: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      color: 'transparent',
                      backgroundSize: '100% 100%',
                      transition: 'background-position 0.2s ease-out'
                    }}
                    onMouseMove={(e) => {
                      const el = document.getElementById('nameText');
                      if (el) {
                        const rect = el.getBoundingClientRect();
                        const x = ((e.clientX - rect.left) / rect.width) * 100;
                        const y = ((e.clientY - rect.top) / rect.height) * 100;
                        
                        el.style.backgroundImage = `radial-gradient(circle at ${x}% ${y}%, var(--color-primary) 0%, var(--color-secondary) 100%)`;
                        el.style.backgroundPosition = `${x}% ${y}%`;
                        el.style.backgroundSize = '300% 300%';
                      }
                    }}
                    onMouseLeave={(e) => {
                      const el = document.getElementById('nameText');
                      if (el) {
                        el.style.backgroundImage = 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))';
                        el.style.backgroundSize = '100% 100%';
                        el.style.backgroundPosition = 'center';
                        el.style.transition = 'background-image 0.5s ease-out, background-size 0.5s ease-out';
                      }
                    }}
                  >
                    Akhil Kumar
                  </span>
                </motion.div>
              </Link>
            </h1>
            
            <p className="text-sm sm:text-base md:text-lg text-foreground/85 mb-3 sm:mb-4 max-w-2xl mx-auto leading-relaxed font-bitter font-normal tracking-wide px-2 sm:px-0">
              Plot twist: instead of forcing you through 47 sections about my 'passion 
              for clean code' (spoiler: who isn't?), I'm giving you the remote control.
            </p>
            
            <p className="text-xs sm:text-sm md:text-base text-foreground/65 mb-6 sm:mb-8 font-bitter font-light tracking-wide px-2 sm:px-0">
              Revolutionary, I know. What sounds interesting?
            </p>
          </motion.div>

          {/* Responsive Navigation - Horizontal on Desktop, Vertical on Mobile */}
          <motion.nav 
            className="mb-8 sm:mb-12"
            variants={containerVariants}
          >
            {/* Mobile: Vertical Stack (one item per line) */}
            <div className="flex flex-col items-center justify-center gap-4 text-base sm:text-lg sm:hidden">
              {navigationSections.map((section) => (
                <motion.div
                  key={section.id}
                  variants={cardVariants}
                  whileHover={{
                    scale: 1.02,
                    y: -2,
                    transition: { type: "spring", stiffness: 300, damping: 10 }
                  }}
                  whileTap={{ scale: 0.98, y: 0 }}
                >
                  <Link
                    to={section.path}
                    className="text-foreground hover:text-primary transition-all duration-300 focus-ring px-2 py-1 font-garet font-normal tracking-wide relative whitespace-nowrap"
                  >
                    <motion.span
                      className="absolute -bottom-0.5 left-1/2 w-0 h-0.5 bg-primary"
                      initial={{ width: 0, x: "-50%" }}
                      whileHover={{ width: "70%", x: "-50%" }}
                      transition={{ duration: 0.2 }}
                    />
                    {section.title}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Desktop: Original Horizontal Layout with Separators */}
            <div className="hidden sm:flex sm:items-center sm:justify-center sm:gap-4 sm:text-lg">
              {navigationSections.map((section, index) => (
                <React.Fragment key={section.id}>
                  <motion.div
                    variants={cardVariants}
                    whileHover={{
                      scale: 1.02,
                      y: -2,
                      transition: { type: "spring", stiffness: 300, damping: 10 }
                    }}
                    whileTap={{ scale: 0.98, y: 0 }}
                  >
                    <Link
                      to={section.path}
                      className="text-foreground hover:text-primary transition-all duration-300 focus-ring px-2 py-1 font-garet font-normal tracking-wide relative whitespace-nowrap"
                    >
                      <motion.span
                        className="absolute -bottom-0.5 left-1/2 w-0 h-0.5 bg-primary"
                        initial={{ width: 0, x: "-50%" }}
                        whileHover={{ width: "70%", x: "-50%" }}
                        transition={{ duration: 0.2 }}
                      />
                      {section.title}
                    </Link>
                  </motion.div>
                  {index < navigationSections.length - 1 && (
                    <span className="text-foreground/20 text-sm font-sans mx-1">|</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </motion.nav>

          {/* ak. logo at bottom center */}
          <motion.div 
            className="fixed bottom-8 sm:bottom-12 inset-x-0 mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <Logo size="lg" animated={true} />
          </motion.div>
      </motion.div>
    </div>
  );
};

export default Hub;
