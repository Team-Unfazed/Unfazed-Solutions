"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TESTIMONIALS } from "@/lib/constants";
import { transition, VIEWPORT } from "@/lib/animations";
import { TestimonialPanel, type CanvasMetrics } from "./TestimonialPanel";

const PLACEMENT = [
  { left: -0.02, top: 0.34, width: 0.22, rotate: -1.2, drift: 12, window: [0, 0.9] },
  { left: 0.235, top: 0.22, width: 0.22, rotate: 1.0, drift: -8, window: [0.006, 0.885] },
  { left: 0.49, top: 0.13, width: 0.22, rotate: -0.8, drift: 18, window: [0.012, 0.87] },
  { left: 0.745, top: 0.25, width: 0.22, rotate: 1.4, drift: -4, window: [0.018, 0.855] },
] as const;

const CLEARANCE = 72;
const MONUMENT = ["Ask the", "people who", "paid for it."];

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [isWide, setIsWide] = useState(false);
  const [metrics, setMetrics] = useState<CanvasMetrics | null>(null);

  // Mobile editorial slider state
  const [active, setActive] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleChange = (index: number) => {
    if (index === active || isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActive(index);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 250);
  };
  const handlePrev = () => handleChange(active === 0 ? TESTIMONIALS.length - 1 : active - 1);
  const handleNext = () => handleChange(active === TESTIMONIALS.length - 1 ? 0 : active + 1);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const sync = () => setIsWide(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const measure = () => {
      const rect = canvas.getBoundingClientRect();
      setMetrics({ width: rect.width, offsetLeft: rect.left, viewport: window.innerWidth });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(canvas);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [isWide]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const glide = useSpring(scrollYProgress, { stiffness: 58, damping: 28, mass: 1 });

  const scattered = isWide && !reduceMotion && metrics !== null;

  const crossing = metrics
    ? (() => {
        const lefts = PLACEMENT.map((p) => p.left);
        const rights = PLACEMENT.map((p) => p.left + p.width);
        const rowLeft = metrics.offsetLeft + Math.min(...lefts) * metrics.width;
        const rowRight = metrics.offsetLeft + Math.max(...rights) * metrics.width;
        return { enter: metrics.viewport - rowLeft + CLEARANCE, exit: -(rowRight + CLEARANCE) };
      })()
    : null;

  const current = TESTIMONIALS[active];

  return (
    <section
      id="clients"
      ref={sectionRef}
      className="clients-room z-10 py-[var(--spacing-section)]"
    >
      <div className="relative z-10 px-[var(--spacing-gutter)]">
        <motion.p
          className="type-mono flex items-center gap-3 text-[color:var(--color-bg-accent)]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VIEWPORT}
          transition={transition.enter}
        >
          <span aria-hidden className="inline-block h-px w-8 bg-[color:var(--color-bg-accent)]" />
          Clients
        </motion.p>

        <div ref={canvasRef} className="mt-10 lg:relative lg:mt-6 lg:aspect-[19/12.5]">
          <motion.h2
            className="clients-monument max-w-[16ch] lg:absolute lg:left-0 lg:top-[7%] lg:z-0 lg:max-w-none lg:w-[73%]"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ ...transition.enter, delay: 0.1 }}
          >
            {MONUMENT.map((line) => (
              <span key={line} className="block">{line}</span>
            ))}
          </motion.h2>

          <motion.p
            className="type-body mt-8 max-w-[46ch] text-[clamp(0.95rem,1.05vw,1.05rem)] lg:absolute lg:right-0 lg:top-[8%] lg:z-20 lg:mt-0 lg:w-[22%] lg:max-w-none"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ ...transition.enter, delay: 0.2 }}
          >
            We work as one team with our clients. Scope is agreed before anything is
            built, and the handover includes documentation, environment access and a
            walkthrough. Names are withheld under NDA; sectors and cities are not.
          </motion.p>

          {/* ── Mobile editorial slider (hidden on lg+) ─────────────────── */}
          <motion.div
            className="mt-12 lg:hidden"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ ...transition.enter, delay: 0.15 }}
          >
            <div className="flex items-start gap-5">
              {/* Large index number */}
              <span
                className="text-[80px] font-light leading-none select-none transition-all duration-500 text-[color:var(--color-fg)]/10"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {String(active + 1).padStart(2, "0")}
              </span>

              <div className="flex-1 pt-3">
                {/* Sector label */}
                <p className="type-mono text-[color:var(--color-bg-accent)]">
                  {current.sector}
                </p>

                {/* Quote */}
                <blockquote
                  className={`clients-quote mt-3 text-[1.15rem] leading-[1.65] transition-all duration-250 ${
                    isTransitioning ? "opacity-0 translate-x-3" : "opacity-100 translate-x-0"
                  }`}
                >
                  &ldquo;{current.quote}&rdquo;
                </blockquote>

                {/* Attribution */}
                <div
                  className={`mt-6 transition-all duration-250 delay-75 ${
                    isTransitioning ? "opacity-0" : "opacity-100"
                  }`}
                >
                  <p className="type-mono text-[color:var(--color-accent)]">
                    {current.attribution}
                  </p>
                  <p className="type-mono mt-1 text-[color:color-mix(in_srgb,var(--color-accent)_50%,var(--color-bg))]">
                    {current.city}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-10 flex items-center justify-between border-t border-[color:var(--color-bg-accent)]/40 pt-6">
              {/* Dot / line indicators + counter */}
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-2">
                  {TESTIMONIALS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handleChange(i)}
                      aria-label={`Go to testimonial ${i + 1}`}
                      className="group relative py-3"
                    >
                      <span
                        className={`block h-px transition-all duration-500 ease-out ${
                          i === active
                            ? "w-10 bg-[color:var(--color-fg)]"
                            : "w-5 bg-[color:var(--color-bg-accent)] group-hover:w-7"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="type-mono text-[color:var(--color-bg-accent)]">
                  {String(active + 1).padStart(2, "0")} / {String(TESTIMONIALS.length).padStart(2, "0")}
                </span>
              </div>

              {/* Prev / Next */}
              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrev}
                  aria-label="Previous testimonial"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-[color:var(--color-bg-accent)] transition-colors duration-300 hover:text-[color:var(--color-fg)] hover:bg-[color:var(--color-bg-accent)]/10"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={handleNext}
                  aria-label="Next testimonial"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-[color:var(--color-bg-accent)] transition-colors duration-300 hover:text-[color:var(--color-fg)] hover:bg-[color:var(--color-bg-accent)]/10"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </motion.div>

          {/* ── Desktop scattered panels (hidden on mobile) ─────────────── */}
          <div className="hidden lg:mt-0 lg:block">
            {TESTIMONIALS.map((testimonial, index) => (
              <TestimonialPanel
                key={testimonial.id}
                testimonial={testimonial}
                placement={PLACEMENT[index]}
                progress={glide}
                crossing={crossing}
                scattered={scattered}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

