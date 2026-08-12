"use client";

import type { CSSProperties } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { EASE, VIEWPORT } from "@/lib/animations";
import type { Testimonial } from "@/lib/types";

export interface CanvasMetrics {
  /** Width of the canvas the panels are positioned against. */
  width: number;
  /** Its left edge relative to the viewport. */
  offsetLeft: number;
  viewport: number;
}

/** The row's shared travel, in px. Same for every panel — see the section. */
export interface Crossing {
  enter: number;
  exit: number;
}

/** How far below the resting row the panel sits at each end of its arc, in px. */
const ARC_DIP = 210;

export interface Placement {
  /** All fractions of the canvas, not percentages. */
  left: number;
  top: number;
  width: number;
  /** Z-rotation only. Any Y-rotation needs perspective, which distorts these. */
  rotate: number;
  drift: number;
  /** [enter, leave] as a slice of the section's scroll pass. */
  window: readonly [number, number] | number[];
}

interface TestimonialPanelProps {
  testimonial: Testimonial;
  placement: Placement;
  /** 0 → 1 across the section's pass through the viewport, spring-smoothed. */
  progress: MotionValue<number>;
  /** Null until the canvas has been measured. */
  crossing: Crossing | null;
  /** False when stacked, when motion is reduced, or before measurement. */
  scattered: boolean;
  /** Reveal order, left to right. */
  index: number;
}

export function TestimonialPanel({
  testimonial,
  placement,
  progress,
  crossing,
  scattered,
  index,
}: TestimonialPanelProps) {
  const { left, top, width, rotate, drift } = placement;
  const [opensAt, clearsAt] = placement.window;
  const peaksAt = (opensAt + clearsAt) / 2;

  // Clamped, so outside its window the panel is parked off-screen rather than
  // continuing to travel. That is what leaves the section empty on arrival.
  const x = useTransform(
    progress,
    [opensAt, clearsAt],
    [crossing?.enter ?? 0, crossing?.exit ?? 0],
    { clamp: true },
  );

  // The path is an arc, not a straight line: the panel comes up from the bottom
  // right, rises through its placement at the midpoint, and falls away to the
  // bottom left. Both ends sit `ARC_DIP` below the resting row, which is what
  // puts them in the corners.
  const y = useTransform(
    progress,
    [opensAt, peaksAt, clearsAt],
    [ARC_DIP, drift, ARC_DIP],
    { clamp: true },
  );

  // Slightly further away at the corners than at the peak. Small enough to read
  // as depth rather than as a zoom.
  const scale = useTransform(
    progress,
    [opensAt, peaksAt, clearsAt],
    [0.93, 1, 0.93],
    { clamp: true },
  );

  const tilt = scattered ? rotate : 0;

  return (
    <motion.div
      className="lg:absolute lg:left-[var(--panel-left)] lg:top-[var(--panel-top)] lg:w-[var(--panel-width)]"
      style={
        {
          "--panel-left": `${left * 100}%`,
          "--panel-top": `${top * 100}%`,
          "--panel-width": `${width * 100}%`,
          x: scattered ? x : 0,
          y: scattered ? y : 0,
          scale: scattered ? scale : 1,
        } as CSSProperties
      }
    >
      {/* A portrait slab of a fixed proportion, so the four read as one set of
          objects rather than four boxes sized by how long their quote is. The
          caption is pinned to the foot, and the space that opens above it when a
          quote runs short is deliberate. */}
      <motion.figure
        className="clients-panel flex flex-col p-[8%] lg:aspect-[6/7]"
        initial={{ opacity: 0, rotate: tilt }}
        whileInView={{ opacity: 1, rotate: tilt }}
        viewport={VIEWPORT}
        transition={{ duration: 0.9, ease: EASE.outExpo, delay: index * 0.07 }}
      >
        <p className="clients-mark">{testimonial.sector}</p>

        <blockquote className="clients-quote mt-[8%]">
          &ldquo;{testimonial.quote}&rdquo;
        </blockquote>

        <figcaption className="mt-auto flex flex-col gap-1.5 pt-[12%]">
          <span className="type-mono text-[color:var(--color-accent)]">
            {testimonial.attribution}
          </span>
          <span className="type-mono text-[color:color-mix(in_srgb,var(--color-accent)_50%,var(--color-bg))]">
            {testimonial.city}
          </span>
        </figcaption>
      </motion.figure>
    </motion.div>
  );
}
