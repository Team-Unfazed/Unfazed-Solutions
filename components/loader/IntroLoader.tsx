"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { EASE } from "@/lib/animations";
import { lockScroll } from "@/lib/smooth-scroll";
import { SITE } from "@/lib/constants";

/**
 * The mark is two strands wound through each other on a diagonal. The loader
 * takes it at its word: the strands arrive along that diagonal, lock, hold,
 * and then come apart the same way they went together — each one leaving on
 * the heading it was already travelling on.
 *
 * The split is a clip, not two files. Each strand is the same image masked to
 * one side of the mark's own axis, so the two halves separate exactly where the
 * artwork does and the seam is never visible while they are locked.
 */
const STRANDS = [
  {
    id: "upper",
    // The hypotenuse is pushed 3% past the mark's axis so the two halves
    // overlap instead of meeting exactly. Abutting clip paths are both
    // antialiased, and the half-covered pixels along the join read as a hairline
    // crack straight through the logo while it is supposed to be whole.
    clip: "polygon(0% 0%, 103% 0%, 0% 103%)",
    enter: { x: -132, y: -104, rotate: -9 },
    exit: { x: -260, y: -205, rotate: -13 },
  },
  {
    id: "lower",
    clip: "polygon(100% 0%, 100% 100%, 0% 100%)",
    enter: { x: 132, y: 104, rotate: 9 },
    exit: { x: 260, y: 205, rotate: 13 },
  },
] as const;

/**
 * Four beats: the strands arrive and lock, the name resolves, the strands come
 * apart along the same diagonal, and the panel recedes to leave the page.
 *
 * Each beat is started by the previous one *finishing*, not by a stopwatch. An
 * earlier version ran the whole thing on fixed timers and the sequence fell
 * apart on a cold load: hydration held framer-motion's first frame back by most
 * of a second while the timers kept their own time, so the panel lifted before
 * the strands had come apart at all. Animation-driven, the beats cannot get out
 * of order however slow the first paint is.
 *
 * The page is scroll-locked for the duration so nobody lands mid-animation.
 */
export function IntroLoader({ onDone }: { onDone: () => void }) {
  const [visible, setVisible] = useState(true);
  const [phase, setPhase] = useState<"in" | "hold" | "apart">("in");

  const finish = useCallback(() => {
    lockScroll(false);
    onDone();
  }, [onDone]);

  useEffect(() => {
    lockScroll(true);

    // Nothing here may depend on an animation callback to release the page.
    // If a frame never lands the reader still gets the site.
    const bail = window.setTimeout(() => setVisible(false), 4200);
    const hardRelease = window.setTimeout(finish, 5200);

    return () => {
      window.clearTimeout(bail);
      window.clearTimeout(hardRelease);
      lockScroll(false);
    };
  }, [finish]);

  // The pause between locking and coming apart — the only beat that is a
  // duration rather than an event, because nothing is moving through it.
  useEffect(() => {
    if (phase !== "hold") return;
    const t = window.setTimeout(() => setPhase("apart"), 430);
    return () => window.clearTimeout(t);
  }, [phase]);

  const apart = phase === "apart";

  // Only the first strand drives the sequence; the second would fire the same
  // transitions a beat later and double every step.
  const handleStrandSettled = (index: number) => {
    if (index !== 0) return;
    if (phase === "in") setPhase("hold");
    else if (phase === "apart") setVisible(false);
  };

  return (
    <AnimatePresence onExitComplete={finish}>
      {visible ? (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-[color:var(--color-bg)]"
          // Receding rather than wiping: the panel gives way to the page
          // instead of being pulled off it.
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.5, ease: EASE.inOutQuart }}
        >
          <div className="relative h-[clamp(96px,13vw,168px)] w-[clamp(140px,19vw,248px)]">
            {STRANDS.map((strand, i) => (
              <motion.div
                key={strand.id}
                aria-hidden
                className="absolute inset-0"
                style={{ clipPath: strand.clip, WebkitClipPath: strand.clip }}
                initial={{ ...strand.enter, opacity: 0 }}
                animate={
                  apart
                    ? { ...strand.exit, opacity: 0 }
                    : { x: 0, y: 0, rotate: 0, opacity: 1 }
                }
                transition={{
                  duration: apart ? 0.62 : 0.85,
                  // Arriving settles; leaving accelerates away.
                  ease: apart ? [0.55, 0, 0.9, 0.35] : EASE.outExpo,
                  delay: apart ? i * 0.05 : i * 0.07,
                }}
                onAnimationComplete={() => handleStrandSettled(i)}
              >
                <Image
                  src={SITE.logo}
                  alt=""
                  fill
                  priority
                  sizes="248px"
                  className="object-contain"
                />
              </motion.div>
            ))}
          </div>

          <motion.div
            aria-hidden
            className="mt-7 h-px w-[clamp(140px,19vw,248px)] origin-center bg-[color:var(--color-bg-accent)]"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: apart ? 0 : 1 }}
            transition={{
              duration: apart ? 0.5 : 0.8,
              ease: apart ? EASE.inOutQuart : EASE.outExpo,
              delay: apart ? 0 : 0.45,
            }}
          />

          <motion.p
            className="type-mono mt-6 text-[color:var(--color-bg-accent)]"
            initial={{ opacity: 0, letterSpacing: "0.5em" }}
            animate={
              apart
                ? { opacity: 0, letterSpacing: "0.5em" }
                : { opacity: 1, letterSpacing: "0.16em" }
            }
            transition={{
              duration: apart ? 0.45 : 0.9,
              ease: apart ? EASE.inOutQuart : EASE.outExpo,
              delay: apart ? 0 : 0.5,
            }}
          >
            {SITE.name}
          </motion.p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
