"use client";

import type { Service } from "@/lib/types";
import { ServiceGlyph } from "./ServiceGlyph";

interface ServiceCardProps {
  service: Service;
  /** Where it sits in the run of thirteen. Announced, not drawn. */
  index: number;
  total: number;
  /** True while this card is being held — straightened, lifted and turned. */
  turned: boolean;
  onClick: () => void;
  onFocus: () => void;
  onBlur: () => void;
}

/**
 * One discipline, as a card with two sides.
 *
 * The front says what it is; the back says what actually lands when it ships.
 * Neither has to carry both, which is what lets the front stay this quiet — a
 * label, a mark, a name and one line, thirteen times over.
 *
 * The turn is a real rotation rather than a crossfade, so the card reads as an
 * object with a back rather than a panel that swapped its contents. The arc
 * rotation the track applies is undone first (see ServiceTrack): a card turning
 * over while it is still angled 30 degrees away looks like a glitch, not a
 * gesture.
 */
export function ServiceCard({
  service,
  index,
  total,
  turned,
  onClick,
  onFocus,
  onBlur,
}: ServiceCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      onFocus={onFocus}
      onBlur={onBlur}
      aria-expanded={turned}
      className="group/card relative block h-full w-full cursor-pointer rounded-[var(--radius-card)] text-left focus-visible:outline-offset-[6px]"
    >
      <span className="sr-only">
        {service.name} — discipline {index + 1} of {total}.{" "}
        {turned ? "Showing what lands." : "Show what lands."}
      </span>

      <span
        className="relative block h-full w-full transition-transform duration-[900ms] ease-[cubic-bezier(0.76,0,0.24,1)] [transform-style:preserve-3d]"
        style={{
          transform: turned ? "rotateY(180deg)" : "rotateY(0deg)",
          // Held back just long enough for the track to straighten the card out
          // of the arc, so the two moves read as one gesture instead of a race.
          transitionDelay: turned ? "150ms" : "0ms",
        }}
      >
        <span
          aria-hidden={turned}
          className="absolute inset-0 block [backface-visibility:hidden]"
        >
          <Front service={service} />
        </span>
        <span
          aria-hidden={!turned}
          className="absolute inset-0 block [backface-visibility:hidden] [transform:rotateY(180deg)]"
        >
          <Back service={service} />
        </span>
      </span>
    </button>
  );
}

/* -------------------------------------------------------------------------- */

function Front({ service }: { service: Service }) {
  return (
    <span className="surface-raised relative flex h-full w-full flex-col justify-between overflow-hidden p-5 shadow-[0_38px_80px_-30px_rgba(0,0,0,0.95)] sm:p-6">
      <span className="flex items-start justify-between gap-3">
        <span className="type-mono text-[color:var(--color-bg-accent)]">
          {service.group}
        </span>
        <ServiceGlyph
          group={service.group}
          className="h-5 w-5 shrink-0 text-[color:var(--color-bg-accent)] transition-colors duration-500 group-hover/card:text-[color:var(--color-accent)] sm:h-6 sm:w-6"
        />
      </span>

      <span className="block">
        <span className="type-display block text-[clamp(1.35rem,2.2vw,1.9rem)] text-[color:var(--color-fg)]">
          {service.name}
        </span>
        <span className="type-note mt-3 block text-[0.875rem]">
          {service.description}
        </span>
        <span className="mt-5 flex items-center gap-2 text-[color:var(--color-bg-accent)] transition-colors duration-500 group-hover/card:text-[color:var(--color-accent)]">
          <span className="type-mono text-[0.5625rem]">What lands</span>
          <TurnGlyph />
        </span>
      </span>
    </span>
  );
}

function Back({ service }: { service: Service }) {
  return (
    <span className="surface-raised relative flex h-full w-full flex-col overflow-hidden p-5 shadow-[0_38px_80px_-30px_rgba(0,0,0,0.95)] sm:p-6">
      <span className="flex items-center justify-between gap-3">
        <span className="type-mono text-[color:var(--color-accent)]">
          {service.name}
        </span>
        <TurnGlyph className="rotate-180 text-[color:var(--color-accent)]" />
      </span>

      {/* Centred rather than stacked: three short rows sitting at the top of a
          card this tall would leave it looking unfinished. */}
      <span className="my-auto flex flex-col">
        {service.deliverables.map((item) => (
          <span
            key={item}
            className="type-display border-t border-[color:var(--color-bg-accent)]/40 py-3 text-[0.95rem] leading-[1.25] text-[color:var(--color-fg)] first:border-t-0"
          >
            {item}
          </span>
        ))}
      </span>
    </span>
  );
}

function TurnGlyph({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      width="13"
      height="13"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className ?? ""}`}
    >
      <path d="M2.6 9.4a5.5 5.5 0 1 0 1.2-4.9M3.2 2v2.8H6" />
    </svg>
  );
}
