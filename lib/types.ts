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
