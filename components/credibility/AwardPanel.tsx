"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Award } from "@/lib/types";
import { transition, VIEWPORT } from "@/lib/animations";
import { ArrowGlyph } from "@/components/shared/Button";

interface AwardPanelProps {
  award: Award;
  featured?: boolean;
  onOpen?: (caseStudyId: string) => void;
  /** Third-party coverage of the win, linked in the open under the panel. */
  source?: { label: string; url: string };
  priority?: boolean;
}

/**
 * One win. The award photography is the only colour anywhere on this site, so
 * it stays desaturated until the reader engages with it and then resolves —
 * the palette holds, and the moment is earned rather than decorative.
 */
export function AwardPanel({
  award,
  featured = false,
  onOpen,
  source,
  priority = false,
}: AwardPanelProps) {
  const interactive = Boolean(award.caseStudyId && onOpen);

  const body = (
    <>
      <div
        className={`relative w-full overflow-hidden rounded-[var(--radius-card)] bg-black ${
          featured ? "aspect-[16/10]" : "aspect-[3/2]"
        }`}
      >
        <Image
          src={award.image}
          alt={`${award.event} — ${award.placement}`}
          fill
          priority={priority}
          sizes={featured ? "(max-width: 1024px) 100vw, 62vw" : "(max-width: 1024px) 100vw, 30vw"}
          className={`object-cover object-center transition-[filter,transform] duration-[900ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.02] ${
            award.desaturate
              ? "grayscale group-hover:grayscale-0 group-focus-visible:grayscale-0"
              : ""
          }`}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[color:var(--color-bg)] via-transparent to-transparent opacity-70"
        />

        {interactive ? (
          <span className="type-mono absolute bottom-5 right-5 flex items-center gap-2 rounded-full bg-[color:var(--color-cta)] px-4 py-2.5 text-[color:var(--color-cta-fg)]">
            Read the case
            <ArrowGlyph />
          </span>
        ) : null}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div>
          <h3
            className={`type-display text-[color:var(--color-fg)] ${
              featured
                ? "text-[clamp(1.3rem,2.6vw,2.25rem)]"
                : "text-[clamp(1.1rem,1.8vw,1.5rem)]"
            }`}
          >
            {award.placement}
          </h3>
          <p className="type-body mt-2 max-w-[38ch] text-[0.9rem]">
            {award.event}
          </p>
        </div>
        <p className="type-mono shrink-0 text-[color:var(--color-bg-accent)] sm:text-right">
          {award.year}
          <span className="mt-1 block normal-case tracking-[0.08em]">
            {award.location}
          </span>
        </p>
      </div>
    </>
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={transition.enter}
      className="group"
    >
      {interactive ? (
        // A real link to the case study's own page, which the click upgrades
        // into the modal. A crawler, a reader without JavaScript, and anyone
        // opening it in a new tab all reach the same content at a URL.
        <a
          href={`/work/${award.caseStudyId}`}
          onClick={(event) => {
            if (
              event.button !== 0 ||
              event.metaKey ||
              event.ctrlKey ||
              event.shiftKey ||
              event.altKey
            )
              return;
            event.preventDefault();
            onOpen?.(award.caseStudyId as string);
          }}
          aria-haspopup="dialog"
          className="block w-full cursor-pointer text-left"
          aria-label={`${award.placement}, ${award.event}. Open the case study.`}
        >
          {body}
        </a>
      ) : (
        body
      )}

      {source ? (
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-3 border-b border-[color:var(--color-bg-accent)] pb-2 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-[color:var(--color-accent)] transition-colors duration-300 hover:border-[color:var(--color-fg)] hover:text-[color:var(--color-fg)]"
        >
          {source.label}
          <ArrowGlyph />
        </a>
      ) : null}
    </motion.article>
  );
}
