"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { TESTIMONIALS } from "@/lib/constants";
import { transition, VIEWPORT } from "@/lib/animations";
import { TestimonialPanel, type CanvasMetrics } from "./TestimonialPanel";

/**
 * Where each panel is laid on the wide canvas, as fractions of it — so the
 * arrangement scales with the viewport instead of breaking at one width, and so
 * the entry and exit offsets can be computed from real geometry rather than
 * guessed at in `vw`.
 *
 * The row climbs to the third panel and falls away again; the first hangs off
 * the left edge so the group reads as part of something wider than the page.
 *
 * `window` is the slice of the section's scroll pass over which that panel
 * makes its crossing. Before and after its own window a panel is parked
 * off-screen, which is what keeps the section empty when you first reach it.
 *
 * The windows are offset only slightly at the start and get progressively
 * shorter left to right, so the rightmost panel crosses fastest. That puts the
 * compression late: the row is still cleanly spaced where you read it, and only
 * closes up on itself on the way out. Widening these offsets pulls the panels
 * together early and they start cutting each other's text — the gaps between
 * them are only ~46px to begin with.
 */
const PLACEMENT = [
  { left: -0.02, top: 0.34, width: 0.22, rotate: -1.2, drift: 12, window: [0, 0.9] },
  { left: 0.235, top: 0.22, width: 0.22, rotate: 1.0, drift: -8, window: [0.006, 0.885] },
  { left: 0.49, top: 0.13, width: 0.22, rotate: -0.8, drift: 18, window: [0.012, 0.87] },
  { left: 0.745, top: 0.25, width: 0.22, rotate: 1.4, drift: -4, window: [0.018, 0.855] },
] as const;

/** Clearance past the edge — enough that the shadow and the tilt are gone too. */
const CLEARANCE = 72;

/**
 * The monument, pre-broken. Short lines are what let the type be set this
 * large: a line that wraps here doubles the height and turns the headline into
 * a wall. If you change this copy, re-measure the longest line against
 * `.clients-monument`'s font-size — the widest is currently ~87% of the
 * container, which is the headroom to keep.
 */
const MONUMENT = ["Ask the", "people who", "paid for it."];

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [isWide, setIsWide] = useState(false);
  const [metrics, setMetrics] = useState<CanvasMetrics | null>(null);

  // The scatter needs room the phone does not have, so below lg the panels
  // stack square and still and the monument sits above them.
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const sync = () => setIsWide(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  // A panel has to clear the viewport, not the canvas, so the crossing needs
  // both the canvas width and where it sits inside the window.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const measure = () => {
      const rect = canvas.getBoundingClientRect();
      setMetrics({ width: rect.width, offsetLeft: rect.left, viewport: window.innerWidth });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(canvas);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [isWide]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // One spring for the whole row, so the panels glide rather than tracking the
  // wheel one-to-one — and so they stay in step with each other while doing it.
  const glide = useSpring(scrollYProgress, {
    stiffness: 58,
    damping: 28,
    mass: 1,
  });

  const scattered = isWide && !reduceMotion && metrics !== null;

  /**
   * One crossing, shared by every panel, measured from the outer edges of the
   * whole row. It has to be shared: deriving each panel's own entry and exit
   * from its own resting position algebraically cancels that position out, so
   * every panel lands on the same screen x at the same moment and the row
   * collapses into a single stack. Moving them all by the same offset is what
   * preserves the spread between them.
   */
  const crossing = metrics
    ? (() => {
        const lefts = PLACEMENT.map((p) => p.left);
        const rights = PLACEMENT.map((p) => p.left + p.width);
        const rowLeft = metrics.offsetLeft + Math.min(...lefts) * metrics.width;
        const rowRight = metrics.offsetLeft + Math.max(...rights) * metrics.width;
        return {
          enter: metrics.viewport - rowLeft + CLEARANCE,
          exit: -(rowRight + CLEARANCE),
        };
      })()
    : null;

  return (
    <section
      id="clients"
      ref={sectionRef}
      className="clients-room z-10 py-[var(--spacing-section)]"
    >
      <div className="relative z-10 px-[var(--spacing-gutter)]">
        <motion.p
          className="type-mono flex items-center gap-3 text-[color:var(--color-bg-accent)]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VIEWPORT}
          transition={transition.enter}
        >
          <span
            aria-hidden
            className="inline-block h-px w-8 bg-[color:var(--color-bg-accent)]"
          />
          Clients
        </motion.p>

        {/* The canvas. Fixed aspect from lg up so the panels keep their
            arrangement; a plain column below that.

            No `perspective` here on purpose: the panels sit far from the
            perspective origin, so any depth on this container trapezoids them —
            one edge taller than the other — and they stop reading as flat
            panels. The tilt is Z-rotation only. */}
        <div
          ref={canvasRef}
          className="mt-10 lg:relative lg:mt-6 lg:aspect-[19/12.5]"
        >
          <motion.h2
            className="clients-monument max-w-[16ch] lg:absolute lg:left-0 lg:top-[7%] lg:z-0 lg:max-w-none lg:w-[73%]"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ ...transition.enter, delay: 0.1 }}
          >
            {MONUMENT.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </motion.h2>

          <motion.p
            className="type-body mt-8 max-w-[46ch] text-[clamp(0.95rem,1.05vw,1.05rem)] lg:absolute lg:right-0 lg:top-[8%] lg:z-20 lg:mt-0 lg:w-[22%] lg:max-w-none"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ ...transition.enter, delay: 0.2 }}
          >
            We work as one team with our clients. Scope is agreed before anything is
            built, and the handover includes documentation, environment access and a
            walkthrough. Names are withheld under NDA; sectors and cities are not.
          </motion.p>

          <div className="mt-12 flex flex-col gap-6 lg:mt-0 lg:block lg:gap-0">
            {TESTIMONIALS.map((testimonial, index) => (
              <TestimonialPanel
                key={testimonial.id}
                testimonial={testimonial}
                placement={PLACEMENT[index]}
                progress={glide}
                crossing={crossing}
                scattered={scattered}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
