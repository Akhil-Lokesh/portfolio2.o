# Portfolio Character & Content — Implementation Plan (Plan 2 of 3)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the aloof "remote control" Hub with a person-first, proof-forward homepage; apply the "playful-grounded" voice across About/Work; scaffold proof-of-work (per-project hooks + featured flag + GitHub/live links); and ship the résumé + Open Graph quick wins — all without new dependencies.

**Architecture:** A new `src/components/home/` holds the homepage (`Home`), a `FeaturedProject` card (reads the `featured` project from `src/data/projects.ts`), and an `Avatar` with a monogram fallback. The `/` route swaps from `Hub` to `Home`. Project data gains `hook` text + a `featured` flag. Copy edits land in About/Work. `public/index.html` gets richer OG/Twitter tags. All motion reuses the Plan 1 primitives (`MagneticButton`, `TiltCard`, `Reveal`).

**Tech Stack:** React 18, TypeScript 4.9, Framer Motion 10, React Router 6, CRA, Jest + Testing Library. **No new dependencies.**

---

## Environment notes (read first)

- Working directory: `/Users/akhil/Desktop/Portfolio 2/akhil-portfolio`. Branch: `feature/portfolio-interactivity` (continue here).
- **Jest is very slow here** (iCloud filesystem; ~90s/run). Use `npm run type-check` (fast) as the primary gate. Run jest only for the two test tasks below, and set the Bash `timeout` to `200000`. Single-file form: `CI=true npx react-scripts test --watchAll=false <path>`.

## Content the user provides (drop-in; code degrades gracefully without it)

These do NOT block any task — the code ships with fallbacks and empty values:
- `public/resume.pdf` — résumé download target. Until added, the link 404s (acceptable).
- `public/avatar.jpg` — homepage photo. Until added, `Avatar` shows an "AK" monogram automatically.
- `public/og-image.png` (1200×630) — social preview. Until added, the meta points at the path; scrapers fall back to text.
- Real `githubUrl` / `liveUrl` per project in `src/data/projects.ts` — links render only when non-empty.
- The `featured` project choice — defaults to `recommendation-engine`; change the flag to move it.

**Copy note:** All headline/hook/voice copy below is drafted in the approved "playful-grounded" voice. It is meant to be edited freely — treat it as a strong first draft, not sacred text.

---

## File Structure

| File | Responsibility |
|------|----------------|
| `src/data/projects.ts` (modify) | Add `hook` to each project; set `featured: true` on recommendation-engine |
| `src/data/projects.test.ts` (create) | Assert exactly one featured project, and it's the recsys |
| `src/components/home/Avatar.tsx` (create) | Photo with monogram fallback |
| `src/components/home/FeaturedProject.tsx` (create) | Hero proof card (reads featured project) |
| `src/components/home/Home.tsx` (create) | New `/` homepage |
| `src/components/home/Home.test.tsx` (create) | Render test: headline + nav links |
| `src/components/interactive/AnimatedRoutes.tsx` (modify) | Point `/` at `Home` instead of `Hub` |
| `src/pages/Hub.tsx` (delete) | Replaced by Home |
| `src/pages/Hub.test.tsx` (delete) | Replaced by Home.test |
| `src/components/sections/About.tsx` (modify) | Role-typewriter reorder + AI-line reframe |
| `src/components/sections/Work.tsx` (modify) | Show per-project `hook`; render `liveUrl` link |
| `src/components/sections/Contact.tsx` (modify) | Add résumé download button |
| `public/index.html` (modify) | Richer OG/Twitter meta + image tags |

---

### Task 1: Project data — hooks + featured flag

**Files:** Modify `src/data/projects.ts`; Create `src/data/projects.test.ts`.

- [ ] **Step 1: Add a `hook` to each project and `featured: true` to the recsys.**

In `src/data/projects.ts`, add a `hook` property to each of the seven objects (place it immediately after the `description` line of each), and add `featured: true` to the `recommendation-engine` object (e.g., right after its `year: 2024`). Use exactly these values:

- `spotify-analytics` → `hook: 'Processes 73K records without manual babysitting — the pipeline reruns itself while I sleep.',`
- `spotify-streaming` → `hook: 'A million events answered in constant memory. Approximate on purpose, and honest about the error bars.',`
- `airline-odyssey` → `hook: 'Got a graph database and a data warehouse to agree on why your flight was late.',`
- `recommendation-engine` → `hook: 'A million interactions, answered in under a second — nobody waits around for a "you might also like".',` AND add `featured: true,`
- `air-pollution` → `hook: 'Found the 30% pandemic pollution drop in the data before the headlines did.',`
- `learning-management` → `hook: '500 students hammering it at once. It did not flinch (much).',`
- `ubereats-prototype` → `hook: 'Two apps, one schema, zero double-charged dinners.',`

Example shape for one object after editing:

```ts
  {
    id: 'recommendation-engine',
    title: 'Large-Scale Recommendation Engine',
    description: 'Distributed recommendation system processing 1M+ user interactions with sub-second latency and 99.9% uptime using collaborative filtering.',
    hook: 'A million interactions, answered in under a second — nobody waits around for a "you might also like".',
    detailedDescription: 'Designed a scalable recommendation engine combining batch and real-time processing for dynamic, personalized recommendations across a distributed cluster.',
    keyFeatures: [
      'Collaborative Filtering with ALS algorithm on Apache Spark',
      'Kafka for real-time ingestion, Cassandra for low-latency storage',
      'HDFS for batch processing with Spark Structured Streaming',
      'Hybrid batch + real-time architecture for dynamic updates',
      'Real-time Tableau dashboard for recommendation metrics'
    ],
    technicalChallenge: 'Achieving sub-second latency while processing millions of interactions required a lambda architecture combining pre-computed batch recommendations with real-time updates.',
    technologies: ['Apache Spark', 'Kafka', 'Cassandra', 'HDFS', 'Python', 'ALS'],
    githubUrl: '',
    year: 2024,
    featured: true
  },
```

Do not change any other field values.

- [ ] **Step 2: Write the data test.** Create `src/data/projects.test.ts`:

```ts
import { projects } from './projects';

describe('projects data', () => {
  test('every project has a non-empty hook', () => {
    for (const p of projects) {
      expect(typeof p.hook).toBe('string');
      expect((p.hook ?? '').length).toBeGreaterThan(0);
    }
  });

  test('exactly one project is featured, and it is the recommendation engine', () => {
    const featured = projects.filter((p) => p.featured);
    expect(featured).toHaveLength(1);
    expect(featured[0].id).toBe('recommendation-engine');
  });
});
```

- [ ] **Step 3: Run the test.**
Run: `CI=true npx react-scripts test --watchAll=false src/data/projects.test.ts` (timeout 200000)
Expected: PASS (2 tests).

- [ ] **Step 4: Type-check + commit.**
Run: `npm run type-check` → no errors.
```bash
git add src/data/projects.ts src/data/projects.test.ts
git commit -m "feat: add project hooks + featured flag (proof-of-work scaffolding)"
```

---

### Task 2: `Avatar` component (photo with monogram fallback)

**Files:** Create `src/components/home/Avatar.tsx`.

- [ ] **Step 1: Implement.**

```tsx
import React, { useState } from 'react';

interface AvatarProps {
  size?: number;
  src?: string;
}

/**
 * Renders the visitor-facing avatar. Attempts to load an image; if it is missing
 * or fails to load (e.g. public/avatar.jpg not yet added), falls back to a
 * gradient "AK" monogram so the homepage always looks intentional.
 */
const Avatar: React.FC<AvatarProps> = ({ size = 88, src = '/avatar.jpg' }) => {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div
        className="rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-display font-bold text-white select-none shadow-lg"
        style={{ width: size, height: size, fontSize: size * 0.38 }}
        role="img"
        aria-label="Akhil Kumar"
      >
        AK
      </div>
    );
  }

  return (
    <img
      src={src}
      alt="Akhil Kumar"
      width={size}
      height={size}
      onError={() => setErrored(true)}
      className="rounded-full object-cover border border-white/10 shadow-lg"
      style={{ width: size, height: size }}
    />
  );
};

export default Avatar;
```

- [ ] **Step 2: Type-check + commit.**
Run: `npm run type-check` → no errors.
```bash
git add src/components/home/Avatar.tsx
git commit -m "feat: add Avatar with monogram fallback"
```

---

### Task 3: `FeaturedProject` hero card

**Files:** Create `src/components/home/FeaturedProject.tsx`.

- [ ] **Step 1: Implement.**

```tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { projects } from '../../data/projects';
import TiltCard from '../interactive/TiltCard';

const MotionLink = motion(Link);

/** The homepage hero card. Shows the project flagged `featured`, falling back to the first. */
const FeaturedProject: React.FC = () => {
  const featured = projects.find((p) => p.featured) ?? projects[0];

  return (
    <TiltCard className="text-left bg-surface/30 rounded-2xl border border-white/10 p-6 md:p-7 max-w-xl mx-auto">
      <div className="text-xs font-mono uppercase tracking-wider text-accent mb-2">
        Featured project
      </div>
      <h2 className="font-display font-bold text-xl md:text-2xl text-foreground mb-2">
        {featured.title}
      </h2>
      {featured.hook && (
        <p className="text-foreground/75 font-sans text-sm leading-relaxed mb-4">
          {featured.hook}
        </p>
      )}
      <div className="flex flex-wrap gap-2 mb-5">
        {featured.technologies.slice(0, 4).map((tech) => (
          <span key={tech} className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-mono">
            {tech}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-5">
        <MotionLink
          to="/work"
          className="inline-flex items-center gap-1.5 text-secondary hover:text-secondary/80 font-display font-medium text-sm"
          whileHover={{ x: 4 }}
        >
          Explore <span aria-hidden="true">→</span>
        </MotionLink>
        {featured.githubUrl && (
          <a
            href={featured.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-foreground/60 hover:text-foreground font-mono text-sm"
          >
            GitHub <span aria-hidden="true">↗</span>
          </a>
        )}
        {featured.liveUrl && (
          <a
            href={featured.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-foreground/60 hover:text-foreground font-mono text-sm"
          >
            Live <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>
    </TiltCard>
  );
};

export default FeaturedProject;
```

- [ ] **Step 2: Type-check + commit.**
Run: `npm run type-check` → no errors.
```bash
git add src/components/home/FeaturedProject.tsx
git commit -m "feat: add FeaturedProject hero card"
```

---

### Task 4: `Home` page

**Files:** Create `src/components/home/Home.tsx`.

- [ ] **Step 1: Implement.**

```tsx
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
```

- [ ] **Step 2: Type-check + commit.**
Run: `npm run type-check` → no errors.
```bash
git add src/components/home/Home.tsx
git commit -m "feat: add person-first Home page"
```

---

### Task 5: Swap `/` route to `Home`; replace Hub + its test

**Files:** Modify `src/components/interactive/AnimatedRoutes.tsx`; Create `src/components/home/Home.test.tsx`; Delete `src/pages/Hub.tsx` and `src/pages/Hub.test.tsx`.

- [ ] **Step 1: Point the `/` route at Home.**

In `src/components/interactive/AnimatedRoutes.tsx`:
- Change the Hub import line `import Hub from '../../pages/Hub';` to:
  ```tsx
  import Home from '../home/Home';
  ```
- Change the `/` route element from `<PageTransition><Hub /></PageTransition>` to:
  ```tsx
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
  ```

- [ ] **Step 2: Write the Home render test.** Create `src/components/home/Home.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';

function renderHome() {
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );
}

describe('Home', () => {
  test('shows the headline statement', () => {
    renderHome();
    expect(screen.getByText(/I make data behave/i)).toBeInTheDocument();
  });

  test('links to all four sections', () => {
    renderHome();
    expect(screen.getByRole('link', { name: /About Me/i })).toHaveAttribute('href', '/about');
    expect(screen.getByRole('link', { name: /My Work/i })).toHaveAttribute('href', '/work');
    expect(screen.getByRole('link', { name: /My Skills/i })).toHaveAttribute('href', '/skills');
    expect(screen.getByRole('link', { name: /Contact/i })).toHaveAttribute('href', '/contact');
  });
});
```

- [ ] **Step 3: Delete the old Hub files.**
```bash
git rm src/pages/Hub.tsx src/pages/Hub.test.tsx
```

- [ ] **Step 4: Verify.**
Run: `npm run type-check` → no errors (confirm nothing else imports `pages/Hub`).
Run: `CI=true npx react-scripts test --watchAll=false src/components/home/Home.test.tsx` (timeout 200000) → PASS (2 tests).

- [ ] **Step 5: Commit.**
```bash
git add src/components/interactive/AnimatedRoutes.tsx src/components/home/Home.test.tsx
git commit -m "feat: replace Hub with Home at / route"
```

---

### Task 6: About — voice pass (role reorder + AI-line reframe)

**Files:** Modify `src/components/sections/About.tsx`.

- [ ] **Step 1: Reorder the role typewriter to lead with professional roles and end on one wink.**

In `src/components/sections/About.tsx`, find the `roles` array inside the typewriter `useEffect` (currently):

```tsx
    const roles = [
      "Son", 
      "Student", 
      "Friend", 
      "Brother", 
      "CS Engineer", 
      "Data Analyst", 
      "Frontend Engineer", 
      "Prompt Engineer", 
      "Vibe Coder"
    ];
```

Replace it with:

```tsx
    const roles = [
      "Data Engineer",
      "ML Engineer",
      "Full-Stack Developer",
      "Data Analyst",
      "CS Engineer",
      "Vibe Coder (allegedly)"
    ];
```

- [ ] **Step 2: Reframe the AI-collaboration line as a confident flex.**

Find this paragraph:

```tsx
                <p className="text-foreground/85 font-sans leading-relaxed">
                  <strong>Plot twist #2:</strong> I worked with AI to write this. Because if you're going to talk about 
                  human-AI collaboration, might as well walk the walk, right?
                </p>
```

Replace its inner text (keep the `<p>` and `<strong>` wrapper structure) with:

```tsx
                <p className="text-foreground/85 font-sans leading-relaxed">
                  <strong>Plot twist #2:</strong> I built this with AI in the loop. If I'm going to talk about
                  human-AI collaboration, I'd rather ship it than slide-deck it.
                </p>
```

- [ ] **Step 3: Verify + commit.**
Run: `npm run type-check` → no errors.
```bash
git add src/components/sections/About.tsx
git commit -m "feat: About voice pass — lead with real roles, confident AI-collab line"
```

---

### Task 7: Work — show per-project hook + live demo link

**Files:** Modify `src/components/sections/Work.tsx`.

- [ ] **Step 1: Show the hook under each project description.**

In `src/components/sections/Work.tsx`, find the project description paragraph inside the card:

```tsx
                    <p className="text-foreground/80 font-sans leading-relaxed mb-4">
                      {project.description}
                    </p>
```

Replace it with (adds the hook as an accent line above the description):

```tsx
                    {project.hook && (
                      <p className="text-secondary/90 font-display italic text-sm leading-relaxed mb-2">
                        {project.hook}
                      </p>
                    )}
                    <p className="text-foreground/80 font-sans leading-relaxed mb-4">
                      {project.description}
                    </p>
```

- [ ] **Step 2: Render a live-demo link when present.**

Find the GitHub link block:

```tsx
                  {project.githubUrl && (
                    <motion.a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors font-mono text-sm"
                      whileHover={{ scale: 1.05 }}
                    >
                      <span>GitHub</span>
                      <span>↗</span>
                    </motion.a>
                  )}
```

Replace it with (keeps GitHub, adds a Live link beside it; wrap both in a flex row):

```tsx
                  <div className="flex items-center gap-4">
                    {project.githubUrl && (
                      <motion.a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors font-mono text-sm"
                        whileHover={{ scale: 1.05 }}
                      >
                        <span>GitHub</span>
                        <span>↗</span>
                      </motion.a>
                    )}
                    {project.liveUrl && (
                      <motion.a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors font-mono text-sm"
                        whileHover={{ scale: 1.05 }}
                      >
                        <span>Live</span>
                        <span>↗</span>
                      </motion.a>
                    )}
                  </div>
```

- [ ] **Step 3: Verify + commit.**
Run: `npm run type-check` → no errors.
```bash
git add src/components/sections/Work.tsx
git commit -m "feat: show project hooks and live-demo links in Work"
```

---

### Task 8: Contact — résumé download button

**Files:** Modify `src/components/sections/Contact.tsx`.

- [ ] **Step 1: Add a résumé button to the "Prefer a more direct approach?" row.**

In `src/components/sections/Contact.tsx`, find the alternative-contact row that contains the LinkedIn `motion.a`. Immediately AFTER the closing `</motion.a>` of the LinkedIn link and BEFORE the `</div>` that closes the `flex flex-wrap` row, add this résumé link:

```tsx
                <motion.a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-surface/20 rounded-full text-foreground/70 hover:text-foreground border border-white/5 hover:border-white/20 transition-all duration-300 text-sm font-mono"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>📄</span>
                  Résumé
                </motion.a>
```

- [ ] **Step 2: Verify + commit.**
Run: `npm run type-check` → no errors.
```bash
git add src/components/sections/Contact.tsx
git commit -m "feat: add resume download to Contact"
```

---

### Task 9: Open Graph / social preview meta

**Files:** Modify `public/index.html`.

- [ ] **Step 1: Replace the SEO + Open Graph + Twitter meta block.**

In `public/index.html`, replace the block from `<!-- SEO Meta Tags -->` through the end of the `<!-- Twitter Card Meta Tags -->` group (the contiguous run of `<meta name="description"...>` … `<meta name="twitter:creator"...>`, original lines 9–27) with:

```html
    <!-- SEO Meta Tags -->
    <meta name="description" content="I'm Akhil — a data & ML engineer turning million-row messes into things people actually use. Explore my work, skills, and projects." />
    <meta name="keywords" content="Data Science, Machine Learning, Data Engineer, React Developer, Python, Full Stack Developer, Portfolio, Akhil Kumar" />
    <meta name="author" content="Gudapuri Akhil Kumar" />
    <meta name="robots" content="index, follow" />

    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="Akhil Kumar — I make data behave." />
    <meta property="og:description" content="Data & ML engineer turning million-row messes into things people actually use. Bay Area · open to new problems." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://akhilkumar.dev" />
    <meta property="og:site_name" content="Akhil Kumar" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:image" content="https://akhilkumar.dev/og-image.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Akhil Kumar — I make data behave." />

    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Akhil Kumar — I make data behave." />
    <meta name="twitter:description" content="Data & ML engineer turning million-row messes into things people actually use." />
    <meta name="twitter:image" content="https://akhilkumar.dev/og-image.png" />
```

(Leave the rest of `index.html` — performance/security meta, icons, fonts, title — unchanged.)

- [ ] **Step 2: Verify + commit.**

Open `public/index.html` and confirm the tags are well-formed (no duplicate `og:title`/`twitter:title`). `npm run type-check` does not cover HTML, so just visually verify.
```bash
git add public/index.html
git commit -m "feat: richer Open Graph + Twitter social preview meta"
```

---

## Plan 2 Completion Check

- [ ] `npm run type-check` passes.
- [ ] `CI=true npx react-scripts test --watchAll=false` — all suites pass (Home + projects data tests included; old Hub test removed).
- [ ] Manual (`npm start`): `/` shows the new Home (avatar/monogram, "I make data behave", featured recsys card with tilt, nav, résumé button); nav + résumé work; About roles lead professional; Work cards show hooks; Contact has a résumé button.
- [ ] Confirmed nothing still imports `pages/Hub`.

## What Plan 2 Defers to Plan 3

- ⌘K command palette (incl. the "Download résumé" command and a homepage ⌘K hint), Work filtering, and the interactive skills constellation.
- A homepage ⌘K discoverability hint is intentionally NOT added here — it would be a dead affordance until the palette exists in Plan 3.

## Content follow-ups for the user (not code)

- Drop `public/resume.pdf`, `public/avatar.jpg`, `public/og-image.png` (1200×630) when ready.
- Fill real `githubUrl` / `liveUrl` per project in `src/data/projects.ts`; move `featured: true` if a different project should headline.
