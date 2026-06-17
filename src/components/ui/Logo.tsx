import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animated?: boolean;
}

type Phase = 'idle' | 'typing' | 'pausing' | 'deleting';

const LOGO_TEXT = 'ak.';
const TYPING_SPEED = 70; // ms per character
const DELETE_SPEED = 50; // ms per character (faster than typing)
const PAUSE_DURATION = 3000; // ms a finished message stays before deleting

// Messages to cycle through on regular clicks
const MESSAGES = ['Hello!', 'Whatsup?', 'I like doing this lets start again!'];

const Logo: React.FC<LogoProps> = ({
  size = 'md',
  className = '',
  animated = true
}) => {
  const [phase, setPhase] = useState<Phase>('idle');
  const [target, setTarget] = useState<string>(LOGO_TEXT);
  const [displayed, setDisplayed] = useState<string>(LOGO_TEXT);
  const [clickCount, setClickCount] = useState(0);
  const [showAchievement, setShowAchievement] = useState(false);

  const messageIndexRef = useRef(0);

  const isAnimating = phase === 'typing' || phase === 'deleting';

  // Handle logo click with click-count evolution
  const handleLogoClick = () => {
    // Ignore clicks mid-animation so sequences don't overlap
    if (phase !== 'idle') return;

    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);

    let nextMessage: string;
    if (newClickCount === 5) {
      nextMessage = 'ak.exe';
    } else if (newClickCount === 10) {
      nextMessage = 'ak.jpg'; // corrupted file joke
    } else if (newClickCount === 20) {
      nextMessage = 'ak.gif'; // with sparkle animation
    } else if (newClickCount === 50) {
      nextMessage = 'Achievement Unlocked! 🏆';
      setShowAchievement(true);
    } else {
      const nextIndex = (messageIndexRef.current + 1) % MESSAGES.length;
      messageIndexRef.current = nextIndex;
      nextMessage = MESSAGES[nextIndex];
    }

    setTarget(nextMessage);
    setDisplayed('');
    setPhase('typing');
  };

  // Auto-hide the achievement popup
  useEffect(() => {
    if (!showAchievement) return;
    const timer = setTimeout(() => setShowAchievement(false), 3000);
    return () => clearTimeout(timer);
  }, [showAchievement]);

  // Single effect drives the whole typing/pausing/deleting state machine.
  // Every branch schedules exactly one timer and cleans it up, so it is
  // safe under React.StrictMode's double-invocation.
  useEffect(() => {
    if (phase === 'typing') {
      if (displayed.length < target.length) {
        const timer = setTimeout(
          () => setDisplayed(target.slice(0, displayed.length + 1)),
          TYPING_SPEED
        );
        return () => clearTimeout(timer);
      }
      // Fully typed: the resting logo stops here; any other message pauses then deletes.
      setPhase(target === LOGO_TEXT ? 'idle' : 'pausing');
      return;
    }

    if (phase === 'pausing') {
      const timer = setTimeout(() => setPhase('deleting'), PAUSE_DURATION);
      return () => clearTimeout(timer);
    }

    if (phase === 'deleting') {
      if (displayed.length > 0) {
        const timer = setTimeout(
          () => setDisplayed(displayed.slice(0, -1)),
          DELETE_SPEED
        );
        return () => clearTimeout(timer);
      }
      // Fully deleted: retype the resting logo.
      setTarget(LOGO_TEXT);
      setPhase('typing');
    }
  }, [phase, displayed, target]);

  // Determine text size based on logo size
  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl md:text-3xl',
    lg: 'text-3xl md:text-4xl'
  };

  const textSize = textSizes[size];

  const logoVariants = {
    initial: { opacity: 0, y: 10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        delay: 0.1
      }
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 }
    }
  };

  return (
    <>
      <motion.div
        className={`inline-flex items-center justify-center ${className}`}
        variants={animated ? logoVariants : undefined}
        initial={animated ? "initial" : undefined}
        animate={animated ? "animate" : undefined}
        whileHover={animated ? "hover" : undefined}
      >
        <div
          className={`${textSize} font-black tracking-tighter font-sans text-foreground cursor-pointer relative`}
          onClick={handleLogoClick}
        >
          {displayed}
          {isAnimating && (
            <span className="inline-block w-[0.5em] h-[1.1em] bg-foreground animate-pulse ml-1"></span>
          )}

          {/* Sparkle effect for ak.gif */}
          {displayed === 'ak.gif' && (
            <motion.div
              className="absolute -top-2 -right-2"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              ✨
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Achievement Popup */}
      <AnimatePresence>
        {showAchievement && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 shadow-2xl border border-white/20"
          >
            <div className="text-center text-white">
              <div className="text-3xl mb-2">🏆</div>
              <div className="font-display font-bold mb-1">Achievement Unlocked!</div>
              <div className="text-sm opacity-90">Logo Master</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Logo;
