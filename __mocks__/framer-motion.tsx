/**
 * Minimal framer-motion mock for Jest / JSDOM.
 *
 * AnimatePresence in the real library keeps exiting children in the DOM while
 * their exit animation runs, which breaks synchronous "not.toBeInTheDocument"
 * assertions in tests. This mock removes children immediately on unmount so
 * tests behave like the component's logical state.
 */
import React from 'react';

const AnimatePresence: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <>{children}</>
);

// Forward every prop to the underlying HTML element so aria-* / role / etc. work.
const motion: Record<string, React.FC<React.HTMLAttributes<HTMLElement> & { [key: string]: unknown }>> = new Proxy(
  {},
  {
    get(_target, tag: string) {
      const Component: React.FC<React.HTMLAttributes<HTMLElement> & { [key: string]: unknown }> = ({
        children,
        // strip framer-motion-specific props so React doesn't warn on unknown DOM attrs
        initial: _i,
        animate: _a,
        exit: _e,
        transition: _t,
        variants: _v,
        whileHover: _wh,
        whileTap: _wt,
        whileFocus: _wf,
        whileInView: _wiv,
        viewport: _vp,
        layout: _l,
        layoutId: _lid,
        onAnimationComplete: _oac,
        onAnimationStart: _oas,
        ...rest
      }) => React.createElement(tag, rest, children);
      Component.displayName = `motion.${tag}`;
      return Component;
    },
  }
);

export { AnimatePresence, motion };
