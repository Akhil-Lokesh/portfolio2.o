# Portfolio Foundations + Global Feel — Implementation Plan (Plan 1 of 3)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the shared foundations (reduced-motion + touch hooks, extracted project data) and a global "feels alive" layer — page transitions (A), scroll-reveal + progress bar (B), and magnetic/tilt interactions (C) — to the `akhil-portfolio` site without changing content or adding dependencies.

**Architecture:** Two new hooks gate all motion behind `prefers-reduced-motion` and touch detection. Project data moves to a single source of truth (`src/data/projects.ts`). New reusable components live in `src/components/interactive/`. `App.tsx` is rewired once to mount the route-transition wrapper, scroll-to-top, and scroll-progress bar. Magnetic/tilt/reveal primitives are then applied to existing CTAs and project cards.

**Tech Stack:** React 18, TypeScript 4.9, Framer Motion 10, React Router 6, CRA (react-scripts 5), Jest + Testing Library. **No new dependencies.**

---

## Environment note (read first)

This project lives in an iCloud-synced folder. Per project memory (`iCloud evicts node_modules`), if `npm start`/`npm test` hangs silently, the fix is a fresh install: `rm -rf node_modules && npm ci`. Run that once before starting if tooling stalls.

Working directory for all commands: `/Users/akhil/Desktop/Portfolio 2/akhil-portfolio`

Test runner note: `npm test` opens watch mode. Run single suites non-interactively with:
`CI=true npx react-scripts test --watchAll=false <path>`

---

## File Structure

| File | Responsibility |
|------|----------------|
| `src/hooks/usePrefersReducedMotion.ts` (create) | Reactive `prefers-reduced-motion` boolean |
| `src/hooks/useIsTouchDevice.ts` (create) | Reactive touch/coarse-pointer boolean |
| `src/setupTests.ts` (modify) | Add `matchMedia` mock for jsdom |
| `src/types/index.ts` (modify) | Extend `Project` with proof-of-work fields |
| `src/data/projects.ts` (create) | Single source of truth for project data |
| `src/components/interactive/PageTransition.tsx` (create) | Per-route enter/exit motion wrapper |
| `src/components/interactive/AnimatedRoutes.tsx` (create) | Routes + `AnimatePresence`, owns lazy routes |
| `src/components/interactive/ScrollToTop.tsx` (create) | Resets scroll on navigation |
| `src/components/interactive/ScrollProgress.tsx` (create) | Top scroll-progress bar |
| `src/components/interactive/Reveal.tsx` (create) | Scroll-into-view reveal wrapper |
| `src/components/interactive/MagneticButton.tsx` (create) | Cursor-magnetic wrapper for CTAs |
| `src/components/interactive/TiltCard.tsx` (create) | 3D-tilt + glow card wrapper |
| `src/App.tsx` (modify) | Mount AnimatedRoutes, ScrollToTop, ScrollProgress |
| `src/components/sections/Work.tsx` (modify) | Import data; apply TiltCard + Reveal + MagneticButton |
| `src/components/sections/Skills.tsx` (modify) | Apply MagneticButton to CTA |
| `src/components/sections/About.tsx` (modify) | Apply MagneticButton to CTA |
| `src/components/sections/Contact.tsx` (modify) | Apply Reveal to bottom block |

---

### Task 1: `usePrefersReducedMotion` hook + jsdom matchMedia mock

**Files:**
- Modify: `src/setupTests.ts`
- Create: `src/hooks/usePrefersReducedMotion.ts`
- Test: `src/hooks/usePrefersReducedMotion.test.ts`

- [ ] **Step 1: Add a matchMedia mock to setupTests** (jsdom does not implement it)

Replace the entire contents of `src/setupTests.ts` with:

```ts
// jest-dom adds custom matchers like toBeInTheDocument().
// CRA automatically loads this file before each test suite.
import '@testing-library/jest-dom';

// jsdom does not implement matchMedia; provide a default mock so hooks and
// components that read media queries can run in tests. Individual tests may
// override window.matchMedia to simulate specific query results.
if (typeof window.matchMedia !== 'function') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }),
  });
}
```

- [ ] **Step 2: Write the failing test**

Create `src/hooks/usePrefersReducedMotion.test.ts`:

```ts
import { renderHook } from '@testing-library/react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

function mockMatchMedia(matches: boolean) {
  window.matchMedia = jest.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('usePrefersReducedMotion', () => {
  test('returns false when the user has no reduced-motion preference', () => {
    mockMatchMedia(false);
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(false);
  });

  test('returns true when the user prefers reduced motion', () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(true);
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `CI=true npx react-scripts test --watchAll=false src/hooks/usePrefersReducedMotion.test.ts`
Expected: FAIL — `Cannot find module './usePrefersReducedMotion'`.

- [ ] **Step 4: Implement the hook**

Create `src/hooks/usePrefersReducedMotion.ts`:

```ts
import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Returns true when the user has requested reduced motion at the OS level.
 * Reactive: updates if the preference changes while the page is open.
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia(QUERY).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia(QUERY);
    const onChange = (event: MediaQueryListEvent) => setPrefersReduced(event.matches);
    setPrefersReduced(mql.matches);

    // addEventListener is the modern API; addListener is the Safari < 14 fallback.
    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    }
    mql.addListener(onChange);
    return () => mql.removeListener(onChange);
  }, []);

  return prefersReduced;
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `CI=true npx react-scripts test --watchAll=false src/hooks/usePrefersReducedMotion.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 6: Commit**

```bash
git add src/setupTests.ts src/hooks/usePrefersReducedMotion.ts src/hooks/usePrefersReducedMotion.test.ts
git commit -m "feat: add usePrefersReducedMotion hook + jsdom matchMedia mock"
```

---

### Task 2: `useIsTouchDevice` hook

**Files:**
- Create: `src/hooks/useIsTouchDevice.ts`
- Test: `src/hooks/useIsTouchDevice.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/hooks/useIsTouchDevice.test.ts`:

```ts
import { renderHook } from '@testing-library/react';
import { useIsTouchDevice } from './useIsTouchDevice';

describe('useIsTouchDevice', () => {
  const originalInnerWidth = window.innerWidth;

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: originalInnerWidth,
    });
  });

  test('reports touch on a narrow viewport', () => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 375 });
    const { result } = renderHook(() => useIsTouchDevice());
    expect(result.current).toBe(true);
  });

  test('reports non-touch on a wide desktop viewport', () => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1440 });
    const { result } = renderHook(() => useIsTouchDevice());
    expect(result.current).toBe(false);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `CI=true npx react-scripts test --watchAll=false src/hooks/useIsTouchDevice.test.ts`
Expected: FAIL — `Cannot find module './useIsTouchDevice'`.

- [ ] **Step 3: Implement the hook**

Create `src/hooks/useIsTouchDevice.ts`:

```ts
import { useEffect, useState } from 'react';

function detectTouch(): boolean {
  if (typeof window === 'undefined') return false;
  const coarsePointer =
    typeof window.matchMedia === 'function'
      ? window.matchMedia('(pointer: coarse)').matches
      : false;
  return (
    coarsePointer ||
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    window.innerWidth <= 768
  );
}

/**
 * Returns true on touch / coarse-pointer / narrow devices. Reactive to resize.
 * Used to disable cursor-driven effects (magnetic, tilt) where they make no sense.
 */
export function useIsTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState<boolean>(detectTouch);

  useEffect(() => {
    const update = () => setIsTouch(detectTouch());
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return isTouch;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `CI=true npx react-scripts test --watchAll=false src/hooks/useIsTouchDevice.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useIsTouchDevice.ts src/hooks/useIsTouchDevice.test.ts
git commit -m "feat: add useIsTouchDevice hook"
```

---

### Task 3: Extract project data to a single source of truth

**Files:**
- Modify: `src/types/index.ts:12-22`
- Create: `src/data/projects.ts`
- Modify: `src/components/sections/Work.tsx:1-131`

- [ ] **Step 1: Extend the `Project` interface**

In `src/types/index.ts`, replace the existing `Project` interface (lines 12-22) with:

```ts
// Project types
export interface Project {
  id: string;
  title: string;
  description: string;
  detailedDescription: string;
  keyFeatures: string[];
  technicalChallenge: string;
  technologies: string[];
  githubUrl: string;
  year: number;
  hook?: string;        // one-line, craft-aimed punch line (added during voice pass)
  liveUrl?: string;     // optional live demo
  image?: string;       // optional screenshot path under public/
  featured?: boolean;   // marks the homepage hero project
}
```

- [ ] **Step 2: Create the data file**

Create `src/data/projects.ts`. Move the existing `projects` array **verbatim** from `src/components/sections/Work.tsx` (currently lines 11-131, the seven project objects) into this file, wrapped as below:

```ts
import { Project } from '../types';

export const projects: Project[] = [
  // ⬇️ Paste the seven project objects exactly as they appear in
  // Work.tsx lines 11-131 (from `{ id: 'spotify-analytics', ... }`
  // through the closing `}` of the `ubereats-prototype` object).
  // Do not edit their contents in this task.
];
```

After pasting, the array must contain all seven objects with ids: `spotify-analytics`, `spotify-streaming`, `airline-odyssey`, `recommendation-engine`, `air-pollution`, `learning-management`, `ubereats-prototype`.

- [ ] **Step 3: Point Work.tsx at the data file**

In `src/components/sections/Work.tsx`:

Change the imports at the top (lines 1-4) to:

```tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { projects } from '../../data/projects';
```

Then delete the entire local declaration `const projects: Project[] = [ ... ];` (the block spanning the original lines 11-131). The component now uses the imported `projects`. (The `Project` type import is no longer needed in this file.)

- [ ] **Step 4: Verify type-check and existing tests**

Run: `npm run type-check`
Expected: no errors.

Run: `CI=true npx react-scripts test --watchAll=false`
Expected: all existing suites PASS.

- [ ] **Step 5: Commit**

```bash
git add src/types/index.ts src/data/projects.ts src/components/sections/Work.tsx
git commit -m "refactor: extract project data to src/data/projects.ts + extend Project type"
```

---

### Task 4: `PageTransition` wrapper

**Files:**
- Create: `src/components/interactive/PageTransition.tsx`

- [ ] **Step 1: Implement the component**

Create `src/components/interactive/PageTransition.tsx`:

```tsx
import React from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * Wraps a route's content with enter/exit motion. Used inside AnimatePresence
 * so navigating between routes cross-fades + slides. Falls back to a plain fade
 * when the user prefers reduced motion.
 */
const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const reduced = usePrefersReducedMotion();

  const variants = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -12 },
      };

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: reduced ? 0.2 : 0.35, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
```

- [ ] **Step 2: Verify type-check**

Run: `npm run type-check`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/interactive/PageTransition.tsx
git commit -m "feat: add PageTransition wrapper"
```

---

### Task 5: `AnimatedRoutes` (owns lazy routes + AnimatePresence)

**Files:**
- Create: `src/components/interactive/AnimatedRoutes.tsx`

This component takes over the route definitions currently in `App.tsx`. Each route element is wrapped in `PageTransition`, and lazy pages get their own `Suspense` (inside the transition) so a page's load never blanks the whole app during an exit animation.

- [ ] **Step 1: Implement the component**

Create `src/components/interactive/AnimatedRoutes.tsx`:

```tsx
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
```

- [ ] **Step 2: Verify type-check**

Run: `npm run type-check`
Expected: no errors. (Component is not yet wired into App; that happens in Task 11.)

- [ ] **Step 3: Commit**

```bash
git add src/components/interactive/AnimatedRoutes.tsx
git commit -m "feat: add AnimatedRoutes with per-route transitions and lazy loading"
```

---

### Task 6: `ScrollToTop`

**Files:**
- Create: `src/components/interactive/ScrollToTop.tsx`

- [ ] **Step 1: Implement the component**

Create `src/components/interactive/ScrollToTop.tsx`:

```tsx
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Resets window scroll to the top whenever the route changes.
 * Renders nothing. Uses the legacy scrollTo signature for an instant jump
 * (the global CSS `scroll-behavior: smooth` would otherwise animate it).
 */
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
```

- [ ] **Step 2: Verify type-check**

Run: `npm run type-check`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/interactive/ScrollToTop.tsx
git commit -m "feat: add ScrollToTop on route change"
```

---

### Task 7: `ScrollProgress` bar

**Files:**
- Create: `src/components/interactive/ScrollProgress.tsx`

- [ ] **Step 1: Implement the component**

Create `src/components/interactive/ScrollProgress.tsx`:

```tsx
import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useLocation } from 'react-router-dom';

/**
 * A thin gradient bar pinned to the top of the viewport that fills as the user
 * scrolls the page. Hidden on the single-viewport home route ('/').
 */
const ScrollProgress: React.FC = () => {
  const { pathname } = useLocation();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.2 });

  if (pathname === '/') return null;

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-0.5 origin-left z-[60] bg-gradient-to-r from-primary via-secondary to-accent"
      style={{ scaleX }}
    />
  );
};

export default ScrollProgress;
```

- [ ] **Step 2: Verify type-check**

Run: `npm run type-check`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/interactive/ScrollProgress.tsx
git commit -m "feat: add ScrollProgress bar"
```

---

### Task 8: `Reveal` scroll-into-view wrapper

**Files:**
- Create: `src/components/interactive/Reveal.tsx`

- [ ] **Step 1: Implement the component**

Create `src/components/interactive/Reveal.tsx`:

```tsx
import React from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}

/**
 * Reveals its children with a fade + rise the first time they scroll into view.
 * Renders a plain div (no animation) when the user prefers reduced motion.
 */
const Reveal: React.FC<RevealProps> = ({ children, className, delay = 0, y = 24 }) => {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.6, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;
```

- [ ] **Step 2: Verify type-check**

Run: `npm run type-check`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/interactive/Reveal.tsx
git commit -m "feat: add Reveal scroll-into-view wrapper"
```

---

### Task 9: `MagneticButton`

**Files:**
- Create: `src/components/interactive/MagneticButton.tsx`

- [ ] **Step 1: Implement the component**

Create `src/components/interactive/MagneticButton.tsx`:

```tsx
import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { useIsTouchDevice } from '../../hooks/useIsTouchDevice';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  /** Fraction of the cursor offset the element follows (0..1). */
  strength?: number;
}

/**
 * Wraps a CTA so it leans toward the cursor while hovered, springing back on
 * leave. No-ops (renders a plain inline-block span) on touch / reduced motion.
 */
const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className,
  strength = 0.4,
}) => {
  const reduced = usePrefersReducedMotion();
  const isTouch = useIsTouchDevice();
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15, mass: 0.3 });
  const springY = useSpring(y, { stiffness: 200, damping: 15, mass: 0.3 });

  if (reduced || isTouch) {
    return <span className={`inline-block ${className ?? ''}`}>{children}</span>;
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className ?? ''}`}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
};

export default MagneticButton;
```

- [ ] **Step 2: Verify type-check**

Run: `npm run type-check`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/interactive/MagneticButton.tsx
git commit -m "feat: add MagneticButton wrapper"
```

---

### Task 10: `TiltCard`

**Files:**
- Create: `src/components/interactive/TiltCard.tsx`

- [ ] **Step 1: Implement the component**

Create `src/components/interactive/TiltCard.tsx`:

```tsx
import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { useIsTouchDevice } from '../../hooks/useIsTouchDevice';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  /** Maximum tilt in degrees on each axis. */
  max?: number;
}

/**
 * Tilts its children in 3D toward the cursor and renders a soft radial glow
 * that follows the pointer. No-ops (plain div) on touch / reduced motion.
 * The glow assumes a rounded-2xl card; pass matching rounding via className.
 */
const TiltCard: React.FC<TiltCardProps> = ({ children, className, max = 7 }) => {
  const reduced = usePrefersReducedMotion();
  const isTouch = useIsTouchDevice();
  const ref = useRef<HTMLDivElement>(null);
  const [glow, setGlow] = useState({ x: 50, y: 50, active: false });

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 200, damping: 20 });

  if (reduced || isTouch) {
    return <div className={className}>{children}</div>;
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width; // 0..1
    const py = (event.clientY - rect.top) / rect.height; // 0..1
    rotateY.set((px - 0.5) * (max * 2));
    rotateX.set((0.5 - py) * (max * 2));
    setGlow({ x: px * 100, y: py * 100, active: true });
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    setGlow((prev) => ({ ...prev, active: false }));
  };

  return (
    <motion.div
      ref={ref}
      className={`relative ${className ?? ''}`}
      style={{
        rotateX: springX,
        rotateY: springY,
        transformStyle: 'preserve-3d',
        transformPerspective: 900,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
        style={{
          opacity: glow.active ? 1 : 0,
          background: `radial-gradient(circle at ${glow.x}% ${glow.y}%, rgba(0,207,253,0.12), transparent 60%)`,
        }}
      />
      {children}
    </motion.div>
  );
};

export default TiltCard;
```

- [ ] **Step 2: Verify type-check**

Run: `npm run type-check`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/interactive/TiltCard.tsx
git commit -m "feat: add TiltCard wrapper"
```

---

### Task 11: Wire App.tsx (page transitions + scroll-to-top + progress bar)

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Replace App.tsx**

Replace the entire contents of `src/App.tsx` with the following. This removes the inline lazy imports and `<Suspense><Routes>…` block (now owned by `AnimatedRoutes`) and mounts `ScrollToTop` + `ScrollProgress`. The console easter egg and time-message logic are unchanged.

```tsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/layout/Header';
import CustomCursor from './components/ui/CustomCursor';
import MatrixRain from './components/ui/MatrixRain';
import ErrorBoundary from './components/ErrorBoundary';
import AnimatedRoutes from './components/interactive/AnimatedRoutes';
import ScrollToTop from './components/interactive/ScrollToTop';
import ScrollProgress from './components/interactive/ScrollProgress';
import { useTimeBasedEasterEggs } from './hooks/useTimeBasedEasterEggs';
import { useKonamiCode } from './hooks/useKonamiCode';
import { motion, AnimatePresence } from 'framer-motion';
import './styles/globals.css';

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
          <ScrollToTop />
          <ScrollProgress />
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
              <AnimatedRoutes timeFeatures={timeFeatures} konamiActive={isKonamiActivated} />
            </ErrorBoundary>
          </main>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
```

- [ ] **Step 2: Verify type-check and tests**

Run: `npm run type-check`
Expected: no errors.

Run: `CI=true npx react-scripts test --watchAll=false`
Expected: all suites PASS (the existing `Hub.test.tsx` still renders Hub via the router).

- [ ] **Step 3: Manual verification**

Run: `npm start` and open the app.
- Navigate Hub → About → Work → Skills → Contact and back. Each route should fade + slide in/out (page transition A).
- On a scrollable page (Work/About), a thin gradient bar at the very top should fill as you scroll (B).
- Navigating to a new page should land scrolled to the top.
- Already-loaded routes should transition without a full-screen spinner flash.

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "feat: page transitions + scroll-to-top + scroll progress (A, B)"
```

---

### Task 12: Apply `Reveal` to the Work and Contact bottom blocks

**Files:**
- Modify: `src/components/sections/Work.tsx`
- Modify: `src/components/sections/Contact.tsx`

- [ ] **Step 1: Import Reveal in Work.tsx**

In `src/components/sections/Work.tsx`, add to the imports:

```tsx
import Reveal from '../interactive/Reveal';
```

- [ ] **Step 2: Wrap the Work bottom CTA in Reveal**

In `src/components/sections/Work.tsx`, find the bottom CTA block (originally lines 304-326):

```tsx
        {/* Bottom CTA */}
        <motion.div 
          variants={projectVariants}
          className="text-center mt-16"
        >
```

Replace that opening `<motion.div variants={projectVariants} className="text-center mt-16">` with:

```tsx
        {/* Bottom CTA */}
        <Reveal className="text-center mt-16">
```

And change its matching closing `</motion.div>` (the one immediately before `</motion.div>` that closes the outer container, i.e. the close of the CTA block) to `</Reveal>`.

- [ ] **Step 3: Import Reveal in Contact.tsx**

In `src/components/sections/Contact.tsx`, add to the imports:

```tsx
import Reveal from '../interactive/Reveal';
```

- [ ] **Step 4: Wrap the Contact bottom block in Reveal**

In `src/components/sections/Contact.tsx`, find the "Call to Action" block (originally lines 351-364):

```tsx
        {/* Call to Action */}
        <motion.div 
          variants={itemVariants}
          className="text-center mt-16 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 border border-white/5"
        >
```

Replace that opening tag with:

```tsx
        {/* Call to Action */}
        <Reveal className="text-center mt-16 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 border border-white/5">
```

And change its matching closing `</motion.div>` to `</Reveal>`.

- [ ] **Step 5: Verify type-check and tests**

Run: `npm run type-check`
Expected: no errors.

Run: `CI=true npx react-scripts test --watchAll=false`
Expected: all suites PASS.

- [ ] **Step 6: Manual verification**

Run `npm start`, open `/work` and `/contact`, scroll to the bottom: the CTA blocks should fade + rise into view as they enter the viewport.

- [ ] **Step 7: Commit**

```bash
git add src/components/sections/Work.tsx src/components/sections/Contact.tsx
git commit -m "feat: scroll-reveal the Work and Contact bottom CTAs (B)"
```

---

### Task 13: Apply `MagneticButton` to the About, Work, and Skills CTAs

**Files:**
- Modify: `src/components/sections/About.tsx`
- Modify: `src/components/sections/Work.tsx`
- Modify: `src/components/sections/Skills.tsx`

Each section already defines `const MotionLink = motion(Link);` and renders a gradient CTA. Wrap each CTA's `MotionLink` in `MagneticButton`.

- [ ] **Step 1: About.tsx — import and wrap**

In `src/components/sections/About.tsx`, add to the imports:

```tsx
import MagneticButton from '../interactive/MagneticButton';
```

Find the bottom CTA (originally lines 446-460):

```tsx
          <MotionLink
            to="/contact"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-full font-display font-semibold text-white hover:shadow-2xl transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Let's build something together
            <motion.span
              className="ml-2"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </MotionLink>
```

Wrap it in `MagneticButton`:

```tsx
          <MagneticButton>
            <MotionLink
              to="/contact"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-full font-display font-semibold text-white hover:shadow-2xl transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Let's build something together
              <motion.span
                className="ml-2"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </MotionLink>
          </MagneticButton>
```

- [ ] **Step 2: Work.tsx — import and wrap**

In `src/components/sections/Work.tsx`, add to the imports:

```tsx
import MagneticButton from '../interactive/MagneticButton';
```

Find the CTA `MotionLink` inside the (now) `Reveal` bottom block:

```tsx
          <MotionLink
            to="/contact"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-full font-display font-semibold text-white hover:shadow-2xl transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Let's discuss your project
            <motion.span
              className="ml-2"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </MotionLink>
```

Wrap it:

```tsx
          <MagneticButton>
            <MotionLink
              to="/contact"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-full font-display font-semibold text-white hover:shadow-2xl transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Let's discuss your project
              <motion.span
                className="ml-2"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </MotionLink>
          </MagneticButton>
```

- [ ] **Step 3: Skills.tsx — import and wrap**

In `src/components/sections/Skills.tsx`, add to the imports:

```tsx
import MagneticButton from '../interactive/MagneticButton';
```

Find the bottom CTA (originally lines 398-412):

```tsx
          <MotionLink
            to="/contact"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-full font-display font-semibold text-white hover:shadow-2xl transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Let's build something
            <motion.span
              className="ml-2"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </MotionLink>
```

Wrap it:

```tsx
          <MagneticButton>
            <MotionLink
              to="/contact"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-full font-display font-semibold text-white hover:shadow-2xl transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Let's build something
              <motion.span
                className="ml-2"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </MotionLink>
          </MagneticButton>
```

- [ ] **Step 4: Verify type-check and tests**

Run: `npm run type-check`
Expected: no errors.

Run: `CI=true npx react-scripts test --watchAll=false`
Expected: all suites PASS.

- [ ] **Step 5: Manual verification**

Run `npm start`; on About/Work/Skills, hover near each gradient CTA on desktop — the button should lean toward the cursor and spring back on leave. Resize to a narrow window (or use a touch device): the magnetic effect should be off.

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/About.tsx src/components/sections/Work.tsx src/components/sections/Skills.tsx
git commit -m "feat: magnetic CTAs on About, Work, Skills (C)"
```

---

### Task 14: Apply `TiltCard` to the Work project cards

**Files:**
- Modify: `src/components/sections/Work.tsx`

- [ ] **Step 1: Import TiltCard**

In `src/components/sections/Work.tsx`, add to the imports:

```tsx
import TiltCard from '../interactive/TiltCard';
```

- [ ] **Step 2: Wrap each project card with TiltCard**

Find the project map (originally lines 175-181):

```tsx
          {projects.map((project) => (
            <motion.div
              key={project.id}
              variants={projectVariants}
              className="bg-surface/30 rounded-2xl border border-white/5 overflow-hidden hover:border-white/10 transition-all duration-300"
              whileHover={{ y: -4 }}
            >
              <div className="p-6 md:p-8">
```

Replace it with (move the card surface styling onto `TiltCard`, keep the entrance variant on the outer `motion.div`, drop the `whileHover={{ y: -4 }}` since tilt replaces it):

```tsx
          {projects.map((project) => (
            <motion.div key={project.id} variants={projectVariants}>
              <TiltCard className="bg-surface/30 rounded-2xl border border-white/5 overflow-hidden hover:border-white/10 transition-all duration-300">
                <div className="p-6 md:p-8">
```

- [ ] **Step 3: Close the TiltCard wrapper**

The original card closed with:

```tsx
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
```

Change it to close the new `<TiltCard>`:

```tsx
                </AnimatePresence>
              </div>
              </TiltCard>
            </motion.div>
          ))}
```

(The `<div className="p-6 md:p-8">` that opened the card body now closes before `</TiltCard>`.)

- [ ] **Step 4: Verify type-check and tests**

Run: `npm run type-check`
Expected: no errors.

Run: `CI=true npx react-scripts test --watchAll=false`
Expected: all suites PASS.

- [ ] **Step 5: Manual verification**

Run `npm start`, open `/work`, move the cursor across a project card on desktop: the card should tilt in 3D toward the cursor with a soft glow that follows the pointer, and reset on leave. Expanding/collapsing "View Details" must still work. On a narrow/touch viewport, no tilt.

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/Work.tsx
git commit -m "feat: 3D tilt + glow on Work project cards (C)"
```

---

## Plan 1 Completion Check

- [ ] `npm run type-check` passes.
- [ ] `CI=true npx react-scripts test --watchAll=false` — all suites pass.
- [ ] Manual: route transitions, scroll progress bar, scroll-to-top, scroll-reveal CTAs, magnetic CTAs, tilt cards all behave on desktop; all motion-heavy effects are disabled on touch/narrow viewports and under `prefers-reduced-motion`.

## What Plan 1 Deliberately Defers

- New homepage, voice pass, proof-of-work links, résumé, OG image → **Plan 2 (Character & Content)**.
- Command palette (D), Work filtering (F), skills constellation (E) → **Plan 3 (Power Interactions)**.
- Broad per-item scroll-reveal of the About story, project list, and skills list is left to the plans that already edit those files, to avoid editing the same regions twice.
