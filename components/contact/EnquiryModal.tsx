"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ComponentPropsWithoutRef, FormEvent, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE } from "@/lib/animations";
import {
  ENQUIRY_BUDGETS,
  ENQUIRY_TIMELINES,
  SERVICES,
  SITE,
} from "@/lib/constants";
import { lockScroll } from "@/lib/smooth-scroll";
import type { Enquiry } from "@/lib/types";
import {
  EMPTY_ENQUIRY,
  composeEnquiry,
  mailtoHref,
  validateEnquiry,
  whatsappHref,
  type EnquiryErrors,
} from "@/lib/whatsapp";
import { ArrowGlyph, Button } from "@/components/shared/Button";

const DISCIPLINES = SERVICES.map((service) => service.name);

const FOCUSABLE =
  "a[href],button:not([disabled]),input:not([disabled])," +
  "textarea:not([disabled]),[tabindex]:not([tabindex='-1'])";

const field =
  "w-full rounded-xl border bg-[color:var(--color-bg)] px-4 py-3 text-[0.95rem] " +
  "text-[color:var(--color-fg)] placeholder:text-[color:var(--color-bg-accent)] " +
  "transition-colors duration-300 outline-none focus:border-[color:var(--color-fg)]";

const fieldRest = "border-[color:var(--color-bg-accent)]/70";
const fieldInvalid = "border-[color:var(--color-fg)]/70";

/** Pill shared by the discipline chips and the budget / timeline answers. */
function Pill({
  active,
  children,
  ...rest
}: { active: boolean; children: ReactNode } & ComponentPropsWithoutRef<"button">) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={`type-mono rounded-full border px-3.5 py-2 transition-colors duration-300 ${
        active
          ? "border-[color:var(--color-cta)] bg-[color:var(--color-cta)] text-[color:var(--color-cta-fg)]"
          : "border-[color:var(--color-bg-accent)] text-[color:var(--color-accent)] hover:border-[color:var(--color-fg)] hover:text-[color:var(--color-fg)]"
      }`}
      {...rest}
    >
      {children}
    </button>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="type-mono mt-2 text-[color:var(--color-fg)]">
      {message}
    </p>
  );
}

interface EnquiryModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * The project brief. It collects the enquiry, then hands it to WhatsApp as a
 * click-to-chat link with the message already composed — WhatsApp itself sends
 * from the visitor's own number, which is why the last tap belongs to them.
 */
export function EnquiryModal({ open, onClose }: EnquiryModalProps) {
  const [draft, setDraft] = useState<Enquiry>(EMPTY_ENQUIRY);
  const [errors, setErrors] = useState<EnquiryErrors>({});
  /** `form` collects the brief; `handoff` is shown once WhatsApp is opened. */
  const [stage, setStage] = useState<"form" | "handoff">("form");
  const [copied, setCopied] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const briefRef = useRef<HTMLTextAreaElement>(null);
  const returnFocusTo = useRef<HTMLElement | null>(null);

  const message = composeEnquiry(draft);

  const set = useCallback(
    <K extends keyof Enquiry>(key: K, value: Enquiry[K]) => {
      setDraft((current) => ({ ...current, [key]: value }));
      setErrors((current) => ({ ...current, [key]: undefined }));
    },
    [],
  );

  const toggleDiscipline = (name: string) =>
    setDraft((current) => ({
      ...current,
      disciplines: current.disciplines.includes(name)
        ? current.disciplines.filter((item) => item !== name)
        : [...current.disciplines, name],
    }));

  /* The draft survives a close — someone who dismisses the dialog by accident
     should not have to type it out again — but the handoff screen does not. */
  useEffect(() => {
    if (!open) return;

    setStage("form");
    setCopied(false);
    returnFocusTo.current = document.activeElement as HTMLElement | null;
    lockScroll(true);
    // After the entrance transform settles, so the caret is not dragged in with it.
    const focusTimer = window.setTimeout(() => nameRef.current?.focus(), 380);

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      // A form dialog has enough stops that Tab must not walk out the back of
      // it and into the page underneath.
      const stops = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((node) => node.offsetParent !== null);
      if (!stops.length) return;

      const first = stops[0];
      const last = stops[stops.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKey);
      lockScroll(false);
      returnFocusTo.current?.focus();
    };
  }, [open, onClose]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const found = validateEnquiry(draft);
    if (Object.keys(found).length) {
      setErrors(found);
      (found.name ? nameRef : briefRef).current?.focus();
      return;
    }

    // Opened straight out of the submit handler so the browser still counts it
    // as a user gesture. A blocked tab is survivable: the handoff screen keeps
    // the same link as plain markup.
    window.open(whatsappHref(message), "_blank", "noopener,noreferrer");
    setStage("handoff");
  };

  const copyBrief = async () => {
    try {
      await navigator.clipboard.writeText(message.replace(/\*/g, ""));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="enquiry"
          className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button
            className="absolute inset-0 h-full w-full cursor-default bg-[color:var(--color-bg)]/88 backdrop-blur-md"
            onClick={onClose}
            aria-label="Close the project brief"
            tabIndex={-1}
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="enquiry-title"
            className="relative max-h-[92svh] w-full max-w-[46rem] overflow-y-auto overscroll-contain rounded-t-[22px] border border-[color:var(--color-bg-accent)]/70 bg-[color:var(--color-card)] sm:rounded-[22px]"
            initial={{ y: 40, opacity: 0, scale: 0.985 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.55, ease: EASE.outExpo }}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[color:var(--color-bg-accent)]/60 bg-[color:var(--color-card)]/92 px-6 py-4 backdrop-blur-sm sm:px-10">
              <p className="type-mono text-[color:var(--color-bg-accent)]">
                {stage === "form" ? "Project brief" : "Over to WhatsApp"}
              </p>
              <button
                type="button"
                onClick={onClose}
                className="type-mono rounded-full border border-[color:var(--color-bg-accent)] px-4 py-2 text-[color:var(--color-accent)] transition-colors duration-300 hover:border-[color:var(--color-fg)] hover:text-[color:var(--color-fg)]"
              >
                Close
              </button>
            </div>

            {stage === "form" ? (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="px-6 pb-12 pt-8 sm:px-10"
              >
                <h2
                  id="enquiry-title"
                  className="type-display text-[clamp(1.9rem,4.2vw,2.9rem)] text-[color:var(--color-fg)]"
                >
                  Tell us what needs building.
                </h2>
                <p className="type-body mt-4 max-w-[46ch] text-[0.95rem]">
                  Two fields are required. The rest sharpen the first reply. It
                  lands on WhatsApp at {SITE.phone}.
                </p>

                <div className="mt-9 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="enquiry-name"
                      className="type-mono block pb-2.5 text-[color:var(--color-bg-accent)]"
                    >
                      Name *
                    </label>
                    <input
                      ref={nameRef}
                      id="enquiry-name"
                      name="name"
                      autoComplete="name"
                      value={draft.name}
                      onChange={(event) => set("name", event.target.value)}
                      aria-invalid={!!errors.name}
                      aria-describedby={
                        errors.name ? "enquiry-name-error" : undefined
                      }
                      className={`${field} ${errors.name ? fieldInvalid : fieldRest}`}
                      placeholder="Who is writing"
                    />
                    <FieldError id="enquiry-name-error" message={errors.name} />
                  </div>

                  <div>
                    <label
                      htmlFor="enquiry-email"
                      className="type-mono block pb-2.5 text-[color:var(--color-bg-accent)]"
                    >
                      Email
                    </label>
                    <input
                      id="enquiry-email"
                      name="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={draft.email}
                      onChange={(event) => set("email", event.target.value)}
                      aria-invalid={!!errors.email}
                      aria-describedby={
                        errors.email ? "enquiry-email-error" : undefined
                      }
                      className={`${field} ${errors.email ? fieldInvalid : fieldRest}`}
                      placeholder="Optional"
                    />
                    <FieldError id="enquiry-email-error" message={errors.email} />
                  </div>
                </div>

                <fieldset className="mt-8">
                  <legend className="type-mono pb-3.5 text-[color:var(--color-bg-accent)]">
                    What do you need
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {DISCIPLINES.map((name) => (
                      <Pill
                        key={name}
                        active={draft.disciplines.includes(name)}
                        onClick={() => toggleDiscipline(name)}
                      >
                        {name}
                      </Pill>
                    ))}
                  </div>
                </fieldset>

                <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
                  <fieldset>
                    <legend className="type-mono pb-3.5 text-[color:var(--color-bg-accent)]">
                      Budget
                    </legend>
                    <div className="flex flex-wrap gap-2">
                      {ENQUIRY_BUDGETS.map((option) => (
                        <Pill
                          key={option}
                          active={draft.budget === option}
                          onClick={() =>
                            set("budget", draft.budget === option ? "" : option)
                          }
                        >
                          {option}
                        </Pill>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset>
                    <legend className="type-mono pb-3.5 text-[color:var(--color-bg-accent)]">
                      Timeline
                    </legend>
                    <div className="flex flex-wrap gap-2">
                      {ENQUIRY_TIMELINES.map((option) => (
                        <Pill
                          key={option}
                          active={draft.timeline === option}
                          onClick={() =>
                            set(
                              "timeline",
                              draft.timeline === option ? "" : option,
                            )
                          }
                        >
                          {option}
                        </Pill>
                      ))}
                    </div>
                  </fieldset>
                </div>

                <div className="mt-8">
                  <label
                    htmlFor="enquiry-brief"
                    className="type-mono block pb-2.5 text-[color:var(--color-bg-accent)]"
                  >
                    The brief *
                  </label>
                  <textarea
                    ref={briefRef}
                    id="enquiry-brief"
                    name="brief"
                    rows={5}
                    value={draft.brief}
                    onChange={(event) => set("brief", event.target.value)}
                    aria-invalid={!!errors.brief}
                    aria-describedby={
                      errors.brief ? "enquiry-brief-error" : undefined
                    }
                    className={`${field} resize-y leading-relaxed ${
                      errors.brief ? fieldInvalid : fieldRest
                    }`}
                    placeholder="What are you building, who is it for, and what has to be true on launch day?"
                  />
                  <FieldError id="enquiry-brief-error" message={errors.brief} />
                </div>

                <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3">
                  <Button type="submit" size="lg">
                    Send on WhatsApp
                    <ArrowGlyph />
                  </Button>
                  <p className="type-mono text-[color:var(--color-bg-accent)]">
                    Opens WhatsApp with this brief typed out
                  </p>
                </div>
              </form>
            ) : (
              <div className="px-6 pb-12 pt-8 sm:px-10">
                <h2
                  id="enquiry-title"
                  className="type-display text-[clamp(1.9rem,4.2vw,2.9rem)] text-[color:var(--color-fg)]"
                >
                  WhatsApp is open. Press send.
                </h2>
                <p className="type-body mt-4 max-w-[48ch] text-[0.95rem]">
                  The brief is already typed into a chat with {SITE.phone}.
                  WhatsApp sends it from your own number, so the last tap is
                  yours. If nothing opened, the tab was blocked — the link is
                  below.
                </p>

                <div className="mt-8">
                  <p className="type-mono pb-3 text-[color:var(--color-bg-accent)]">
                    The message
                  </p>
                  <pre className="max-h-[34svh] overflow-y-auto whitespace-pre-wrap rounded-xl border border-[color:var(--color-bg-accent)]/70 bg-[color:var(--color-bg)] p-5 font-mono text-[0.8rem] leading-relaxed text-[color:var(--color-accent)]">
                    {message.replace(/\*/g, "")}
                  </pre>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <a
                    href={whatsappHref(message)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="type-mono inline-flex h-11 items-center gap-3 rounded-full bg-[color:var(--color-cta)] px-6 text-[color:var(--color-cta-fg)] transition-opacity duration-300 hover:opacity-85"
                  >
                    Open WhatsApp
                    <ArrowGlyph />
                  </a>
                  <button
                    type="button"
                    onClick={copyBrief}
                    className="type-mono inline-flex h-11 items-center rounded-full border border-[color:var(--color-bg-accent)] px-6 text-[color:var(--color-accent)] transition-colors duration-300 hover:border-[color:var(--color-fg)] hover:text-[color:var(--color-fg)]"
                  >
                    {copied ? "Copied" : "Copy the brief"}
                  </button>
                  <a
                    href={mailtoHref(message)}
                    className="type-mono inline-flex h-11 items-center rounded-full border border-[color:var(--color-bg-accent)] px-6 text-[color:var(--color-accent)] transition-colors duration-300 hover:border-[color:var(--color-fg)] hover:text-[color:var(--color-fg)]"
                  >
                    Send by email instead
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() => setStage("form")}
                  className="type-mono mt-8 border-b border-[color:var(--color-bg-accent)] pb-1.5 text-[color:var(--color-bg-accent)] transition-colors duration-300 hover:border-[color:var(--color-fg)] hover:text-[color:var(--color-fg)]"
                >
                  Edit the brief
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
