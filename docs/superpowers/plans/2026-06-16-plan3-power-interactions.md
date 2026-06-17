# Portfolio Power Interactions — Implementation Plan (Plan 3 of 3)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the three signature interactions — a ⌘K command palette (D), animated Work filtering (F), and an interactive Skills constellation (E) — with no new dependencies, all degrading gracefully on touch/reduced-motion.

**Architecture:** Pure, tested logic (`fuzzyMatch`, command registry, project filter) is split from thin visual layers. The command palette self-manages open state via a global key listener and shares the Matrix-rain trigger with the Konami code by lifting a manual-trigger flag into `App`. Work gains a filter bar driven by a pure filter function with `layout`-animated reflow. The Skills page renders a deterministic SVG constellation on desktop and keeps the existing card grid as the touch/reduced-motion fallback.

**Tech Stack:** React 18, TypeScript 4.9, Framer Motion 10, React Router 6, CRA, Jest + Testing Library. **No new dependencies.**

---

## Environment notes (read first)

- Working directory: `/Users/akhil/Desktop/Portfolio 2/akhil-portfolio`. Branch: `feature/portfolio-interactivity`.
- **Jest is very slow here** (~90s/run). Use `npm run type-check` (fast) as the primary gate; run jest only for the logic-test tasks below, with Bash `timeout` set to `200000`. Single-file form: `CI=true npx react-scripts test --watchAll=false <path>`.
- Existing pieces this plan builds on: `usePrefersReducedMotion`, `useIsTouchDevice` (`src/hooks/`), `MagneticButton`/`TiltCard` (`src/components/interactive/`), `projects` (`src/data/projects.ts`), `useKonamiCode` (returns `{ isKonamiActivated }`, auto-resets), `MatrixRain` (prop `isActive: boolean`), Skills' `techDomains` data (inline in `src/components/sections/Skills.tsx`), `TechDomain`/`Skill` types (`src/types/index.ts`). Contact email is `akgudapuri@gmail.com`; GitHub `https://github.com/Akhil-Lokesh`; LinkedIn `https://www.linkedin.com/in/akhilgudapuri/`.

---

## File Structure

| File | Responsibility |
|------|----------------|
| `src/components/interactive/fuzzyMatch.ts` (create) | Subsequence fuzzy scorer |
| `src/components/interactive/fuzzyMatch.test.ts` (create) | Scorer tests |
| `src/components/interactive/command-registry.ts` (create) | Command list + `filterCommands` |
| `src/components/interactive/command-registry.test.ts` (create) | Registry/filter tests |
| `src/components/interactive/CommandPalette.tsx` (create) | ⌘K dialog (self-managed) |
| `src/components/interactive/CommandPalette.test.tsx` (create) | Open/close/filter test |
| `src/App.tsx` (modify) | Mount palette; lift manual Matrix trigger |
| `src/components/home/Home.tsx` (modify) | Subtle ⌘K hint |
| `src/components/sections/workFilter.ts` (create) | Pure `filterProjects` |
| `src/components/sections/workFilter.test.ts` (create) | Filter tests |
| `src/components/sections/Work.tsx` (modify) | Filter bar + animated reflow |
| `src/components/interactive/SkillConstellation.tsx` (create) | Desktop SVG constellation |
| `src/components/sections/Skills.tsx` (modify) | Render constellation on desktop; cards fallback |

---

### Task 1: `fuzzyMatch` scorer (TDD)

**Files:** Create `src/components/interactive/fuzzyMatch.ts` + `fuzzyMatch.test.ts`.

- [ ] **Step 1: Write the failing test** — `src/components/interactive/fuzzyMatch.test.ts`:

```ts
import { fuzzyMatch } from './fuzzyMatch';

describe('fuzzyMatch', () => {
  test('empty query scores 0 (matches anything)', () => {
    expect(fuzzyMatch('', 'Anything')).toBe(0);
  });

  test('returns -1 when characters are missing or out of order', () => {
    expect(fuzzyMatch('xyz', 'About')).toBe(-1);
    expect(fuzzyMatch('ba', 'About')).toBe(-1); // 'b' before 'a' not in order
  });

  test('matches a subsequence', () => {
    expect(fuzzyMatch('wk', 'My Work')).toBeGreaterThan(0);
  });

  test('scores a prefix/start-of-word match higher than a scattered one', () => {
    const prefix = fuzzyMatch('work', 'Work');
    const scattered = fuzzyMatch('work', 'Will Order Real Kites');
    expect(prefix).toBeGreaterThan(scattered);
  });

  test('is case-insensitive', () => {
    expect(fuzzyMatch('ABOUT', 'about me')).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run → FAIL.** `CI=true npx react-scripts test --watchAll=false src/components/interactive/fuzzyMatch.test.ts` (timeout 200000). Expect: module not found.

- [ ] **Step 3: Implement** — `src/components/interactive/fuzzyMatch.ts`:

```ts
/**
 * Scores how well `query` fuzzy-matches `text`.
 * Returns -1 if not all query chars appear in order; otherwise a score >= 0
 * where consecutive and start-of-word matches score higher. Empty query => 0.
 */
export function fuzzyMatch(query: string, text: string): number {
  if (!query) return 0;
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  let qi = 0;
  let score = 0;
  let lastMatch = -2;

  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      score += 1;
      if (lastMatch === ti - 1) score += 2; // consecutive run bonus
      if (ti === 0 || t[ti - 1] === ' ') score += 3; // start-of-word bonus
      lastMatch = ti;
      qi += 1;
    }
  }

  return qi === q.length ? score : -1;
}
```

- [ ] **Step 4: Run → PASS** (5 tests). Same command as Step 2.

- [ ] **Step 5: Commit.**
```bash
git add src/components/interactive/fuzzyMatch.ts src/components/interactive/fuzzyMatch.test.ts
git commit -m "feat: add fuzzyMatch scorer for command palette"
```

---

### Task 2: Command registry (TDD)

**Files:** Create `src/components/interactive/command-registry.ts` + `command-registry.test.ts`.

- [ ] **Step 1: Write the failing test** — `src/components/interactive/command-registry.test.ts`:

```ts
import { getCommands, filterCommands, CommandContext } from './command-registry';

const ctx: CommandContext = {
  navigate: () => {},
  triggerMatrix: () => {},
};

describe('command registry', () => {
  test('provides navigation, action, and fun commands', () => {
    const cmds = getCommands(ctx);
    const groups = new Set(cmds.map((c) => c.group));
    expect(groups.has('Navigate')).toBe(true);
    expect(groups.has('Actions')).toBe(true);
    expect(groups.has('Fun')).toBe(true);
    expect(cmds.find((c) => c.id === 'nav-work')).toBeTruthy();
    expect(cmds.find((c) => c.id === 'action-resume')).toBeTruthy();
  });

  test('empty query returns all commands in original order', () => {
    const cmds = getCommands(ctx);
    expect(filterCommands(cmds, '')).toHaveLength(cmds.length);
  });

  test('filters and ranks by fuzzy score', () => {
    const cmds = getCommands(ctx);
    const result = filterCommands(cmds, 'work');
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].id).toBe('nav-work');
  });

  test('drops non-matching commands', () => {
    const cmds = getCommands(ctx);
    const result = filterCommands(cmds, 'zzzzzz');
    expect(result).toHaveLength(0);
  });
});
```

- [ ] **Step 2: Run → FAIL.** `CI=true npx react-scripts test --watchAll=false src/components/interactive/command-registry.test.ts` (timeout 200000).

- [ ] **Step 3: Implement** — `src/components/interactive/command-registry.ts`:

```ts
import { fuzzyMatch } from './fuzzyMatch';

export type CommandGroup = 'Navigate' | 'Actions' | 'Fun';

export interface CommandContext {
  navigate: (path: string) => void;
  triggerMatrix: () => void;
}

export interface Command {
  id: string;
  label: string;
  group: CommandGroup;
  hint?: string;
  /** Extra text included in fuzzy matching but not displayed. */
  keywords?: string;
  perform: () => void;
}

const EMAIL = 'akgudapuri@gmail.com';
const GITHUB = 'https://github.com/Akhil-Lokesh';
const LINKEDIN = 'https://www.linkedin.com/in/akhilgudapuri/';

function openExternal(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer');
}

export function getCommands(ctx: CommandContext): Command[] {
  return [
    { id: 'nav-home', label: 'Go to Home', group: 'Navigate', keywords: 'hub start', perform: () => ctx.navigate('/') },
    { id: 'nav-about', label: 'Go to About', group: 'Navigate', keywords: 'bio story', perform: () => ctx.navigate('/about') },
    { id: 'nav-work', label: 'Go to Work', group: 'Navigate', keywords: 'projects portfolio', perform: () => ctx.navigate('/work') },
    { id: 'nav-skills', label: 'Go to Skills', group: 'Navigate', keywords: 'tech stack', perform: () => ctx.navigate('/skills') },
    { id: 'nav-contact', label: 'Go to Contact', group: 'Navigate', keywords: 'email reach hire', perform: () => ctx.navigate('/contact') },
    { id: 'action-resume', label: 'Download résumé', group: 'Actions', keywords: 'cv pdf', perform: () => openExternal('/resume.pdf') },
    { id: 'action-email', label: 'Copy email address', group: 'Actions', keywords: 'contact mail', perform: () => { if (navigator.clipboard) navigator.clipboard.writeText(EMAIL); } },
    { id: 'action-github', label: 'Open GitHub', group: 'Actions', keywords: 'code repos', perform: () => openExternal(GITHUB) },
    { id: 'action-linkedin', label: 'Open LinkedIn', group: 'Actions', keywords: 'profile network', perform: () => openExternal(LINKEDIN) },
    { id: 'fun-matrix', label: 'Enter the Matrix', group: 'Fun', keywords: 'rain easter egg konami', perform: () => ctx.triggerMatrix() },
  ];
}

/** Returns commands whose label/keywords fuzzy-match the query, ranked best-first. Empty query keeps original order. */
export function filterCommands(commands: Command[], query: string): Command[] {
  if (!query.trim()) return commands;
  return commands
    .map((cmd) => ({ cmd, score: fuzzyMatch(query, `${cmd.label} ${cmd.keywords ?? ''}`) }))
    .filter((entry) => entry.score >= 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.cmd);
}
```

- [ ] **Step 4: Run → PASS** (4 tests).

- [ ] **Step 5: Commit.**
```bash
git add src/components/interactive/command-registry.ts src/components/interactive/command-registry.test.ts
git commit -m "feat: add command registry + filterCommands"
```

---

### Task 3: `CommandPalette` component

**Files:** Create `src/components/interactive/CommandPalette.tsx` + `CommandPalette.test.tsx`.

- [ ] **Step 1: Implement** — `src/components/interactive/CommandPalette.tsx`:

```tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getCommands, filterCommands, Command } from './command-registry';

interface CommandPaletteProps {
  onTriggerMatrix: () => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ onTriggerMatrix }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  const commands = useMemo(
    () => getCommands({ navigate, triggerMatrix: onTriggerMatrix }),
    [navigate, onTriggerMatrix]
  );
  const results = useMemo(() => filterCommands(commands, query), [commands, query]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setActiveIndex(0);
    restoreFocusRef.current?.focus?.();
  }, []);

  const run = useCallback(
    (cmd: Command | undefined) => {
      if (!cmd) return;
      close();
      cmd.perform();
    },
    [close]
  );

  // Global open shortcut (Cmd/Ctrl+K)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((prev) => {
          if (!prev) restoreFocusRef.current = document.activeElement as HTMLElement;
          return !prev;
        });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Focus the input when opening
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Keep the active index in range as results change
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const onInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      run(results[activeIndex]);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[18vh] px-4 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="w-full max-w-lg bg-surface/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onInputKeyDown}
              placeholder="Type a command or search…"
              aria-label="Search commands"
              className="w-full bg-transparent px-5 py-4 text-foreground placeholder-foreground/40 outline-none font-sans border-b border-white/10"
            />
            <ul className="max-h-72 overflow-y-auto py-2">
              {results.length === 0 && (
                <li className="px-5 py-3 text-sm text-foreground/50 font-sans">No matching commands.</li>
              )}
              {results.map((cmd, i) => (
                <li key={cmd.id}>
                  <button
                    type="button"
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => run(cmd)}
                    className={`w-full flex items-center justify-between gap-4 px-5 py-2.5 text-left transition-colors ${
                      i === activeIndex ? 'bg-primary/15 text-foreground' : 'text-foreground/80 hover:bg-white/5'
                    }`}
                  >
                    <span className="font-sans text-sm">{cmd.label}</span>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-foreground/40">{cmd.group}</span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
```

- [ ] **Step 2: Write the test** — `src/components/interactive/CommandPalette.test.tsx`:

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CommandPalette from './CommandPalette';

function setup() {
  return render(
    <MemoryRouter>
      <CommandPalette onTriggerMatrix={() => {}} />
    </MemoryRouter>
  );
}

describe('CommandPalette', () => {
  test('is closed until Cmd/Ctrl+K, then opens with a search box', () => {
    setup();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'k', metaKey: true });
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByLabelText(/search commands/i)).toBeInTheDocument();
  });

  test('filters commands as the user types', () => {
    setup();
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    const input = screen.getByLabelText(/search commands/i);
    fireEvent.change(input, { target: { value: 'work' } });
    expect(screen.getByText('Go to Work')).toBeInTheDocument();
    expect(screen.queryByText('Open GitHub')).not.toBeInTheDocument();
  });

  test('Escape closes the palette', () => {
    setup();
    fireEvent.keyDown(window, { key: 'k', metaKey: true });
    const input = screen.getByLabelText(/search commands/i);
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Verify.**
Run: `npm run type-check` → no errors.
Run: `CI=true npx react-scripts test --watchAll=false src/components/interactive/CommandPalette.test.tsx` (timeout 200000) → PASS (3 tests).

- [ ] **Step 4: Commit.**
```bash
git add src/components/interactive/CommandPalette.tsx src/components/interactive/CommandPalette.test.tsx
git commit -m "feat: add Cmd-K command palette"
```

---

### Task 4: Wire palette into App (+ shared Matrix trigger) and add the homepage ⌘K hint

**Files:** Modify `src/App.tsx`, `src/components/home/Home.tsx`.

- [ ] **Step 1: App — lift a manual Matrix trigger and mount the palette.**

In `src/App.tsx`:
- Change the React import to include the hooks used: `import React, { useState, useCallback } from 'react';`
- Add the CommandPalette import with the other interactive imports:
  ```tsx
  import CommandPalette from './components/interactive/CommandPalette';
  ```
- Inside `App()`, after `const { isKonamiActivated } = useKonamiCode();`, add:
  ```tsx
  const [matrixManual, setMatrixManual] = useState(false);
  const triggerMatrix = useCallback(() => {
    setMatrixManual(true);
    setTimeout(() => setMatrixManual(false), 8000);
  }, []);
  ```
- Change the MatrixRain render from `<MatrixRain isActive={isKonamiActivated} />` to:
  ```tsx
  <MatrixRain isActive={isKonamiActivated || matrixManual} />
  ```
- Mount the palette inside `<Router>` (it uses `useNavigate`). Add it right after `<ScrollProgress />`:
  ```tsx
  <CommandPalette onTriggerMatrix={triggerMatrix} />
  ```

- [ ] **Step 2: Home — add a subtle ⌘K hint.**

In `src/components/home/Home.tsx`, immediately AFTER the résumé `</motion.div>` block (the one wrapping the `MagneticButton`) and BEFORE the closing `</motion.div>` of the main content container, add:

```tsx
        <motion.p variants={item} className="mt-5 text-xs font-mono text-foreground/40">
          press <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-foreground/60">⌘K</kbd> to jump anywhere
        </motion.p>
```

- [ ] **Step 3: Verify.**
Run: `npm run type-check` → no errors.
Run: `CI=true npx react-scripts test --watchAll=false` (timeout 200000) → all suites PASS.

- [ ] **Step 4: Manual check.** `npm start`: press ⌘K (or Ctrl+K) anywhere → palette opens; type "work" + Enter → navigates to /work; run "Enter the Matrix" → matrix rain shows then stops after ~8s; Konami code still triggers matrix.

- [ ] **Step 5: Commit.**
```bash
git add src/App.tsx src/components/home/Home.tsx
git commit -m "feat: mount command palette + shared Matrix trigger + homepage hint"
```

---

### Task 5: `filterProjects` pure function (TDD)

**Files:** Create `src/components/sections/workFilter.ts` + `workFilter.test.ts`.

- [ ] **Step 1: Write the failing test** — `src/components/sections/workFilter.test.ts`:

```ts
import { filterProjects } from './workFilter';
import { Project } from '../../types';

const make = (id: string, technologies: string[], year: number): Project => ({
  id,
  title: id,
  description: '',
  detailedDescription: '',
  keyFeatures: [],
  technicalChallenge: '',
  technologies,
  githubUrl: '',
  year,
});

const sample: Project[] = [
  make('a', ['Python', 'AWS'], 2024),
  make('b', ['React', 'Node.js'], 2023),
  make('c', ['Python', 'React'], 2023),
];

describe('filterProjects', () => {
  test('no filters returns everything', () => {
    expect(filterProjects(sample, [], [])).toHaveLength(3);
  });

  test('tech filter is match-any (OR) within the dimension', () => {
    const r = filterProjects(sample, ['Python', 'Node.js'], []);
    expect(r.map((p) => p.id).sort()).toEqual(['a', 'b', 'c']);
    const r2 = filterProjects(sample, ['AWS'], []);
    expect(r2.map((p) => p.id)).toEqual(['a']);
  });

  test('year filter is match-any within the dimension', () => {
    expect(filterProjects(sample, [], [2023]).map((p) => p.id).sort()).toEqual(['b', 'c']);
  });

  test('tech AND year combine across dimensions', () => {
    expect(filterProjects(sample, ['Python'], [2023]).map((p) => p.id)).toEqual(['c']);
  });
});
```

- [ ] **Step 2: Run → FAIL.** `CI=true npx react-scripts test --watchAll=false src/components/sections/workFilter.test.ts` (timeout 200000).

- [ ] **Step 3: Implement** — `src/components/sections/workFilter.ts`:

```ts
import { Project } from '../../types';

/**
 * Filters projects by selected technologies and years.
 * Within a dimension the match is ANY (OR); across the two dimensions it is AND.
 * An empty selection for a dimension imposes no constraint for that dimension.
 */
export function filterProjects(
  projects: Project[],
  selectedTechs: string[],
  selectedYears: number[]
): Project[] {
  return projects.filter((p) => {
    const techOk = selectedTechs.length === 0 || p.technologies.some((t) => selectedTechs.includes(t));
    const yearOk = selectedYears.length === 0 || selectedYears.includes(p.year);
    return techOk && yearOk;
  });
}
```

- [ ] **Step 4: Run → PASS** (4 tests).

- [ ] **Step 5: Commit.**
```bash
git add src/components/sections/workFilter.ts src/components/sections/workFilter.test.ts
git commit -m "feat: add filterProjects pure function"
```

---

### Task 6: Work filter bar + animated reflow

**Files:** Modify `src/components/sections/Work.tsx`.

- [ ] **Step 1: Add imports + derived filter data + state.**

In `src/components/sections/Work.tsx`, add to the imports:
```tsx
import { filterProjects } from './workFilter';
```

Inside the `Work` component, right after `const [selectedProject, setSelectedProject] = useState<string | null>(null);`, add:
```tsx
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);

  const allTechs = Array.from(new Set(projects.flatMap((p) => p.technologies))).sort();
  const allYears = Array.from(new Set(projects.map((p) => p.year))).sort((a, b) => b - a);
  const visibleProjects = filterProjects(projects, selectedTechs, selectedYears);

  const toggleTech = (tech: string) =>
    setSelectedTechs((prev) => (prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]));
  const toggleYear = (year: number) =>
    setSelectedYears((prev) => (prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]));
  const clearFilters = () => {
    setSelectedTechs([]);
    setSelectedYears([]);
  };
```

- [ ] **Step 2: Render the filter bar before the projects list.**

Find the projects list opening:
```tsx
        {/* Projects Grid */}
        <div className="space-y-8">
          {projects.map((project) => (
```

Replace it with (adds a filter bar, switches the map to `visibleProjects`, wraps the list in `AnimatePresence` + `layout`):
```tsx
        {/* Filter bar */}
        <motion.div variants={projectVariants} className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <button
              type="button"
              onClick={clearFilters}
              className={`text-xs font-mono px-3 py-1 rounded-full border transition-colors ${
                selectedTechs.length === 0 && selectedYears.length === 0
                  ? 'border-primary/50 text-primary bg-primary/10'
                  : 'border-white/10 text-foreground/60 hover:text-foreground hover:border-white/20'
              }`}
            >
              All
            </button>
            {allYears.map((year) => (
              <button
                key={year}
                type="button"
                onClick={() => toggleYear(year)}
                className={`text-xs font-mono px-3 py-1 rounded-full border transition-colors ${
                  selectedYears.includes(year)
                    ? 'border-secondary/60 text-secondary bg-secondary/10'
                    : 'border-white/10 text-foreground/60 hover:text-foreground hover:border-white/20'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {allTechs.map((tech) => (
              <button
                key={tech}
                type="button"
                onClick={() => toggleTech(tech)}
                className={`text-xs font-mono px-3 py-1 rounded-full border transition-colors ${
                  selectedTechs.includes(tech)
                    ? 'border-primary/50 text-primary bg-primary/10'
                    : 'border-white/10 text-foreground/55 hover:text-foreground hover:border-white/20'
                }`}
              >
                {tech}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs font-mono text-foreground/40">
            Showing {visibleProjects.length} of {projects.length} projects
          </p>
        </motion.div>

        {/* Projects Grid */}
        <motion.div layout className="space-y-8">
          <AnimatePresence>
          {visibleProjects.map((project) => (
```

- [ ] **Step 3: Add `layout` + exit animation to each card and close the new wrappers.**

Find the card's outer element (added in Plan 1):
```tsx
            <motion.div key={project.id} variants={projectVariants}>
              <TiltCard className="bg-surface/30 rounded-2xl border border-white/5 overflow-hidden hover:border-white/10 transition-all duration-300">
```
Replace its opening `<motion.div ...>` with (add `layout` + `exit`):
```tsx
            <motion.div key={project.id} variants={projectVariants} layout exit={{ opacity: 0, scale: 0.95 }}>
              <TiltCard className="bg-surface/30 rounded-2xl border border-white/5 overflow-hidden hover:border-white/10 transition-all duration-300">
```

Then find where the map currently closes:
```tsx
              </TiltCard>
            </motion.div>
          ))}
        </div>
```
Replace it with (close `AnimatePresence` and the new `motion.div`):
```tsx
              </TiltCard>
            </motion.div>
          ))}
          </AnimatePresence>
        </motion.div>
```

- [ ] **Step 4: Verify.**
Run: `npm run type-check` → no errors.
Run: `CI=true npx react-scripts test --watchAll=false` (timeout 200000) → all PASS.

- [ ] **Step 5: Manual check.** `/work`: clicking tech/year chips filters and animates the grid; "All" resets; count updates; expand/collapse still works.

- [ ] **Step 6: Commit.**
```bash
git add src/components/sections/Work.tsx
git commit -m "feat: animated Work filtering by tech + year"
```

---

### Task 7: `SkillConstellation` component

**Files:** Create `src/components/interactive/SkillConstellation.tsx`.

This renders a deterministic radial constellation in a square area: domain "hub" nodes around the center, each domain's skills orbiting its hub, SVG lines connecting them. Hovering highlights a node and its connections; clicking a hub calls `onSelectDomain`. Nodes are draggable and spring back.

- [ ] **Step 1: Implement** — `src/components/interactive/SkillConstellation.tsx`:

```tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TechDomain } from '../../types';

interface SkillConstellationProps {
  domains: TechDomain[];
  selectedDomain: string | null;
  onSelectDomain: (name: string) => void;
}

interface PlacedSkill {
  key: string;
  name: string;
  x: number;
  y: number;
}
interface PlacedDomain {
  name: string;
  label: string;
  icon: string;
  x: number;
  y: number;
  skills: PlacedSkill[];
}

const CENTER = 50;
const HUB_RADIUS = 33;
const SKILL_RADIUS = 12;

function placeDomains(domains: TechDomain[]): PlacedDomain[] {
  return domains.map((domain, i) => {
    const angle = (i / domains.length) * Math.PI * 2 - Math.PI / 2;
    const x = CENTER + HUB_RADIUS * Math.cos(angle);
    const y = CENTER + HUB_RADIUS * Math.sin(angle);
    const skills = domain.skills.map((skill, j) => {
      const sa = (j / domain.skills.length) * Math.PI * 2;
      return {
        key: `${domain.name}-${skill.name}`,
        name: skill.name,
        x: x + SKILL_RADIUS * Math.cos(sa),
        y: y + SKILL_RADIUS * Math.sin(sa),
      };
    });
    return { name: domain.name, label: domain.label, icon: domain.icon, x, y, skills };
  });
}

const SkillConstellation: React.FC<SkillConstellationProps> = ({ domains, selectedDomain, onSelectDomain }) => {
  const [hovered, setHovered] = useState<string | null>(null);
  const placed = placeDomains(domains);

  const isDimmed = (domainName: string) => {
    const active = hovered ?? selectedDomain;
    return active !== null && active !== domainName;
  };

  return (
    <div className="relative mx-auto aspect-square w-full max-w-2xl select-none">
      {/* Connection lines */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
        {placed.map((domain) => (
          <g key={`lines-${domain.name}`} style={{ opacity: isDimmed(domain.name) ? 0.12 : 1, transition: 'opacity 0.3s' }}>
            <line x1={CENTER} y1={CENTER} x2={domain.x} y2={domain.y} stroke="rgba(244,247,255,0.12)" strokeWidth={0.25} />
            {domain.skills.map((skill) => (
              <line
                key={`line-${skill.key}`}
                x1={domain.x}
                y1={domain.y}
                x2={skill.x}
                y2={skill.y}
                stroke="rgba(0,207,253,0.18)"
                strokeWidth={0.2}
              />
            ))}
          </g>
        ))}
      </svg>

      {/* Center node */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-primary to-secondary shadow-lg flex items-center justify-center text-white font-display font-bold"
        style={{ left: `${CENTER}%`, top: `${CENTER}%`, width: 56, height: 56, fontSize: 12 }}
      >
        AK
      </div>

      {/* Domain hubs + skills */}
      {placed.map((domain) => (
        <div key={domain.name} style={{ opacity: isDimmed(domain.name) ? 0.2 : 1, transition: 'opacity 0.3s' }}>
          {domain.skills.map((skill) => (
            <motion.button
              key={skill.key}
              type="button"
              drag
              dragSnapToOrigin
              dragElastic={0.4}
              whileHover={{ scale: 1.25, zIndex: 20 }}
              onHoverStart={() => setHovered(domain.name)}
              onHoverEnd={() => setHovered(null)}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-surface/80 border border-white/15 text-[10px] font-mono text-foreground/80 px-2 py-1 whitespace-nowrap hover:border-secondary/60 hover:text-foreground cursor-grab active:cursor-grabbing"
              style={{ left: `${skill.x}%`, top: `${skill.y}%` }}
              title={skill.name}
            >
              {skill.name}
            </motion.button>
          ))}
          <motion.button
            type="button"
            drag
            dragSnapToOrigin
            dragElastic={0.3}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.97 }}
            onHoverStart={() => setHovered(domain.name)}
            onHoverEnd={() => setHovered(null)}
            onClick={() => onSelectDomain(domain.name)}
            aria-pressed={selectedDomain === domain.name}
            className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-2xl px-3 py-2 flex items-center gap-2 shadow-lg cursor-grab active:cursor-grabbing transition-colors ${
              selectedDomain === domain.name
                ? 'bg-primary/25 border border-primary/60'
                : 'bg-surface/90 border border-white/15 hover:border-white/30'
            }`}
            style={{ left: `${domain.x}%`, top: `${domain.y}%`, zIndex: 10 }}
          >
            <span className="text-lg">{domain.icon}</span>
            <span className="text-xs font-display font-semibold text-foreground whitespace-nowrap">{domain.label}</span>
          </motion.button>
        </div>
      ))}
    </div>
  );
};

export default SkillConstellation;
```

- [ ] **Step 2: Verify.**
Run: `npm run type-check` → no errors. (Component is standalone; integrated in Task 8.)

- [ ] **Step 3: Commit.**
```bash
git add src/components/interactive/SkillConstellation.tsx
git commit -m "feat: add interactive SkillConstellation"
```

---

### Task 8: Render the constellation on desktop in Skills (cards as fallback)

**Files:** Modify `src/components/sections/Skills.tsx`.

- [ ] **Step 1: Add imports + gating hooks.**

In `src/components/sections/Skills.tsx`, add to the imports:
```tsx
import SkillConstellation from '../interactive/SkillConstellation';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { useIsTouchDevice } from '../../hooks/useIsTouchDevice';
```

Inside the `Skills` component, after the existing `useState` hooks, add:
```tsx
  const reduced = usePrefersReducedMotion();
  const isTouch = useIsTouchDevice();
  const useConstellation = !reduced && !isTouch;
```

- [ ] **Step 2: Render the constellation above the existing grid (grid hidden when constellation is active).**

Find the domains grid wrapper:
```tsx
          <div className="grid gap-6 items-start" style={{ 
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(350px, 100%), 1fr))',
            gridAutoFlow: 'row dense',
            gridAutoRows: 'min-content'
          }}>
```

Immediately BEFORE that `<div className="grid ...">`, insert the constellation (shown only on desktop), and make the grid conditional. Replace the line above with:

```tsx
          {useConstellation && (
            <div className="mb-10">
              <SkillConstellation
                domains={techDomains}
                selectedDomain={selectedDomain}
                onSelectDomain={handleDomainClick}
              />
              <p className="text-center text-xs font-mono text-foreground/40 mt-4">
                Hover to explore · drag the nodes · click a domain for details
              </p>
            </div>
          )}
          <div className={`${useConstellation ? 'hidden' : ''} grid gap-6 items-start`} style={{ 
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(350px, 100%), 1fr))',
            gridAutoFlow: 'row dense',
            gridAutoRows: 'min-content'
          }}>
```

(Everything inside the grid — the domain cards and their expand panels — stays exactly as is, serving as the touch/reduced-motion fallback. `handleDomainClick` and `selectedDomain` are reused so clicking a hub still drives the existing easter-egg click counts and selection.)

- [ ] **Step 3: When the constellation is active, show the selected domain's detail panel below it.**

The existing grid cards render skill details inline when expanded; in constellation mode that grid is hidden, so add a detail panel. Immediately AFTER the closing `</div>` of the grid block (the grid you just edited), add:

```tsx
          {useConstellation && selectedDomain && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 max-w-2xl mx-auto bg-surface/30 border border-white/10 rounded-2xl p-6"
            >
              {(() => {
                const domain = techDomains.find((d) => d.name === selectedDomain);
                if (!domain) return null;
                return (
                  <>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">{domain.icon}</span>
                      <h4 className="font-display font-semibold text-foreground text-lg">{domain.label}</h4>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {domain.skills.map((skill) => (
                        <div key={skill.name} className="flex items-start gap-3 p-3 bg-surface/20 rounded-xl">
                          <span className="text-lg">{skill.icon}</span>
                          <div>
                            <div className="font-display font-medium text-foreground text-sm">{skill.name}</div>
                            <div className="text-xs text-foreground/70 font-sans">{skill.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                );
              })()}
            </motion.div>
          )}
```

- [ ] **Step 4: Verify.**
Run: `npm run type-check` → no errors.
Run: `CI=true npx react-scripts test --watchAll=false` (timeout 200000) → all PASS.

- [ ] **Step 5: Manual check.** Desktop `/skills`: a constellation renders (center "AK", 7 domain hubs, skills orbiting); hovering dims the rest; dragging a node springs it back; clicking a hub shows its skill detail panel below. Narrow the window (or reduced-motion): the original card grid returns and works.

- [ ] **Step 6: Commit.**
```bash
git add src/components/sections/Skills.tsx
git commit -m "feat: interactive skills constellation on desktop, cards as fallback"
```

---

## Plan 3 Completion Check

- [ ] `npm run type-check` passes.
- [ ] `CI=true npx react-scripts test --watchAll=false` — all suites pass (fuzzyMatch, command-registry, CommandPalette, workFilter + earlier suites).
- [ ] Manual: ⌘K palette (open/filter/run/Esc, résumé + matrix commands), Work filtering animates, skills constellation on desktop with card fallback on touch/reduced-motion.

## Notes / deliberate scope choices

- Per-node continuous "idle float" is intentionally omitted — it conflicts with Framer drag; drag + spring-back + hover-highlight already make the constellation feel alive.
- The command palette intentionally has no visual "magnetic"/tilt; it is utility-first. Command labels carry light personality without dodging function.
- After Plan 3, the only remaining items are the user's content drop-ins (resume.pdf, avatar.jpg, og-image.png, real project links).
