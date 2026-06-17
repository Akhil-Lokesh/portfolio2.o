import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Logo from '../ui/Logo';
import FlowingBackground from '../ui/FlowingBackground';
import MagneticButton from '../interactive/MagneticButton';
import Avatar from './Avatar';
import FeaturedProject from './FeaturedProject';

const navItems = [
  { title: 'About Me', path: '/about' },
  { title: 'My Work', path: '/work' },
  { title: 'My Skills', path: '/skills' },
  { title: 'Contact', path: '/contact' },
];

const container = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.8, staggerChildren: 0.15 } },
};
const item = {
  initial: { y: 24, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
};

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 relative py-20">
      <FlowingBackground />
      <motion.div
        className="w-full max-w-3xl mx-auto text-center relative z-10"
        variants={container}
        initial="initial"
        animate="animate"
      >
        <motion.div variants={item} className="mb-6 flex justify-center">
          <Avatar size={88} />
        </motion.div>

        <motion.h1
          variants={item}
          className="font-display font-bold tracking-tight text-3xl sm:text-4xl md:text-5xl leading-tight mb-3"
        >
          I'm{' '}
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Akhil
          </span>
          . I make data behave.
        </motion.h1>

        <motion.p variants={item} className="text-foreground/55 font-bitter italic text-base sm:text-lg mb-6">
          (it doesn't always listen.)
        </motion.p>

        <motion.p
          variants={item}
          className="text-foreground/80 font-bitter text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed"
        >
          Data &amp; ML engineer turning million-row messes into things people actually use.
          Bay Area &middot; Data Analytics @ SJSU &middot; open to new problems.
        </motion.p>

        <motion.div variants={item} className="mb-8">
          <FeaturedProject />
        </motion.div>

        <motion.nav
          variants={item}
          className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 text-base sm:text-lg mb-6"
        >
          {navItems.map((nav, index) => (
            <React.Fragment key={nav.path}>
              <Link
                to={nav.path}
                className="group relative text-foreground hover:text-primary transition-colors duration-300 focus-ring px-2 py-1 font-garet tracking-wide whitespace-nowrap"
              >
                {nav.title}
                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 w-0 bg-primary transition-all duration-200 group-hover:w-2/3" />
              </Link>
              {index < navItems.length - 1 && (
                <span className="hidden sm:inline text-foreground/20 text-sm">|</span>
              )}
            </React.Fragment>
          ))}
        </motion.nav>

        <motion.div variants={item}>
          <MagneticButton>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/15 text-foreground/80 hover:text-foreground hover:border-white/30 transition-all duration-300 font-mono text-sm"
            >
              Résumé <span aria-hidden="true">↗</span>
            </a>
          </MagneticButton>
        </motion.div>

        <motion.p variants={item} className="mt-5 text-xs font-mono text-foreground/40">
          press{' '}
          <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-foreground/60">⌘K</kbd>
          {' '}to jump anywhere
        </motion.p>
      </motion.div>

      <motion.div
        className="fixed bottom-8 sm:bottom-12 inset-x-0 mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <Logo size="lg" animated={true} />
      </motion.div>
    </div>
  );
};

export default Home;
