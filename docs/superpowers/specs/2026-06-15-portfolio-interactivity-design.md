# Portfolio Character + Interactivity Upgrade — Design Spec

**Date:** 2026-06-15
**Status:** Approved (pending spec review)
**Scope:** Give the portfolio one coherent **character** ("playful-grounded"), express it on a redesigned homepage and across every page, upgrade projects into proof-of-work, add two quick wins (résumé, social preview), and ship the approved A–F interactivity layer as the vehicle for that character.

## Goal

The portfolio (`akhil-portfolio`, React 18 + TypeScript + Tailwind + Framer Motion + React Router 6) is technically polished and full of micro-interactions, but the homepage reads as **aloof**: the "remote control" concept is clever-as-armor — it jokes about *not* introducing the person and then doesn't. Humor is scattered, not a coherent personality.

This upgrade picks **one character** and runs it through the whole site, replaces the homepage so a visitor learns *who he is, what he does, and sees proof* within seconds, turns the project list into verifiable proof-of-work, and uses the A–F interactivity to express the personality rather than decorate it.

## The Character: "Playful-grounded"

The governing rule for all copy and design:

> **Lead with substance, season with wit. Punch at the work, never away from it.**

Voice rules:
1. **Every section earns its joke by saying something real first.** Number/claim, then the wink.
2. **Humor points at the craft** ("I make data behave — it doesn't always listen"), never at avoiding it ("I won't bore you with…"). This single shift removes the aloofness.
3. **Specific beats generic.** Real numbers, stakes, and place names *are* the personality.
4. **Confident, not braggy. Warm, not corporate.** Short sentences, contractions, first person.
5. **One wink per section, max.** Restraint makes it land.

This voice is the acceptance bar for every copy change below: if a line is a joke that dodges substance, it's wrong; if it's a real claim with a light, craft-aimed wink, it's right.

## Constraints & Principles

- **No new dependencies.** Build on the existing stack only (Framer Motion 10, Router 6). Keeps the bundle lean and avoids the known iCloud `node_modules` eviction/reinstall pain documented in project memory.
- **Accessibility first.** Respect `prefers-reduced-motion`; overlays use correct ARIA roles and focus management.
- **Graceful degradation.** Pointer-driven effects (magnetic, tilt, constellation) disable on touch/mobile and reduced-motion, falling back to static layouts.
- **Performance.** Pointer handlers are `requestAnimationFrame`-throttled (same pattern as `CustomCursor`).
- **Follow existing patterns** and reuse existing tokens (`primary`/`secondary`/`accent`/`surface`/`foreground`).

## New / Changed Structure

```
public/
  resume.pdf                     # new — content (user-provided)
  og-image.png                   # new — designed social preview
  avatar.(jpg|webp)              # new — content (user-provided)
src/
  hooks/
    usePrefersReducedMotion.ts   # new
    useIsTouchDevice.ts          # new — extracted from CustomCursor
  data/
    projects.ts                  # new — project data extracted from Work.tsx + new fields
  components/
    interactive/                 # new folder
      PageTransition.tsx
      AnimatedRoutes.tsx
      ScrollToTop.tsx
      ScrollProgress.tsx
      Reveal.tsx
      MagneticButton.tsx
      TiltCard.tsx
      CommandPalette.tsx
      command-registry.ts
      SkillConstellation.tsx
    home/
      Home.tsx                   # new — replaces the Hub homepage
      FeaturedProject.tsx        # new — configurable hero card
    sections/
      Work.tsx                   # modified — filtering + per-project hooks + links
      Skills.tsx                 # modified — constellation + card fallback
      About.tsx                  # modified — Reveal, role reorder, voice
      Contact.tsx                # modified — Reveal, MagneticButton CTA
  pages/
    Hub.tsx                      # removed (replaced by home/Home.tsx)
public/index.html                # modified — OG/meta tags
```

## Homepage Redesign (replaces Hub)

`home/Home.tsx` renders the new `/` route. Layout (kept mostly to one screen, breathing room over density):

```
   [avatar]  I'm Akhil. I make data behave.
             (it doesn't always listen.)

   Data & ML engineer turning million-row messes into
   products people use. Bay Area · SJSU · open to work.

   ┌─ Featured ─────────────────────────────────┐
   │ <featured project title>                    │
   │ <metric · metric · metric>                  │
   │ <one-line craft-aimed hook>                 │
   │ [ explore → ]   [ GitHub ↗ ]                │
   └─────────────────────────────────────────────┘

        about · work · skills · contact
        now: <status> · press ⌘K to jump anywhere
```

- **Avatar:** small, friendly photo beside the headline (`public/avatar`).
- **Headline + sub:** the voice in three seconds.
- **Positioning line:** what he does + location + availability.
- **FeaturedProject card:** a **configurable** component reading one entry from `data/projects.ts` (the featured project is chosen later, after projects are updated; until then it renders the first project or a designated `featured: true` flag). Uses `TiltCard` + `MagneticButton` on its CTA. Links out to repo/demo.
- **Nav:** about · work · skills · contact (now secondary to hook + proof).
- **Status line:** human/current touch + ⌘K discoverability hint.
- **Retained:** signature name treatment, `FlowingBackground`, dark theme.
- **Removed:** the "remote control" / "47 sections" copy and the standalone Hub.
- Reduced-motion/touch: static layout, no magnetic/tilt.

## Site-wide Voice Application

- **About:** keep the warmth (it is already the best-voiced page). Reorder the role typewriter to **lead with real roles** (Data Engineer, ML Engineer, Full-stack Dev, Data Analyst) and end on **one** playful wink rather than trailing into several. Keep the AI-collaboration line, reframed as a confident flex. Wrap blocks in `Reveal`.
- **Work:** add a **one-line, craft-aimed hook** per project above its existing substance; surface **GitHub/demo links** (see proof-of-work). Metrics stay.
- **Skills / Contact:** light copy touch only; the constellation and easter eggs carry the play. Contact CTA becomes a `MagneticButton`.

## Project Data Model + Proof-of-Work

Extract the inline `projects` array from `Work.tsx` into `src/data/projects.ts` and extend the `Project` type:

```ts
interface Project {
  // existing: id, title, description, detailedDescription, keyFeatures,
  //           technicalChallenge, technologies, year
  hook?: string;        // new — one-line craft-aimed punch line
  githubUrl?: string;   // populated with real repo URLs (user-provided)
  liveUrl?: string;     // new — optional live demo
  image?: string;       // new — optional screenshot/thumbnail (public/)
  featured?: boolean;   // new — marks the homepage hero
}
```

- `Work.tsx` and `home/FeaturedProject.tsx` both consume `data/projects.ts` (single source of truth).
- Real `githubUrl`/`liveUrl` values and the `featured` selection are **content the user supplies** after updating projects; the structure ships ready for them.
- The empty-`githubUrl` link is conditionally rendered (already the case), so missing links degrade cleanly.

## Quick Wins

- **Résumé:** place `public/resume.pdf`; add a download button on the homepage and Contact, plus a **"Download résumé"** command in ⌘K. (PDF is user-provided.)
- **Social/OG preview:** add Open Graph + Twitter meta to `public/index.html` and ship a designed `public/og-image.png` so shared links render a branded card.

## Feature Designs A–F (interactivity — the vehicle for the character)

### A. Page transitions
`AnimatedRoutes` wraps `<Routes>` in `<AnimatePresence mode="wait">` keyed on `location.pathname`; `PageTransition` gives each route a fade + ~12px slide (~0.35s). `ScrollToTop` resets scroll on navigation. Suspense stays **outside** AnimatePresence so the lazy fallback never flashes. Reduced-motion → instant fade.

### B. Scroll-reveal + progress bar
- `ScrollProgress`: fixed 2px top bar, `scaleX` from `useScroll().scrollYProgress`, primary→secondary gradient, origin-left. Shown on scrollable pages, hidden on the single-viewport home.
- `Reveal`: wrapper using `whileInView` + `viewport={{ once: true, margin: '-10% 0px' }}`. Replaces mount-time container variants on Work/About/Skills/Contact so content animates as it is read. Reduced-motion → no animation.

### C. Magnetic CTAs + tilt cards
- `MagneticButton`: springs toward the pointer within bounds, resets on leave; applied to gradient CTAs, homepage nav, and the featured card CTA.
- `TiltCard`: pointer-driven `rotateX/rotateY` (~6–8°) + cursor-following radial glow; applied to Work project cards and the featured card.
- Both rAF-throttled; both disabled on touch/reduced-motion (render children unchanged).

### D. Command palette (⌘K)
Custom, dependency-free, mounted once in `App`. `⌘K`/`Ctrl+K` toggles, `Esc` closes, `↑/↓` navigate, `Enter` runs, typing filters. `command-registry.ts` defines grouped commands — **Navigate** (Home/About/Work/Skills/Contact), **Actions** (copy email, open GitHub, open LinkedIn, **download résumé**), **Fun** (trigger Matrix rain) — plus a `fuzzyMatch(query, text)` scorer (subsequence + prefix/contiguity bonus). UI: blurred backdrop + centered dialog; input auto-focused; grouped, highlighted results; mouse hover and keyboard selection stay in sync. Accessibility: `role="dialog"` + `aria-modal`; focus to input on open and restored on close; `aria-activedescendant`. A subtle `⌘K` hint on the homepage. (Framing note: this is fast-nav with personality in the command labels — it no longer carries the retired "remote control" metaphor.) Command labels follow the character voice.

### E. Interactive Skills constellation
`SkillConstellation` replaces the domain card **grid on desktop**; the existing Skills card list is kept as the **mobile + reduced-motion fallback**. Seven domain hub-nodes positioned radially with skills orbiting as satellites; SVG lines connect skills to their hub. Positions are **deterministic** from indices (stable layout). Interactions: hover → highlight node + connected edges, dim the rest, tooltip; click a domain hub → focus cluster + open the existing detail panel; nodes are draggable with spring-back and a gentle idle float. Existing per-domain click-count easter eggs move onto the hub click handler.

### F. Work filtering
Filter bar above the project list: dedup'd tech chips + year toggles derived from `data/projects.ts`. Selection combines as **(any selected tech) AND (any selected year)** — match-any within a dimension (OR), AND across dimensions. Nothing selected → all show. "All" clears everything; a live count shows matches. Reflow animates via Framer `layout` + `AnimatePresence`. Expand/collapse details unchanged.

## Cross-Cutting

- **Shared hooks:** `usePrefersReducedMotion` (reactive matchMedia) and `useIsTouchDevice` (extracted from `CustomCursor`) gate all motion-heavy features.
- **Konami/Matrix refactor:** lift matrix-active control into `App` so both `useKonamiCode` and the command palette can trigger the Matrix rain.

## Testing

Repo already runs Jest + Testing Library with existing hook/integration tests. Add **logic** tests (visual layers kept thin):
- `fuzzyMatch` ranking/ordering.
- Command registry filtering by query.
- Command palette keyboard selection (↑/↓ wrap, Enter runs, Esc closes) via Testing Library.
- Work filter pure function (match-any within dimension, AND across, "All" reset, count).
- `usePrefersReducedMotion` value + reactivity.

`npm run type-check` must stay green; existing tests must keep passing. Update/replace the existing `Hub.test.tsx` to cover `home/Home.tsx`.

## Content Dependencies (user-provided)

These block only the pieces that need them; everything else ships around them:
- `public/resume.pdf` (résumé download).
- `public/avatar.*` (homepage avatar).
- Real `githubUrl` / `liveUrl` values per project, and the `featured` project choice.
- Optional project screenshots (`image`).
- Source/photo input for `og-image.png` (otherwise a type-driven OG card is generated).

## Out of Scope (this pass)

- Tier 3 ideas: opt-in UI sound and live in-page project mini-demo.
- Backend contact-form delivery (mailto handoff stays).
- Analytics.

## Rollout (dependency order)

1. Shared hooks (`usePrefersReducedMotion`, `useIsTouchDevice`) + extract `data/projects.ts`.
2. A (transitions) + B (scroll-reveal/progress).
3. C (magnetic/tilt).
4. New homepage `home/Home.tsx` + `FeaturedProject` (replaces Hub) + avatar + résumé button.
5. Site-wide voice pass (About reorder, Work hooks/links, Contact CTA).
6. D (command palette + résumé command + Konami/Matrix refactor).
7. F (Work filtering).
8. E (skills constellation — largest).
9. Quick win: OG/meta + `og-image.png`.

Each step lands type-checked with its tests.
