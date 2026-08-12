"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { EASE } from "@/lib/animations";
import { lockScroll } from "@/lib/smooth-scroll";
import type { CaseStudy } from "@/lib/types";
import { ArrowGlyph } from "@/components/shared/Button";

interface CaseModalProps {
  study: CaseStudy | null;
  onClose: () => void;
}

export function CaseModal({ study, onClose }: CaseModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!study) return;

    returnFocusTo.current = document.activeElement as HTMLElement | null;
    lockScroll(true);
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      lockScroll(false);
      returnFocusTo.current?.focus();
    };
  }, [study, onClose]);

  return (
    <AnimatePresence>
      {study ? (
        <motion.div
          key="case"
          className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button
            className="absolute inset-0 h-full w-full cursor-default bg-[color:var(--color-bg)]/88 backdrop-blur-md"
            onClick={onClose}
            aria-label="Close case study"
            tabIndex={-1}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="case-title"
            className="relative max-h-[92svh] w-full max-w-[64rem] overflow-y-auto overscroll-contain rounded-t-[22px] border border-[color:var(--color-bg-accent)]/70 bg-[color:var(--color-card)] sm:rounded-[22px]"
            initial={{ y: 40, opacity: 0, scale: 0.985 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.55, ease: EASE.outExpo }}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[color:var(--color-bg-accent)]/60 bg-[color:var(--color-card)]/92 px-6 py-4 backdrop-blur-sm sm:px-10">
              <p className="type-mono text-[color:var(--color-bg-accent)]">
                Case file
              </p>
              <button
                ref={closeRef}
                onClick={onClose}
                className="type-mono rounded-full border border-[color:var(--color-bg-accent)] px-4 py-2 text-[color:var(--color-accent)] transition-colors duration-300 hover:border-[color:var(--color-fg)] hover:text-[color:var(--color-fg)]"
              >
                Close
              </button>
            </div>

            {/* Height-capped rather than aspect-locked, so the title is on
                screen the moment the case file opens. */}
            <div className="relative h-[clamp(13rem,36svh,24rem)] w-full overflow-hidden bg-[color:var(--color-bg)]">
              <Image
                src={study.image}
                alt={`Team Unfazed with the ${study.name} prize cheque`}
                fill
                sizes="(max-width: 1024px) 100vw, 64rem"
                className="object-contain"
              />
            </div>

            <div className="px-6 pb-12 pt-10 sm:px-10">
              <h2
                id="case-title"
                className="type-display-xl text-[clamp(2.4rem,6vw,4.5rem)]"
              >
                {study.name}
              </h2>
              <p className="type-body mt-5 max-w-[52ch] text-[clamp(1rem,1.3vw,1.15rem)] text-[color:var(--color-fg)]">
                {study.tagline}
              </p>

              <dl className="mt-10 grid grid-cols-1 border-t border-[color:var(--color-bg-accent)]/50 sm:grid-cols-2">
                {study.facts.map((fact) => (
                  <div
                    key={fact.label}
                    className="flex flex-col gap-1 border-b border-[color:var(--color-bg-accent)]/50 py-4 sm:odd:pr-8 sm:even:pl-8"
                  >
                    <dt className="type-mono text-[color:var(--color-bg-accent)]">
                      {fact.label}
                    </dt>
                    <dd className="type-body text-[0.95rem] text-[color:var(--color-fg)]">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-10 flex max-w-[62ch] flex-col gap-5">
                {study.body.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)} className="type-body">
                    {paragraph}
                  </p>
                ))}
              </div>

              <a
                href={study.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-10 inline-flex items-center gap-3 border-b border-[color:var(--color-bg-accent)] pb-2 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-[color:var(--color-accent)] transition-colors duration-300 hover:border-[color:var(--color-fg)] hover:text-[color:var(--color-fg)]"
              >
                {study.sourceLabel}
                <ArrowGlyph />
              </a>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
