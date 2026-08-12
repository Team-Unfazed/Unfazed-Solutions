"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { Founder } from "@/lib/types";
import { EASE } from "@/lib/animations";

interface FounderCardProps {
  founder: Founder;
  isOpen: boolean;
  isDimmed: boolean;
  onToggle: (id: string) => void;
  onHover: (id: string | null) => void;
  hovered: boolean;
  priority?: boolean;
}

/**
 * One panel in the founder accordion. Collapsed it shows a name and nothing
 * else; opened it gives up the whole panel to that person's detail.
 *
 * Every portrait is composited onto a solid black plate so the five sit on one
 * consistent ground regardless of what they were shot against.
 */
export function FounderCard({
  founder,
  isOpen,
  isDimmed,
  onToggle,
  onHover,
  hovered,
  priority = false,
}: FounderCardProps) {
  const grow = isOpen ? 3.6 : hovered ? 1.22 : 1;

  return (
    <li
      className="relative min-h-[4.75rem] min-w-0 basis-0 overflow-hidden rounded-[var(--radius-card)] bg-black transition-[flex-grow] duration-[850ms] ease-[cubic-bezier(0.76,0,0.24,1)] md:min-h-0"
      style={{ flexGrow: grow }}
      onMouseEnter={() => onHover(founder.id)}
      onMouseLeave={() => onHover(null)}
    >
      <button
        type="button"
        onClick={() => onToggle(founder.id)}
        aria-expanded={isOpen}
        aria-controls={`founder-detail-${founder.id}`}
        className="absolute inset-0 h-full w-full cursor-pointer text-left"
      >
        <span className="sr-only">
          {isOpen
            ? `Collapse ${founder.name}`
            : `Read about ${founder.name}, ${founder.role}`}
        </span>

        <span
          className={`absolute inset-0 block transition-opacity duration-[850ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${
            isDimmed ? "opacity-45" : "opacity-100"
          }`}
        >
          {/* Cropped to the face rather than the top of the frame: a collapsed
              row on a phone is short and wide, and `object-top` would show
              nothing but hair. */}
          <Image
            src={founder.image}
            alt=""
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, 45vw"
            className="object-cover object-[50%_18%] grayscale contrast-[1.06] brightness-[0.95] transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] md:object-top"
            style={{ transform: isOpen ? "scale(1.03)" : "scale(1)" }}
          />
        </span>

        {/* Scrim. The copy runs across a short row on a phone and down a tall
            column on a desktop, so the gradient turns with it. */}
        <span
          aria-hidden
          className={`absolute inset-0 block transition-opacity duration-700 ${
            isOpen
              ? "bg-[linear-gradient(0deg,rgba(10,10,10,0.96)_0%,rgba(10,10,10,0.74)_46%,rgba(10,10,10,0.12)_88%)] md:bg-[linear-gradient(90deg,rgba(10,10,10,0.94)_0%,rgba(10,10,10,0.78)_42%,rgba(10,10,10,0.05)_78%)]"
              : "bg-[linear-gradient(90deg,rgba(10,10,10,0.95)_0%,rgba(10,10,10,0.55)_50%,rgba(10,10,10,0.05)_84%)] md:bg-[linear-gradient(0deg,rgba(10,10,10,0.92)_0%,rgba(10,10,10,0.15)_46%,rgba(10,10,10,0)_72%)]"
          }`}
        />
      </button>

      {/* Collapsed label. Runs vertically on desktop so a narrow panel still
          carries the person's name. */}
      <AnimatePresence initial={false}>
        {!isOpen ? (
          <motion.div
            key="collapsed"
            className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-start gap-1 p-5 md:top-auto md:h-full md:flex-row md:items-end md:gap-2 md:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32, ease: EASE.glide }}
          >
            <p className="type-display whitespace-nowrap text-[1.05rem] text-[color:var(--color-fg)] [text-shadow:0_1px_14px_rgba(10,10,10,0.85)] md:[writing-mode:vertical-rl] md:rotate-180">
              {founder.name}
            </p>
            {/* The role runs up past the scrim and onto the shirt, so it is set
                in the page's black rather than a grey: white disappeared into
                the shirt, and grey disappeared into both. The halo carries it
                back over the few dark pixels it still crosses. */}
            <p className="type-mono whitespace-nowrap font-medium text-[color:var(--color-bg)] [text-shadow:0_0_2px_rgba(240,240,240,0.95),0_0_5px_rgba(240,240,240,0.9),0_0_12px_rgba(240,240,240,0.65)] md:[writing-mode:vertical-rl] md:rotate-180">
              {founder.role}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Open detail. */}
      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            key="open"
            id={`founder-detail-${founder.id}`}
            className="pointer-events-none absolute inset-0 flex flex-col justify-end p-6 sm:p-9"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, delay: 0.16, ease: EASE.glide }}
          >
            <motion.div
              className="max-w-[34ch]"
              initial={{ y: 26 }}
              animate={{ y: 0 }}
              exit={{ y: 14 }}
              transition={{ duration: 0.7, delay: 0.16, ease: EASE.outExpo }}
            >
              <p className="type-mono text-[color:var(--color-accent)]">
                {founder.role}
              </p>
              <h3 className="type-display mt-3 text-[clamp(1.55rem,2.5vw,2.15rem)] text-[color:var(--color-fg)]">
                {founder.name}
              </h3>
              <p className="type-body mt-4 text-[0.9rem] leading-[1.6]">
                {founder.bio}
              </p>

              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-[color:var(--color-bg-accent)]/60 pt-4">
                {founder.owns.map((item) => (
                  <li
                    key={item}
                    className="type-mono text-[color:var(--color-accent)]/75"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </li>
  );
}
