"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { FOUNDERS } from "@/lib/constants";
import { transition, VIEWPORT } from "@/lib/animations";
import { FounderCard } from "./FounderCard";

export function FoundersSection() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const toggle = useCallback((id: string) => {
    setOpenId((current) => (current === id ? null : id));
  }, []);

  return (
    <section id="team" className="relative z-10 py-[var(--spacing-section)]">
      <div className="shell">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="The team"
            lines={["Five people.", "No handoffs."]}
          />
          <motion.p
            className="type-body max-w-[34ch] text-[0.95rem] lg:pb-3"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ ...transition.enter, delay: 0.12 }}
          >
            The people who scope your project are the people who build it and
            the people who deploy it. Select anyone to read what they own.
          </motion.p>
        </div>

        <motion.ul
          className="mt-16 flex h-[min(88svh,52rem)] flex-col gap-2 md:h-[clamp(26rem,42vw,34rem)] md:flex-row md:gap-3"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={transition.enter}
        >
          {FOUNDERS.map((founder, index) => (
            <FounderCard
              key={founder.id}
              founder={founder}
              isOpen={openId === founder.id}
              isDimmed={openId !== null && openId !== founder.id}
              hovered={hoveredId === founder.id && openId === null}
              onToggle={toggle}
              onHover={setHoveredId}
              priority={index < 2}
            />
          ))}
        </motion.ul>

        <div className="mt-8 flex items-center justify-between">
          <p className="type-mono text-[color:var(--color-bg-accent)]">
            {FOUNDERS.length} founders
          </p>
          <p className="type-mono text-[color:var(--color-bg-accent)]">
            {openId ? "Select again to close" : "Select a founder"}
          </p>
        </div>
      </div>
    </section>
  );
}
