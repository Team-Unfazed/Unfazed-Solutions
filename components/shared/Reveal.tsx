"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { EASE, riseIn, transition, VIEWPORT } from "@/lib/animations";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Seconds to hold before starting. Use to shape a section's rhythm. */
  delay?: number;
  as?: "div" | "section" | "li" | "figure";
}

/**
 * The site's one scroll-entrance. Every section uses it so the page has a
 * single reveal vocabulary instead of a different idea per section.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: RevealProps) {
  const Component = motion[as];

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={riseIn}
      transition={{ ...transition.enter, delay }}
    >
      {children}
    </Component>
  );
}

interface MaskedLineProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/**
 * A line of display type that slides up from behind a clip.
 *
 * Two things matter here, and both have already broken this component once:
 *
 * 1. The viewport observer is attached to the *clip*, not to the moving span.
 *    An element translated outside an `overflow: hidden` ancestor has zero
 *    visible area, so an observer on it would never fire.
 * 2. The target comes from a controlled `animate` prop rather than
 *    `whileInView`. `whileInView` sets the target once; if that animation is
 *    interrupted the line can be stranded part-way and never finish, leaving
 *    the heading permanently clipped. A controlled prop is re-asserted on
 *    every render, so an interrupted line always resolves.
 */
export function MaskedLine({ children, className, delay = 0 }: MaskedLineProps) {
  const clipRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(clipRef, VIEWPORT);

  return (
    <span ref={clipRef} className="block overflow-hidden pb-[0.12em]">
      <motion.span
        className={`block ${className ?? ""}`}
        initial={{ y: "110%" }}
        animate={{ y: inView ? "0%" : "110%" }}
        transition={{ duration: 1.25, ease: EASE.outExpo, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}
