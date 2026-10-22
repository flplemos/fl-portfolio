# Home Page Override — FL Portfolio

> Overrides `../MASTER.md` for the single-page portfolio (`/`).
> Anything not listed here follows MASTER.md (palette, typography, spacing, shadows).

**Why this file exists:** MASTER.md resolved to the *API Developer Portal* category
(pattern "FAQ/Documentation Landing", style "Brutalism", effects "no smooth transitions,
0px corners"). Palette and typography fit a developer portfolio and are kept; pattern,
style and effects do not fit the brief (3D, glassmorphism, rich scroll motion) and are
replaced below with verified ui-ux-pro-max matches.

## Pattern — Scroll-Triggered Storytelling + Portfolio Grid

Sources: `--domain landing "portfolio developer showcase"` → *Portfolio Grid*;
`--design-system "personal portfolio glassmorphism dark"` → *Scroll-Triggered Storytelling*.

Section order: Hero (name/role + CTAs) → Sobre → Tech Stack (bento) → Experiência
(timeline) → Projetos (grid) → Formação → Contato. CTA in hero + footer contact.

## Style — Glassmorphism (dark)

Source: `--domain style "glassmorphism dark bento"` → `glassmorphism`.

| Token | Value |
|-------|-------|
| `--glass-bg` | `rgba(14, 18, 35, 0.55)` (MASTER card #0E1223 translucent) |
| `--glass-border` | `rgba(248, 250, 252, 0.10)` |
| `--glass-blur` | `16px` |
| `--radius-md` / `--radius-lg` | `12px` / `20px` (replaces Brutalism's 0px) |

Checklist: backdrop blur 10-20px · 1px light border · text contrast ≥ 4.5:1 measured
against the darkest possible backdrop (opaque fallback when `backdrop-filter` unsupported).

## Accent extension

MASTER accent `#22C55E` stays the CTA color. A secondary accent `#38BDF8` (sky-400) is
added for icons, the timeline gradient and the 3D light. The 3D point light cycles
green → sky → indigo (`#818CF8`) across sections; indigo is used only inside the canvas,
never for text.

## Motion

Source: `--domain gsap "scroll reveal stagger pin"`.

- Section reveals: Subtle Scroll Reveal (y 12-16px, 0.35-0.6s, `power1.out`/`expo.out`,
  `toggleActions: 'play none none reverse'`).
- 3D object: continuous scrub (`scrub: 1`) per section, no pinning (max 1-2 pins rule;
  we use 0 to keep native scroll feel on mobile).
- Timeline line: scrubbed `scaleY` draw.
- `gsap.matchMedia('(prefers-reduced-motion: reduce)')` → render final states, 3D static.

## Three.js (from `--stack threejs`, tuned for performance)

- Plain three.js with named imports (no react-three-fiber/drei runtime): 3D chunk ≈ 133 KB gzip.
- Render on demand only (scroll / pointer / resize / theme); zero GPU work while idle.
- DPR capped at 1.5, canvas sized by its own box via ResizeObserver, everything disposed on unmount.
- One `MeshStandardMaterial` (flat-shaded) on the core; `MeshBasic`/points for the rest.
- Chunk fetched on `requestIdleCallback` after first paint; skipped with Data Saver or no WebGL2.

## Themes

Dark is the MASTER default. Light theme (`[data-theme="light"]`) reuses the same hues with
darkened accents for text (`--color-accent-fg: #15803d`, ≥ 4.5:1 on `#f8fafc`). Initial theme =
saved choice → `prefers-color-scheme`, applied by an inline script before first paint.
