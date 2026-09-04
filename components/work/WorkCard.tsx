"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { SPRING, transition, VIEWPORT } from "@/lib/animations";
import type { WorkItem } from "@/lib/types";
import { WorkPreview } from "./WorkPreview";

/** Degrees of tilt at the far corner of a card. Restrained on purpose. */
const TILT = 6;

interface WorkCardProps {
  item: WorkItem;
  /** Which grid column this card lands in at the two-column breakpoint. */
  column: number;
}

/**
 * One shipped product.
 *
 * The card arrives out of the sheet rather than up it: it starts pitched back
 * 25 degrees and 150px behind the page, and comes level as it rises into the
 * viewport. Every other reveal on this site is a rise and a fade, so this one
 * says something the others do not — these twelve are objects that already
 * exist, not another list.
 *
 * The reveal is driven by the card's *own* position, not the page's, so a card
 * two thirds down the section is not already finished by the time it appears.
 */
export function WorkCard({ item, column }: WorkCardProps) {
  const gateRef = useRef<HTMLLIElement>(null);
  const reduceMotion = useReducedMotion();

  /**
   * Twelve scroll-linked cards is twelve sets of measurements held live at
   * once. The card is armed 200px before it reaches the viewport and only then
   * mounts the hooks — which also means the swap from the flat shell to the
   * dimensional one happens off-screen, where nobody can see it.
   *
   * It also settles hydration: `armed` is false on the server and on the first
   * client render, so both sides draw the same thing regardless of what the
   * reader's motion preference turns out to be.
   */
  const armed = useInView(gateRef, { margin: "200px 0px", once: true });

  return (
    <li ref={gateRef}>
      {!armed ? (
        // Pre-arm. Holds the card's footprint so the grid never reflows, and
        // holds its opening state so nothing flashes in when it arms.
        <div className="h-full opacity-0">
          <CardBody item={item} />
        </div>
      ) : reduceMotion ? (
        <FlatReveal item={item} />
      ) : (
        <DimensionalReveal item={item} column={column} />
      )}
    </li>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * `prefers-reduced-motion` fallback. No perspective, no rotation, no depth —
 * the site's ordinary rise and fade, shortened. The card still arrives; it
 * just arrives flat.
 */
function FlatReveal({ item }: { item: WorkItem }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={transition.enter}
      className="h-full"
    >
      <CardBody item={item} />
    </motion.div>
  );
}

function DimensionalReveal({ item, column }: WorkCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();

  const { scrollYProgress } = useScroll({
    target: ref,
    // Cards in the same row share a scroll position, so the stagger cannot be
    // a delay — a scroll-linked value has no clock to delay against. The
    // second column's window is pushed 4vh further down the page instead,
    // which is about 80ms at a normal scroll speed and stays proportionate at
    // any other.
    offset:
      column === 0
        ? ["start 90%", "start 40%"]
        : ["start 86%", "start 36%"],
  });

  const revealRotateX = useTransform(scrollYProgress, [0, 1], [25, 0]);
  const z = useTransform(scrollYProgress, [0, 1], [-150, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);

  // Hover parallax. Written to on pointer move, sprung so the card settles
  // back rather than snapping when the pointer leaves.
  const pitch = useMotionValue(0);
  const yaw = useMotionValue(0);
  const tiltX = useSpring(pitch, SPRING.card);
  const tiltY = useSpring(yaw, SPRING.card);

  // The scroll reveal and the hover tilt both want rotateX, and `style` takes
  // one value per transform. They are summed here so neither has to win.
  const rotateX = useTransform(
    [revealRotateX, tiltX],
    ([reveal, tilt]: number[]) => reveal + tilt,
  );

  const track = (event: PointerEvent<HTMLDivElement>) => {
    if (!fine) return;
    const box = event.currentTarget.getBoundingClientRect();
    const nx = (event.clientX - box.left) / box.width - 0.5;
    const ny = (event.clientY - box.top) / box.height - 0.5;
    yaw.set(nx * TILT * 2);
    pitch.set(-ny * TILT * 2);
  };

  const release = () => {
    yaw.set(0);
    pitch.set(0);
  };

  return (
    // The perspective sits here rather than on the grid, and only on the
    // branch that has something to project. One perspective on the container
    // would put a single vanishing point at the middle of the row, so the two
    // columns would pitch about a shared axis and the row would read lopsided
    // — each card gets the same 1200px and its own honest rotation instead.
    // It is also the reason the reduced-motion branch has no perspective at
    // all: there is nothing there to flatten.
    <div className="h-full [perspective:1200px]">
      <motion.div
        ref={ref}
        onPointerMove={fine ? track : undefined}
        onPointerLeave={fine ? release : undefined}
        style={{
          rotateX,
          rotateY: tiltY,
          z,
          opacity,
          scale,
          transformStyle: "preserve-3d",
        }}
        className="h-full will-change-transform"
      >
        <CardBody item={item} />
      </motion.div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * The card itself, identical in all three states above so that arming or
 * falling back changes only how it arrives, never what it says.
 */
function CardBody({ item }: { item: WorkItem }) {
  // The host is stored exactly as it resolves, because that is what has to go
  // in the href. `www.` is dropped from the label only — three of the eleven
  // carry it, and a row of domains where three are prefixed and eight are not
  // reads as an inconsistency rather than as information.
  const href = item.domain ? `https://${item.domain}` : null;
  const label = item.domain?.replace(/^www\./, "");

  const inner = (
    <>
      <span className="type-mono text-[color:var(--color-bg-accent)] transition-colors duration-500 group-hover/work:text-[color:var(--color-accent)]">
        {item.category}
      </span>

      <h3 className="type-display mt-4 text-[clamp(1.45rem,2.3vw,2.05rem)] text-[color:var(--color-fg)]">
        {item.name}
      </h3>

      <p className="type-note mt-3 max-w-[44ch] text-[0.875rem]">
        {item.description}
      </p>

      {/* Pushed to the bottom of the card so the previews line up across a row
          even when one description runs to three lines and its neighbour to
          one. */}
      <WorkPreview
        src={item.image}
        alt={`${item.name} — ${item.category} project preview`}
        position={item.imagePosition}
        className="mt-auto pt-7"
      />

      <span className="mt-5 flex items-center justify-between gap-4 border-t border-[color:var(--color-bg-accent)]/40 pt-4">
        {href ? (
          <span className="flex min-w-0 items-center gap-2 text-[color:var(--color-bg-accent)] transition-colors duration-500 group-hover/work:text-[color:var(--color-accent)]">
            <GlobeGlyph />
            <span className="truncate font-mono text-[0.6875rem] tracking-[0.06em]">
              {label}
            </span>
          </span>
        ) : (
          <span className="type-mono rounded-full border border-[color:var(--color-bg-accent)]/70 px-3 py-1.5 text-[0.5625rem] text-[color:var(--color-bg-accent)]">
            {item.note}
          </span>
        )}

        {href ? (
          <ExternalGlyph className="shrink-0 text-[color:var(--color-bg-accent)] transition-[color,transform] duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover/work:-translate-y-0.5 group-hover/work:translate-x-0.5 group-hover/work:text-[color:var(--color-fg)]" />
        ) : null}
      </span>
    </>
  );

  const shell =
    "surface group/work relative flex h-full flex-col p-5 sm:p-6 " +
    "transition-[border-color] duration-500 " +
    "hover:border-[color:var(--color-bg-accent)]";

  // `min-w-0` on the flex column: without it the truncating domain row refuses
  // to shrink and widens the card past its grid track.
  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${shell} min-w-0 focus-visible:outline-offset-[6px]`}
    >
      {inner}
      <span className="sr-only">
        {" "}
        — opens {label} in a new tab
      </span>
    </a>
  ) : (
    <div className={`${shell} min-w-0`}>
      {inner}
    </div>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * True only for a pointer that can hover and can be aimed precisely. The tilt
 * is meaningless to a finger and costs a transform on every scroll frame, so
 * touch never arms it.
 */
function useFinePointer() {
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setFine(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return fine;
}

function GlobeGlyph({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      width="12"
      height="12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      className={`shrink-0 ${className ?? ""}`}
    >
      <circle cx="8" cy="8" r="6.2" />
      <path d="M1.8 8h12.4M8 1.8c1.7 1.8 2.6 3.9 2.6 6.2S9.7 12.4 8 14.2c-1.7-1.8-2.6-3.9-2.6-6.2S6.3 3.6 8 1.8Z" />
    </svg>
  );
}

function ExternalGlyph({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 14 14"
      width="13"
      height="13"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 11 11 3M4.6 3H11v6.4" />
    </svg>
  );
}
