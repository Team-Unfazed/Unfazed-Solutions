"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { FOUNDERS } from "@/lib/constants";
import { transition, VIEWPORT, EASE } from "@/lib/animations";
import { FounderCard } from "./FounderCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function FoundersSection() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const isPaused = useRef(false);

  const toggle = useCallback((id: string) => {
    setOpenId((current) => (current === id ? null : id));
  }, []);

  const prev = () => setActiveIndex((i) => (i === 0 ? FOUNDERS.length - 1 : i - 1));
  const next = useCallback(() => setActiveIndex((i) => (i === FOUNDERS.length - 1 ? 0 : i + 1)), []);

  // Auto-advance every 3 s, pauses on hover
  useEffect(() => {
    const id = setInterval(() => {
      if (!isPaused.current) next();
    }, 3000);
    return () => clearInterval(id);
  }, [next]);

  // Swipe support
  const touchStartX = useRef<number>(0);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 40) next();
    else if (diff < -40) prev();
  };

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

        {/* ── Mobile slider (hidden on md+) ──────────────────────────────── */}
        <div className="mt-16 md:hidden">
          <div
            className="relative overflow-hidden rounded-[var(--radius-card)]"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <motion.div
              className="flex"
              animate={{ x: `-${activeIndex * 100}%` }}
              transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
            >
              {FOUNDERS.map((founder) => (
                <div
                  key={founder.id}
                  className="w-full flex-shrink-0 rounded-[var(--radius-card)] overflow-hidden relative group"
                  style={{ height: "min(90svh, 560px)" }}
                  onMouseEnter={() => { isPaused.current = true; setHoveredCard(founder.id); }}
                  onMouseLeave={() => { isPaused.current = false; setHoveredCard(null); }}
                >
                  {/* Full-card portrait */}
                  <Image
                    src={founder.image}
                    alt={founder.name}
                    fill
                    sizes="100vw"
                    className="object-cover object-[50%_18%] grayscale contrast-[1.06] brightness-[0.95] transition-transform duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-105"
                  />

                  {/* Permanent bottom scrim — name always readable */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                  {/* Name + role — always visible */}
                  <div className="absolute inset-x-0 bottom-0 p-6 z-10">
                    <p className="type-mono text-[color:var(--color-bg-accent)]">{founder.role}</p>
                    <h3 className="type-display mt-1 text-[1.75rem] text-[color:var(--color-fg)]">{founder.name}</h3>
                  </div>

                  {/* Hover overlay — slides up over the image */}
                  <AnimatePresence>
                    {hoveredCard === founder.id && (
                      <motion.div
                        className="absolute inset-0 z-20 flex flex-col justify-end p-6"
                        style={{ background: "linear-gradient(to top, rgba(10,10,10,0.97) 0%, rgba(10,10,10,0.88) 50%, rgba(10,10,10,0.55) 100%)" }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: EASE.glide }}
                      >
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: 10, opacity: 0 }}
                          transition={{ duration: 0.35, delay: 0.05, ease: EASE.outExpo }}
                        >
                          <p className="type-mono text-[color:var(--color-bg-accent)]">{founder.role}</p>
                          <h3 className="type-display mt-1 text-[1.75rem] text-[color:var(--color-fg)]">{founder.name}</h3>
                          <p className="type-body mt-4 text-[0.9rem] leading-[1.65]">{founder.bio}</p>
                          <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-[color:var(--color-bg-accent)]/40 pt-4">
                            {founder.owns.map((item) => (
                              <li key={item} className="type-mono text-[color:var(--color-accent)]/70">
                                {item}
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Controls */}
          <div className="mt-5 flex items-center justify-between">
            <div className="flex gap-2">
              {FOUNDERS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Go to founder ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === activeIndex
                      ? "w-6 bg-[color:var(--color-fg)]"
                      : "w-1.5 bg-[color:var(--color-bg-accent)]"
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={prev}
                aria-label="Previous founder"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--color-bg-accent)]/60 text-[color:var(--color-accent)] transition-opacity"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={next}
                aria-label="Next founder"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--color-bg-accent)]/60 text-[color:var(--color-accent)] transition-opacity"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="type-mono text-[color:var(--color-bg-accent)]">
              {FOUNDERS.length} founders
            </p>
            <p className="type-mono text-[color:var(--color-bg-accent)]">
              {activeIndex + 1} / {FOUNDERS.length}
            </p>
          </div>
        </div>

        {/* ── Desktop accordion (hidden on mobile) ──────────────────────── */}
        <motion.ul
          className="mt-16 hidden h-[min(88svh,52rem)] flex-col gap-2 md:flex md:h-[clamp(26rem,42vw,34rem)] md:flex-row md:gap-3"
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

        <div className="mt-8 hidden items-center justify-between md:flex">
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

