export type ServiceGroup =
  | "product"
  | "ai"
  | "commerce"
  | "data"
  | "web"
  | "platform"
  | "ops"
  | "mobile"
  | "support"
  | "infra"
  | "messaging"
  | "delivery";

export interface Service {
  /** Stable key — also used as the React key on the carousel track. */
  id: string;
  name: string;
  /** One line. Says what the client gets, not how it is built. */
  description: string;
  /** Grouping label shown in mono on the card. Encodes the real discipline. */
  group: ServiceGroup;
  /**
   * What actually lands when this discipline ships. Three short items, shown on
   * the back of the card — the front says what it is, the back says what you
   * get, and neither has to carry both.
   */
  deliverables: [string, string, string];
}

export interface Founder {
  id: string;
  name: string;
  role: string;
  /** Raw public path, spaces intact — next/image encodes it correctly. */
  image: string;
  /** Shown when the panel is open. */
  bio: string;
  /** Three things this person owns on a project. */
  owns: string[];
}

export interface Stat {
  value: string;
  label: string;
  note: string;
}

export interface Award {
  id: string;
  /** Where it was won. */
  event: string;
  /** What was placed. */
  placement: string;
  year: string;
  location: string;
  image: string;
  /** Award photography is colour; the site is not. Grayscale by default. */
  desaturate: boolean;
  /** Only the Buildathon win opens a case study. */
  caseStudyId?: string;
}

export interface CaseStudy {
  id: string;
  name: string;
  tagline: string;
  /** Label / value pairs rendered as a spec table in the modal. */
  facts: { label: string; value: string }[];
  body: string[];
  image: string;
  sourceLabel: string;
  sourceUrl: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  /** Attribution is by role and sector — clients are not named. */
  attribution: string;
  /**
   * Stands in for the client's logo on the panel. Clients cannot be named, so
   * the sector takes the wordmark slot instead — short enough to set large.
   */
  sector: string;
  city: string;
}

export interface WorkItem {
  id: string;
  name: string;
  /** Sector or discipline. Set in mono above the name. */
  category: string;
  /** One factual line. What the product is — not what it was worth. */
  description: string;
  /**
   * The live domain, written without a scheme. `null` where there is nothing
   * public to point at: an internal system, or a domain not yet confirmed.
   */
  domain: string | null;
  /** Stands in for the domain when there is none. Required when `domain` is null. */
  note?: string;
  /**
   * The product's own colour, in the words the brief used. Kept as the record
   * of the brief rather than as a token: the poster below carries the colour
   * itself now, so nothing reads this to draw with.
   */
  accent: string;
  /**
   * The product's poster, served from /public/work. Landscape, and cropped to
   * the card's 16/9 frame by `WorkPreview`.
   */
  image: string;
  /**
   * `object-position` for that poster, set only where a centred crop would
   * take something the artwork needs. Eleven of the twelve are 11:6 and give
   * up 1.5% off each side, which is inside every one of their margins.
   */
  imagePosition?: string;
}

/**
 * What the project brief collects before it is handed to WhatsApp. Everything
 * is a string so the form state and the composed message stay in step; the
 * optional answers carry an empty string rather than being absent.
 */
export interface Enquiry {
  name: string;
  email: string;
  /** Names of the disciplines the visitor ticked. May be empty. */
  disciplines: string[];
  budget: string;
  timeline: string;
  brief: string;
}
