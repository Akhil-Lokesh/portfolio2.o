# Portfolio Interactivity Upgrade — Design Spec

**Date:** 2026-06-15
**Status:** Approved (pending spec review)
**Scope:** Add a cohesive delight + interactivity layer across the portfolio (features A–F).

## Goal

The portfolio (`akhil-portfolio`, React 18 + TypeScript + Tailwind + Framer Motion + React Router 6) already has a rich micro-interaction and easter-egg layer. The goal is **not** more easter eggs — it is to make the whole experience feel *alive and cohesive*, and to add two genuine show-stopper interactions. Delight-first; no changes to content or proof-of-work strategy in this pass.

## Constraints & Principles

- **No new dependencies.** Build on the existing stack only (Framer Motion 10, Router 6). This keeps the bundle lean and avoids the known iCloud `node_modules` eviction/reinstall pain documented in project memory.
- **Accessibility first.** Everything respects `prefers-reduced-motion`; interactive overlays use correct ARIA roles and focus management.
- **Graceful degradation.** Pointer-driven effects (magnetic, tilt, constellation) disable on touch/mobile and reduced-motion, falling back to the existing static layouts.
- **Performance.** Pointer handlers are `requestAnimationFrame`-throttled (same pattern as `CustomCursor`). Node counts are small.
- **Follow existing patterns.** Match the current component/styling conventions; reuse existing tokens (`primary`/`secondary`/`accent`/`surface`/`foreground`).

## New Structure

```
src/
  hooks/
    usePrefersReducedMotion.ts   # new — media query hook
    useIsTouchDevice.ts          # new — extracted from CustomCursor logic
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
      command-registry.ts        # command list + fuzzy match
      SkillConstellation.tsx
    sections/
      Work.tsx                   # modified — filtering
      Skills.tsx                 # modified — constellation + card fallback
      About.tsx                  # modified — Reveal wrappers
      Contact.tsx                # modified — Reveal wrappers, MagneticButton CTA
```

## Feature Designs

### A. Page transitions
- `AnimatedRoutes` consumes `useLocation` and renders `<AnimatePresence mode="wait">` around `<Routes location={location} key={location.pathname}>`.
- `PageTransition` is a motion wrapper applied at each route's root: fade + ~12px vertical slide, ~0.35s, eased. Reduced-motion → instant fade only.
- `ScrollToTop` resets `window.scrollTo(0,0)` on pathname change.
- **Suspense stays outside `AnimatePresence`** so the lazy-load fallback never flashes during an exit animation.
- Acceptance: navigating between any two routes shows a smooth cross-fade/slide; no fallback flash; scroll resets to top.

### B. Scroll-reveal + progress bar
- `ScrollProgress`: fixed top bar (2px), `scaleX` driven by Framer `useScroll().scrollYProgress`, gradient primary→secondary, `transform-origin: left`. Rendered on scrollable pages; hidden on the single-viewport Hub.
- `Reveal`: wrapper using `whileInView` with `viewport={{ once: true, margin: '-10% 0px' }}`, default fade + rise. Replaces mount-time container variants on Work/About/Skills/Contact section blocks so content animates as the user scrolls.
- Reduced-motion → render children with no animation.
- Acceptance: progress bar tracks scroll; section blocks reveal on entering viewport, once each.

### C. Magnetic CTAs + tilt cards
- `MagneticButton`: wraps children; on pointer move within bounds, translates toward cursor via spring (`useSpring`), strength configurable; resets on leave. Applied to gradient CTAs across pages and Hub nav items.
- `TiltCard`: pointer position over the card maps to `rotateX/rotateY` (small, ~6–8°) with perspective; a radial highlight follows the cursor. Applied to Work project cards (and Skills mobile-fallback cards).
- Both rAF-throttled; both disabled on touch/reduced-motion (render children unchanged).
- Acceptance: on desktop, CTAs lean toward the cursor and cards tilt subtly with a glow; on touch/reduced-motion, no movement.

### D. Command palette (⌘K)
- Custom, dependency-free. Mounted once in `App`.
- Global keydown: `⌘K`/`Ctrl+K` toggles open; `Esc` closes; `↑/↓` move selection; `Enter` runs; typing filters.
- `command-registry.ts` defines commands grouped into **Navigate** (Hub, About, Work, Skills, Contact), **Actions** (copy email to clipboard, open GitHub, open LinkedIn — values from existing Contact data), **Fun** (trigger Matrix rain). Plus a small `fuzzyMatch(query, text)` scorer (subsequence match + contiguous/prefix bonus) for filtering and ranking.
- UI: backdrop (blur + dim) + centered dialog; search input auto-focused on open; results list with grouped headers and highlighted active row; mouse hover and keyboard selection stay in sync.
- Accessibility: `role="dialog"` + `aria-modal`; focus moves to input on open and is restored to the previously focused element on close; `aria-activedescendant` on the input pointing at the active option.
- Discoverability: a subtle `⌘K` hint chip on the Hub.
- Matrix trigger: `App` exposes a callback (or shared state) that the palette calls to set `isKonamiActivated`/matrix-active; refactor the current `useKonamiCode`-driven `MatrixRain` so both the Konami code and the palette can switch it on.
- Acceptance: ⌘K opens/closes; typing filters with sensible ranking; arrow+enter navigates; actions work; focus is trapped to the dialog and restored on close.

### E. Interactive Skills constellation
- `SkillConstellation` replaces the domain card **grid on desktop**; the existing Skills card list is retained as the **mobile + reduced-motion fallback**.
- Layout: 7 domain hub-nodes positioned radially around the center; each domain's skills orbit it as satellite nodes. Positions are **deterministic** (computed from indices), not random, so the layout is stable across renders. SVG `<line>`s connect each skill to its domain hub.
- Interactions:
  - Hover node → scale up + highlight, highlight connected edges, dim unconnected nodes/edges, show a tooltip (skill name + description).
  - Click a domain hub → focus that cluster and open the existing detail panel for that domain.
  - Nodes are draggable (Framer `drag` with `dragSnapToOrigin` / spring-back) for playfulness; gentle continuous idle float.
- The existing per-domain click-count easter eggs move onto the domain hub click handler.
- Acceptance: desktop shows an explorable constellation with hover highlight, draggable nodes, and click-to-detail; mobile/reduced-motion shows the current accessible card list; all skill data still reachable.

### F. Work filtering
- Filter bar above the project list: dedup'd technology chips + year toggles, derived from the `projects` data at render.
- Selection combines as **(any selected tech) AND (any selected year)**: within a dimension it is match-any (OR); across the two dimensions it is AND. With nothing selected, all projects show. "All" chip clears every selection; a live count shows how many match.
- Reflow animates via Framer `layout` on the list + `AnimatePresence` for card enter/exit. Expand/collapse details behavior is unchanged.
- Acceptance: selecting chips filters and animates the grid; "All" resets; count is accurate; details still expand.

## Cross-Cutting

- **Shared hooks:** `usePrefersReducedMotion` (matchMedia, reactive) and `useIsTouchDevice` (extracted from `CustomCursor`'s existing logic) gate all motion-heavy features.
- **Konami/Matrix refactor:** lift matrix-active control so both `useKonamiCode` and the command palette can trigger it (small state lift into `App`).

## Testing

The repo already runs Jest + Testing Library and has existing hook/integration tests. This pass adds **logic** tests (visual layers kept thin and not snapshot-tested):
- `fuzzyMatch` ranking/ordering.
- Command registry filtering by query.
- Command palette keyboard selection (↑/↓ wrap, Enter runs, Esc closes) via Testing Library.
- Work filter pure function (match-any across tech/year, "All" reset, count).
- `usePrefersReducedMotion` returns correct value and reacts to media changes.

`npm run type-check` must stay green. Existing tests must continue to pass.

## Out of Scope (this pass)

- Tier 3 ideas: opt-in UI sound (G) and live project mini-demo (H).
- Content/proof-of-work changes (GitHub URLs, demos, screenshots, résumé) — tracked separately; not part of this delight pass.

## Rollout

Implemented in dependency order: shared hooks → A (transitions) + B (scroll) → C (magnetic/tilt) → D (command palette, incl. matrix refactor) → F (Work filter) → E (constellation, largest). Each lands type-checked with its tests.
