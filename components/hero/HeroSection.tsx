"use client";

import { useLayoutEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowGlyph, Button } from "@/components/shared/Button";
import { useIntro } from "@/components/loader/IntroContext";
import { useEnquiry } from "@/components/contact/EnquiryContext";
import { scrollToSection } from "@/lib/smooth-scroll";
import { EASE } from "@/lib/animations";
import { SITE } from "@/lib/constants";

const HeroCanvas = dynamic(
  () => import("@/components/hero/HeroCanvas").then((m) => m.HeroCanvas),
  { ssr: false },
);

const LETTERS = SITE.wordmark.split("");
/** The index the word closes on. Odd count, so it is a real letter. */
const CENTRE = (LETTERS.length - 1) / 2;

const FACTS = [
  { value: "70,000+", label: "beaten" },
  { value: "₹5,00,000", label: "won" },
  { value: "13", label: "disciplines" },
];

/**
 * The wordmark, set to the full width of the shell, and what scroll does to it.
 *
 * The seven letters are justified edge to edge, and scrolling closes the gaps:
 * each letter travels toward the middle in proportion to how far out it starts,
 * so the word tightens rather than shrinking uniformly. It is the one idea the
 * page spends its motion budget on, and it is the studio's own claim made
 * literal — the pressure comes on, the word compresses, and it holds its shape
 * until it is already off the screen.
 *
 * Everything is translate and opacity, so the whole sequence composites.
 */
export function HeroSection() {
  const { ready } = useIntro();
  const enquiry = useEnquiry();
  const sectionRef = useRef<HTMLElement>(null);
  const rowRef = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();

  // The motion preference is not knowable on the server, and neither is the
  // gap — so the first client render must match the server exactly and the
  // choreography is switched on a tick later.
  const [mounted, setMounted] = useState(false);
  const [gap, setGap] = useState(0);
  const motionOn = mounted && !reduceMotion;

  useLayoutEffect(() => setMounted(true), []);

  // How much space `justify-content: space-between` has opened between two
  // letters. Every gap is identical, so one pair describes all six — and this
  // is the distance each letter has to travel to close them.
  useLayoutEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    const measure = () => {
      const kids = Array.from(row.children) as HTMLElement[];
      if (kids.length < 2) return;
      const a = kids[0].getBoundingClientRect();
      const b = kids[1].getBoundingClientRect();
      setGap(Math.max(0, b.left - a.right));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(row);
    // Webfonts land after first paint and change every glyph's width with them.
    document.fonts?.ready.then(measure).catch(() => {});
    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Held at zero until the choreography is switched on, so the server's markup
  // and the first client render agree.
  const still = useMotionValue(0);
  const p = motionOn ? scrollYProgress : still;

  // Three rates, not one. The meta rows leave first, the base block runs
  // furthest, and the word does neither — which is what reads as depth.
  const metaY = useTransform(p, [0, 1], [0, -170]);
  const metaOpacity = useTransform(p, [0, 0.32], [1, 0]);

  // Two beats. The word braces — the letters close the little slack they have
  // and it swells barely a twentieth — and then the page goes through it. The
  // second beat is the one you feel; the first is the reason it lands, because
  // the word has visibly held its ground before it is passed.
  const wordY = useTransform(p, [0, 1], [0, -46]);
  const wordScale = useTransform(p, [0, 0.34, 1], [1, 1.05, 1.85]);
  const wordOpacity = useTransform(p, [0, 0.46, 0.92], [1, 1, 0]);
  const suffixX = useTransform(p, [0, 0.34], [0, -26]);
  const suffixOpacity = useTransform(p, [0, 0.3], [1, 0]);

  const baseY = useTransform(p, [0, 1], [0, -230]);
  const baseOpacity = useTransform(p, [0, 0.4], [1, 0]);

  // The field goes the other way and shrinks, so the two planes separate
  // instead of sliding together.
  const fieldY = useTransform(p, [0, 1], [0, 130]);
  const fieldScale = useTransform(p, [0, 1], [1, 0.88]);
  const fieldOpacity = useTransform(p, [0.2, 0.85], [1, 0]);

  const delay = ready ? 0 : 0.1;

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden pb-8 pt-24 sm:pb-10 sm:pt-28"
    >
      <motion.div
        aria-hidden
        className="absolute inset-0"
        style={{ y: fieldY, scale: fieldScale, opacity: fieldOpacity }}
      >
        <HeroCanvas />
      </motion.div>

      {/* Holds the type legible over the brightest part of the field. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(10,10,10,0.72),transparent_74%)]"
      />

      {/* ---------------------------------------------------------------- */}

      <motion.div
        className="shell relative z-10"
        style={{ y: metaY, opacity: metaOpacity }}
      >
        <motion.div
          className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ duration: 1, ease: EASE.outExpo, delay }}
        >
          <p className="type-mono text-[color:var(--color-bg-accent)]">
            Software studio — {SITE.location}
          </p>
          <p className="type-mono text-[color:var(--color-bg-accent)]">
            Building since {SITE.founded}
          </p>
        </motion.div>
        <motion.hr
          className="hairline mt-4 origin-left"
          initial={{ scaleX: 0 }}
          animate={ready ? { scaleX: 1 } : {}}
          transition={{ duration: 1.3, ease: EASE.outExpo, delay: delay + 0.1 }}
        />
      </motion.div>

      {/* ---------------------------------------------------------------- */}

      <div className="shell relative z-10 flex flex-1 flex-col justify-center py-10">
        <motion.h1 style={{ y: wordY, scale: wordScale, opacity: wordOpacity }}>
          <span className="sr-only">
            {SITE.name} — a software studio in {SITE.location}
          </span>

          <span ref={rowRef} aria-hidden className="wordmark">
            {LETTERS.map((char, i) => (
              <Letter
                key={`${char}-${i}`}
                char={char}
                // Distance from the middle, in gaps. The outermost letters
                // travel three, the middle one never moves.
                offset={CENTRE - i}
                gap={motionOn ? gap : 0}
                progress={p}
                ready={ready}
                delay={delay + 0.18 + i * 0.055}
              />
            ))}
          </span>

          <motion.span
            aria-hidden
            className="type-mono mt-3 block text-right text-[color:var(--color-bg-accent)]"
            style={{ x: suffixX, opacity: suffixOpacity }}
          >
            <motion.span
              className="inline-block"
              initial={{ opacity: 0 }}
              animate={ready ? { opacity: 1 } : {}}
              transition={{ duration: 1, ease: EASE.outExpo, delay: delay + 0.62 }}
            >
              {SITE.suffix}
            </motion.span>
          </motion.span>
        </motion.h1>
      </div>

      {/* ---------------------------------------------------------------- */}

      <motion.div
        className="shell relative z-10"
        style={{ y: baseY, opacity: baseOpacity }}
      >
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <motion.p
            className="type-body max-w-[34ch] text-[clamp(1rem,1.3vw,1.2rem)]"
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: EASE.outExpo, delay: delay + 0.5 }}
          >
            <span className="text-[color:var(--color-fg)]">
              Deadlines move. Scope grows. Models change.
            </span>{" "}
            The build ships anyway.
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center gap-2.5 sm:gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: EASE.outExpo, delay: delay + 0.58 }}
          >
            <Button
              size="lg"
              onClick={enquiry.open}
              aria-haspopup="dialog"
            >
              Start a project
              <ArrowGlyph />
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => scrollToSection("record")}
            >
              See the record
            </Button>
          </motion.div>
        </div>

        <motion.div
          className="mt-8 sm:mt-10"
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ duration: 1, ease: EASE.outExpo, delay: delay + 0.68 }}
        >
          <hr className="hairline" />
          <dl className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-4 sm:gap-x-8 sm:gap-y-3">
            {FACTS.map((fact) => (
              <div key={fact.label} className="flex items-baseline gap-2">
                <dt className="type-mono text-[color:var(--color-fg)]">
                  {fact.value}
                </dt>
                <dd className="type-mono text-[color:var(--color-bg-accent)]">
                  {fact.label}
                </dd>
              </div>
            ))}
            <span className="type-mono ml-auto hidden items-center gap-2 text-[color:var(--color-bg-accent)] sm:flex">
              Scroll
              <motion.span
                aria-hidden
                className="inline-block h-3 w-px origin-top bg-[color:var(--color-bg-accent)]"
                animate={{ scaleY: [0.3, 1, 0.3] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              />
            </span>
          </dl>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * One letter of the wordmark.
 *
 * Two nested elements on purpose: the outer one carries the scroll travel, the
 * inner one the entrance. Putting both on a single element would mean clipping
 * the mask the letter rises out of, and that same clip would then cut the
 * letter off as it moved sideways.
 */
function Letter({
  char,
  offset,
  gap,
  progress,
  ready,
  delay,
}: {
  char: string;
  offset: number;
  gap: number;
  progress: MotionValue<number>;
  ready: boolean;
  delay: number;
}) {
  // Resolved early: the brace is over before the page starts moving through
  // the word, so the two beats read in sequence rather than on top of one
  // another.
  const x = useTransform(progress, [0, 0.34], [0, offset * gap]);

  return (
    <motion.span className="block" style={{ x }}>
      <span className="block overflow-hidden pb-[0.08em]">
        <motion.span
          className="block"
          initial={{ y: "115%" }}
          animate={ready ? { y: "0%" } : {}}
          transition={{ duration: 1.25, ease: EASE.outExpo, delay }}
        >
          {char}
        </motion.span>
      </span>
    </motion.span>
  );
}
