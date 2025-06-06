import { Variants } from 'framer-motion';
import { ANIMATION_DURATIONS } from './constants';

// Common animation variants
export const fadeInUp: Variants = {
  initial: { y: 30, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { duration: ANIMATION_DURATIONS.medium, ease: "easeOut" }
  }
};

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: ANIMATION_DURATIONS.medium }
  }
};

export const slideInFromRight: Variants = {
  initial: { x: 300, opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: { duration: ANIMATION_DURATIONS.medium, ease: "easeOut" }
  },
  exit: {
    x: 300,
    opacity: 0,
    transition: { duration: ANIMATION_DURATIONS.fast }
  }
};

export const staggerContainer: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: ANIMATION_DURATIONS.slow,
      staggerChildren: 0.2
    }
  }
};

export const scaleOnHover: Variants = {
  hover: {
    scale: 1.05,
    transition: { duration: ANIMATION_DURATIONS.fast, ease: "easeOut" }
  },
  tap: {
    scale: 0.98
  }
};

export const cardHover: Variants = {
  hover: {
    y: -8,
    scale: 1.02,
    transition: { duration: ANIMATION_DURATIONS.fast, ease: "easeOut" }
  }
};

// Utility functions
export const createStaggeredAnimation = (staggerDelay = 0.1) => ({
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: 0.1
    }
  }
});

export const createSlideAnimation = (direction: 'up' | 'down' | 'left' | 'right', distance = 30) => {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { y: distance };
      case 'down': return { y: -distance };
      case 'left': return { x: distance };
      case 'right': return { x: -distance };
    }
  };

  return {
    initial: { ...getInitialPosition(), opacity: 0 },
    animate: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: { duration: ANIMATION_DURATIONS.medium, ease: "easeOut" }
    }
  };
}; 