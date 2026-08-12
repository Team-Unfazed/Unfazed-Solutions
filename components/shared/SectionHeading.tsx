"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { MaskedLine } from "./Reveal";
import { transition, VIEWPORT } from "@/lib/animations";

interface SectionHeadingProps {
  /** Mono label. Names the section, never decorates it. */
  eyebrow: string;
  /** Each entry is one masked line of display type. */
  lines: string[];
  lead?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  lines,
  lead,
  align = "left",
  className,
}: SectionHeadingProps) {
  const isCentered = align === "center";

  return (
    <header
      className={`flex flex-col ${isCentered ? "items-center text-center" : "items-start"} ${className ?? ""}`}
    >
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
        {eyebrow}
      </motion.p>

      {/* Lines are pre-broken for wide screens. On narrow ones they are allowed
          to wrap instead, so the type can stay large rather than shrinking to
          fit the longest line on a phone. */}
      <h2 className="type-display mt-6 text-[clamp(2.05rem,5.4vw,4.9rem)] text-[color:var(--color-fg)] md:whitespace-nowrap">
        {lines.map((line, i) => (
          <MaskedLine key={line} delay={i * 0.08}>
            {line}
          </MaskedLine>
        ))}
      </h2>

      {lead ? (
        <motion.p
          className={`type-body mt-7 max-w-[46ch] text-[clamp(0.95rem,1.15vw,1.075rem)] ${
            isCentered ? "text-center" : ""
          }`}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ ...transition.enter, delay: 0.18 }}
        >
          {lead}
        </motion.p>
      ) : null}
    </header>
  );
}
