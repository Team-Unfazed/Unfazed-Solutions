import type Lenis from "lenis";

/**
 * Module-level handle on the single Lenis instance. Anything that needs to
 * drive the scroller (nav anchors, modal scroll-lock) reads it from here
 * rather than threading a ref through the tree.
 */
let instance: Lenis | null = null;

export function setLenis(next: Lenis | null) {
  instance = next;
}

export function getLenis(): Lenis | null {
  return instance;
}

/** Scroll to an element by id, falling back to native when Lenis is off. */
export function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;

  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(target, { offset: -12, duration: 1.35 });
  } else {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/** Freeze the page behind a modal without losing scroll position. */
export function lockScroll(locked: boolean) {
  const lenis = getLenis();
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}
