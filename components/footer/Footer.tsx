"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { EASE, transition, VIEWPORT } from "@/lib/animations";
import { NAV_LINKS, SITE } from "@/lib/constants";
import { scrollToSection } from "@/lib/smooth-scroll";

const COLUMNS = [
  {
    heading: "Navigate",
    items: NAV_LINKS.map((link) => ({ label: link.label, href: link.href })),
  },
  {
    heading: "Elsewhere",
    items: [
      { label: "Email", href: `mailto:${SITE.email}` },
      { label: "LinkedIn", href: "#" },
      { label: "GitHub", href: "#" },
      { label: "Instagram", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-[color:var(--color-bg-accent)]/50 pt-[clamp(4rem,8vw,7rem)] overflow-hidden">
      {/* Radial ambient glow — matches the site's achromatic palette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(125% 125% at 50% -10%, #0a0a0a 40%, #2a2a2a 100%)",
        }}
      />
      <div className="shell">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <motion.div
            className="flex flex-col gap-5 lg:col-span-2"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={transition.enter}
          >
            <span className="relative block h-9 w-12">
              <Image src={SITE.logo} alt="" fill sizes="48px" className="object-contain" />
            </span>
            <p className="type-body max-w-[30ch] text-[0.95rem]">
              A software studio in {SITE.location}. We take a brief to a
              deployed, monitored product and hand you the keys.
            </p>
          </motion.div>

          {COLUMNS.map((column, index) => (
            <motion.nav
              key={column.heading}
              aria-label={column.heading}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ ...transition.enter, delay: 0.08 * (index + 1) }}
            >
              <p className="type-mono text-[color:var(--color-bg-accent)]">
                {column.heading}
              </p>
              <ul className="mt-5 flex flex-col gap-3">
                {column.items.map((item) => (
                  <li key={item.label}>
                    {item.href.startsWith("#") && item.href.length > 1 ? (
                      <button
                        onClick={() => scrollToSection(item.href.replace("#", ""))}
                        className="type-body text-[0.95rem] text-[color:var(--color-accent)] transition-colors duration-300 hover:text-[color:var(--color-fg)]"
                      >
                        {item.label}
                      </button>
                    ) : (
                      <a
                        href={item.href}
                        className="type-body text-[0.95rem] text-[color:var(--color-accent)] transition-colors duration-300 hover:text-[color:var(--color-fg)]"
                      >
                        {item.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </motion.nav>
          ))}
        </div>

        {/* The last impression: the name at full width, each letter hinged up
            off the baseline like a board turning face-on. The perspective
            origin sits on that baseline, so the outer letters swing through a
            wider arc than the middle ones and the row lands as one piece
            rather than seven separate reveals. */}
        <div className="mt-[clamp(4rem,9vw,8rem)] [perspective:900px] [perspective-origin:50%_100%]">
          <motion.p
            aria-hidden
            className="wordmark [transform-style:preserve-3d] [background:none] [-webkit-text-fill-color:var(--color-fg)] text-[color:var(--color-fg)]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.055 } },
            }}
          >
            {SITE.wordmark.split("").map((char, index) => (
              <motion.span
                key={`${char}-${index}`}
                className="block origin-bottom [backface-visibility:hidden]"
                variants={{
                  hidden: { rotateX: -84, y: "22%", opacity: 0 },
                  visible: {
                    rotateX: 0,
                    y: "0%",
                    opacity: 1,
                    transition: { duration: 1.25, ease: EASE.outExpo },
                  },
                }}
              >
                {char}
              </motion.span>
            ))}
          </motion.p>
        </div>

        <div className="flex flex-col gap-3 border-t border-[color:var(--color-bg-accent)]/50 py-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="type-mono text-[color:var(--color-bg-accent)]">
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <button
            onClick={() => scrollToSection("top")}
            className="type-mono self-start text-[color:var(--color-bg-accent)] transition-colors duration-300 hover:text-[color:var(--color-fg)] sm:self-auto"
          >
            Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}
