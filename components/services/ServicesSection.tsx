"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { transition, VIEWPORT } from "@/lib/animations";
import { SERVICES } from "@/lib/constants";
import { ServiceCard } from "./ServiceCard";
import { ServiceTrack } from "./ServiceTrack";

/**
 * Everything the studio actually does, as one object rather than a list.
 *
 * A grid of thirteen cards would be a price list. The track is the same
 * thirteen held as a single moving thing the reader steers, which says
 * something a grid cannot: this is one team's range, not a menu to pick from.
 */
export function ServicesSection() {
  const reduceMotion = useReducedMotion();
  // Unknowable while rendering on the server. The track is what both sides
  // agree to draw first, and the still grid is swapped in a tick later —
  // branching on the preference directly would fail hydration outright.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const still = mounted && reduceMotion;

  return (
    <section
      id="capabilities"
      className="relative z-10 py-[var(--spacing-section)]"
    >
      <div className="shell">
        <div className="flex flex-col gap-9 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Capabilities"
            lines={["Everything between the", "idea and the live URL."]}
          />
          <motion.p
            className="type-body max-w-[36ch] text-[0.95rem] lg:pb-3"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ ...transition.enter, delay: 0.12 }}
          >
            {still
              ? "Thirteen disciplines, one team. Select a card to see what lands when that discipline ships."
              : "Thirteen disciplines, one team. Drag the track to move through it, or let the cursor steer — the closer you get to an edge, the faster it runs. Hover a card to hold it still and turn it over."}
          </motion.p>
        </div>
      </div>

      {/* Full-bleed: the track runs past both rules, so the reader can see it
          continue rather than seeing it end. */}
      <div className="mt-10 sm:mt-14">
        {still ? <StillGrid /> : <ServiceTrack />}
      </div>

      <div className="shell mt-10">
        <hr className="hairline" />
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
          <p className="type-mono text-[color:var(--color-bg-accent)]">
            {SERVICES.length} disciplines
          </p>
          <p className="type-mono text-[color:var(--color-bg-accent)]">
            Scope is agreed before anything is built
          </p>
        </div>
      </div>
    </section>
  );
}

/**
 * Reduced-motion fallback. Nothing drifts, nothing is steered, and the turn is
 * a tap — but the same card shows the same two sides, so the section still
 * answers both questions it was built to answer.
 */
function StillGrid() {
  const [turned, setTurned] = useState<number | null>(null);

  return (
    <div className="shell">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {SERVICES.map((service, i) => (
          <div key={service.id} className="h-[19rem]">
            <ServiceCard
              service={service}
              index={i}
              total={SERVICES.length}
              turned={turned === i}
              onClick={() => setTurned((open) => (open === i ? null : i))}
              onFocus={() => {}}
              onBlur={() => {}}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
