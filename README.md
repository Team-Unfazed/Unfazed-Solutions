# Unfazed Solution — agency site

A single-page marketing site for the Unfazed Solution software studio. Dark,
typography-led, monochrome by design: colour appears in the logo mark, and
everywhere else only once the reader engages with something — the award
photograph resolves out of grayscale on hover, and a Selected Work card lets
that product's own brand colour through its preview. At rest the page is grey.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

```bash
npm run build && npm start   # production
npm run typecheck            # tsc --noEmit
```

## Stack

| Concern | Choice | Why |
| --- | --- | --- |
| Framework | Next.js 15, App Router | Static output, per-component code splitting |
| Styling | Tailwind CSS v4 | Tokens declared once in `app/globals.css` under `@theme static` |
| UI motion | Framer Motion | Section reveals, hover states, modal and accordion |
| Smooth scroll | Lenis | Drives the scroll position for the whole page |
| Scroll sequence | GSAP ScrollTrigger | The one scrub-linked reveal, in the contact section |
| 3D | three.js via React Three Fiber | The hero field only; loaded lazily, never on the server |

Lenis and ScrollTrigger share a single frame loop — GSAP's ticker drives Lenis's
`raf`, and `lenis.on("scroll", ScrollTrigger.update)` keeps triggers in step
with the eased position rather than the raw one. See
`components/shared/SmoothScroll.tsx`.

## Layout of the source

```
app/
  layout.tsx           fonts, metadata, page chrome (rules, grain, skip link)
  page.tsx             section order
  globals.css          design tokens, type roles, structural classes
components/
  loader/              intro logo unveil + the ready-state context
  nav/                 floating pill navigation
  hero/                wordmark, scroll parallax, R3F canvas and point field
  marquee/             the capability band between hero and services
  services/            3D coverflow track, card, glyph set
  credibility/         stats, award panels, Lumos AI case modal
  work/                the twelve shipped products, 3D scroll reveal, previews
  founders/            five-panel accordion
  testimonials/        quote carousel
  contact/             scrub-linked headline and details
  footer/              link columns and the closing wordmark
  shared/              Button, SectionHeading, Reveal, ScrollTextReveal, SmoothScroll
lib/
  constants.ts         all site content — services, work, founders, stats, awards, quotes
  animations.ts        the easing family and shared motion variants
  types.ts             content types
  smooth-scroll.ts     the Lenis handle, anchor scrolling, scroll lock
public/images/         supplied photography, original filenames preserved
```

Content lives in `lib/constants.ts`. Nothing in `components/` hardcodes copy,
so text changes never require touching a component.

## Design system

Tokens are declared once, in `app/globals.css`:

| Token | Value | Use |
| --- | --- | --- |
| `--color-bg` | `#0A0A0A` | Page |
| `--color-card` | `#161616` | Card and panel surfaces |
| `--color-fg` | `#F0F0F0` | Primary text |
| `--color-cta` / `--color-cta-fg` | `#FFFFFF` / `#0A0A0A` | Primary buttons |
| `--color-cta-2` / `--color-cta-2-fg` | `#1E1E1E` / `#E0E0E0` | Secondary buttons |
| `--color-accent` | `#D0D0D0` | Body copy, highlights |
| `--color-bg-accent` | `#434343` | Rules, borders, muted meta |

The one set of chromatic values in the codebase is `ACCENT_TINT` in
`components/work/WorkPreview.tsx` — a brand colour per shipped product. It is
deliberately *not* in `@theme`: promoting a dozen hues to tokens would put them
within reach of every component, and they are only ever painted inside a work
card's preview, at zero opacity until that card is hovered or focused.

Type is one superfamily used at two extremes of its width axis — Archivo at
`wdth 125` for display and `wdth 100` for body — with JetBrains Mono for
eyebrows, labels and data.

**Base styles must stay inside `@layer base`.** Unlayered CSS outranks every
cascade layer, so an unlayered `button { color: inherit }` silently beats any
Tailwind text-colour utility placed on a button.

## Performance notes

- The services track writes `transform`, `opacity` and `z-index` straight to
  the DOM from one `requestAnimationFrame` loop. It never sets React state per
  frame, and it returns early when the section is off screen.
- The hero canvas sets `frameloop="never"` once the hero leaves the viewport,
  so the GPU is idle for the rest of the page.
- Each Selected Work card mounts its scroll-linked transforms only once it is
  within 200px of the viewport, so twelve cards are never all measured at once,
  and the hover tilt is never wired up on a touch pointer.
- Both respect `prefers-reduced-motion`: Lenis is not started, the carousel
  becomes a scroll-snapping row, the grain and marquee stop, the counters print
  their final figure, and the work cards fade and rise flat with no perspective.

## Content that still needs you

See [`CONTENT-TODO.md`](./CONTENT-TODO.md).
