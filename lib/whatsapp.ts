import { SITE } from "./constants";
import type { Enquiry } from "./types";

/** An empty brief, and the shape the form resets to. */
export const EMPTY_ENQUIRY: Enquiry = {
  name: "",
  email: "",
  disciplines: [],
  budget: "",
  timeline: "",
  brief: "",
};

/**
 * The brief as WhatsApp will show it. Single asterisks are WhatsApp's own bold
 * syntax, not Markdown — they render as bold in the chat and are typed exactly
 * as written here. Optional answers are dropped rather than sent empty, so a
 * three-field brief reads as three lines instead of six.
 */
export function composeEnquiry(enquiry: Enquiry): string {
  const lines: string[] = [
    `*New project enquiry* — unfazedsolutions.online`,
    "",
    `*Name:* ${enquiry.name.trim()}`,
  ];

  if (enquiry.email.trim()) lines.push(`*Email:* ${enquiry.email.trim()}`);
  if (enquiry.disciplines.length)
    lines.push(`*Needs:* ${enquiry.disciplines.join(", ")}`);
  if (enquiry.budget) lines.push(`*Budget:* ${enquiry.budget}`);
  if (enquiry.timeline) lines.push(`*Timeline:* ${enquiry.timeline}`);

  lines.push("", "*Brief:*", enquiry.brief.trim());

  return lines.join("\n");
}

/**
 * WhatsApp's click-to-chat link. `wa.me` opens the app on a phone and
 * web.whatsapp.com on a desktop, with the message already typed into the chat
 * with the studio's number.
 */
export function whatsappHref(message: string): string {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}

/** Same brief, for the people who would rather send it by email. */
export function mailtoHref(message: string): string {
  const body = message.replace(/\*/g, "");
  return `mailto:${SITE.email}?subject=${encodeURIComponent(
    "New project enquiry",
  )}&body=${encodeURIComponent(body)}`;
}

export type EnquiryErrors = Partial<Record<"name" | "email" | "brief", string>>;

/** Only two answers are actually required; the rest sharpen the first reply. */
export function validateEnquiry(enquiry: Enquiry): EnquiryErrors {
  const errors: EnquiryErrors = {};

  if (!enquiry.name.trim()) errors.name = "Tell us who you are.";

  const email = enquiry.email.trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
    errors.email = "That address does not look right.";

  const brief = enquiry.brief.trim();
  if (!brief) errors.brief = "Tell us what needs building.";
  else if (brief.length < 12) errors.brief = "A little more detail, please.";

  return errors;
}
