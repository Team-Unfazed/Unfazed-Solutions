"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { EASE, transition } from "@/lib/animations";
import { NAV_LINKS, SITE } from "@/lib/constants";
import { scrollToSection } from "@/lib/smooth-scroll";
import { useIntro } from "@/components/loader/IntroContext";

/**
 * Floating pill navigation. It retreats when the reader is moving down the
 * page and returns the moment they scroll back up, so it is never in the way
 * of the thing they are reading.
 *
 * The inline links appear at `md`, not `sm`. Five labels plus the mark and the
 * call to action measure ~716px; at the `sm` breakpoint the pill has 608px to
 * sit in, and `overflow-x: hidden` on the body would clip the call to action
 * off the right edge rather than scroll to it.
 */
export function FloatingNav() {
  const { ready } = useIntro();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // Kept in a ref, not state: this fires on every scroll frame and storing it
  // in state would re-render the nav sixty times a second.
  const lastY = useRef(0);

  useMotionValueEvent(scrollY, "change", (y) => {
    const goingDown = y > lastY.current;
    lastY.current = y;
    setHidden(goingDown && y > 220 && !menuOpen);
  });

  const go = (href: string) => {
    setMenuOpen(false);
    scrollToSection(href.replace("#", ""));
  };

  return (
    <motion.header
      className="fixed inset-x-0 top-4 z-50 flex justify-center px-4 sm:top-6"
      initial={{ opacity: 0, y: -24 }}
      animate={ready ? { opacity: 1, y: hidden ? -110 : 0 } : { opacity: 0 }}
      transition={{ duration: 0.65, ease: EASE.inOutQuart }}
    >
      <nav
        aria-label="Primary"
        className="flex w-full max-w-[46rem] flex-col rounded-[26px] border border-[color:var(--color-bg-accent)]/70 bg-[color:var(--color-bg)]/72 backdrop-blur-xl md:w-auto md:rounded-full"
      >
        <div className="flex items-center gap-2 p-2 pl-3 md:gap-1">
          <button
            onClick={() => scrollToSection("top")}
            className="flex shrink-0 items-center gap-2.5 rounded-full pr-2 md:pr-3"
            aria-label={`${SITE.name} — back to top`}
          >
            <span className="relative block h-7 w-9">
              <Image
                src={SITE.logo}
                alt=""
                fill
                priority
                sizes="36px"
                className="object-contain"
              />
            </span>
            {/* The mark alone identifies the studio; on a phone the pill needs
                the room for the call to action. */}
            <span className="type-mono hidden text-[color:var(--color-fg)] min-[420px]:inline">
              Unfazed
            </span>
          </button>

          <span
            aria-hidden
            className="mx-1 hidden h-5 w-px bg-[color:var(--color-bg-accent)] md:block"
          />

          <ul className="hidden items-center md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <button
                  onClick={() => go(link.href)}
                  className="type-mono rounded-full px-3 py-2.5 text-[color:var(--color-bg-accent)] transition-colors duration-300 hover:text-[color:var(--color-fg)] lg:px-3.5"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          <button
            onClick={() => go("#contact")}
            className="ml-auto shrink-0 rounded-full bg-[color:var(--color-cta)] px-4 py-2.5 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-[color:var(--color-cta-fg)] transition-opacity duration-300 hover:opacity-85 md:ml-1"
          >
            Start a project
          </button>

          <button
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-9 w-9 shrink-0 flex-col items-center justify-center gap-[5px] rounded-full border border-[color:var(--color-bg-accent)] md:hidden"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <motion.span
              className="block h-px w-3.5 bg-[color:var(--color-fg)]"
              animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 3 : 0 }}
              transition={transition.hover}
            />
            <motion.span
              className="block h-px w-3.5 bg-[color:var(--color-fg)]"
              animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -3 : 0 }}
              transition={transition.hover}
            />
          </button>
        </div>

        <AnimatePresence initial={false}>
          {menuOpen ? (
            <motion.ul
              key="menu"
              className="overflow-hidden md:hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.42, ease: EASE.inOutQuart }}
            >
              <li aria-hidden>
                <hr className="hairline mx-3" />
              </li>
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => go(link.href)}
                    className="type-mono w-full px-5 py-3.5 text-left text-[color:var(--color-accent)]"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </motion.ul>
          ) : null}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}
