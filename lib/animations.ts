import type { Transition, Variants } from "framer-motion";

/**
 * One easing family for the whole site. Mirrors the custom properties in
 * globals.css so CSS transitions and Framer Motion agree with each other.
 */
export const EASE = {
  /** Everything that enters. Fast start, long settle. */
  outExpo: [0.16, 1, 0.3, 1],
  /** Everything that moves between two states (open/close, expand). */
  inOutQuart: [0.76, 0, 0.24, 1],
  /** Pointer-following and hover. Short and unfussy. */
  glide: [0.22, 0.61, 0.36, 1],
} as const;

export const DURATION = {
  micro: 0.28,
  short: 0.5,
  base: 0.8,
  long: 1.1,
  reveal: 1.4,
} as const;

export const transition = {
  enter: {
    duration: DURATION.base,
    ease: EASE.outExpo,
  } satisfies Transition,
  state: {
    duration: DURATION.short,
    ease: EASE.inOutQuart,
  } satisfies Transition,
  hover: {
    duration: DURATION.micro,
    ease: EASE.glide,
  } satisfies Transition,
  /** Panels and modals that carry a lot of visual weight. */
  heavy: {
    duration: DURATION.long,
    ease: EASE.inOutQuart,
  } satisfies Transition,
};

/** Springs for anything that follows a pointer. */
export const SPRING = {
  cursor: { stiffness: 260, damping: 32, mass: 0.6 },
  card: { stiffness: 190, damping: 24, mass: 0.8 },
} as const;

/* -------------------------------------------------------------------------- */

/** Standard section entrance: rise and fade. */
export const riseIn: Variants = {
  hidden: { opacity: 0, y: 34 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transition.enter,
  },
};

/** Parent for anything that reveals its children in sequence. */
export const stagger = (gap = 0.07, delay = 0): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: gap, delayChildren: delay },
  },
});

/** A single line of display type sliding out from behind a clip. */
export const lineMask: Variants = {
  hidden: { y: "110%" },
  visible: {
    y: "0%",
    transition: { duration: DURATION.reveal, ease: EASE.outExpo },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transition.enter },
};

/** Shared viewport config so every section triggers at the same depth. */
export const VIEWPORT = { once: true, amount: 0.28 } as const;
