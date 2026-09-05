import type {
  Award,
  CaseStudy,
  Founder,
  Service,
  Stat,
  Testimonial,
  WorkItem,
} from "./types";

export const SITE = {
  name: "Unfazed Solution",
  wordmark: "UNFAZED",
  suffix: "SOLUTION",
  email: "support@unfazedsolutions.online",
  phone: "+91 7700085191",
  /** The same number, digits only with the country code — the shape wa.me wants. */
  whatsapp: "917700085191",
  location: "Mumbai, India",
  /** Shown in the hero meta row. PLACEHOLDER — see CONTENT-TODO.md §8. */
  founded: "2026",
  /** Used by the loader and the footer mark. */
  logo: "/images/Unfazed Logo.png",
  github: "https://github.com/Team-Unfazed",
  instagram: "https://www.instagram.com/unfazedsolutions/",
} as const;

export const NAV_LINKS = [
  { label: "Capabilities", href: "#capabilities" },
  { label: "Record", href: "#record" },
  { label: "Work", href: "#work" },
  { label: "Team", href: "#team" },
  { label: "Contact", href: "#contact" },
] as const;

/* --------------------------------------------------------------------------
   Project brief. The two questions worth asking before a first call, kept as
   ranges so nobody has to commit to a number to start the conversation. Both
   are optional in the form; "Not sure yet" is a real answer.
   -------------------------------------------------------------------------- */

export const ENQUIRY_BUDGETS = [
  "Under ₹1L",
  "₹1L – ₹5L",
  "₹5L – ₹15L",
  "₹15L+",
  "Not sure yet",
] as const;

export const ENQUIRY_TIMELINES = [
  "ASAP",
  "1 – 3 months",
  "3 – 6 months",
  "Exploring",
] as const;

/* --------------------------------------------------------------------------
   The thirteen disciplines, in the order they run along the track. `group` is
   the label on the front of the card and picks its mark; `deliverables` is the
   back — what actually lands when that discipline ships.
   -------------------------------------------------------------------------- */

export const SERVICES: Service[] = [
  {
    id: "saas",
    name: "SaaS apps",
    description: "Multi-tenant products with billing, roles and an audit trail.",
    group: "product",
    deliverables: ["Auth, roles and billing", "Tenant isolation", "Admin and audit log"],
  },
  {
    id: "ai-automation",
    name: "AI automation",
    description: "Pipelines that do the repetitive work and log what they did.",
    group: "ai",
    deliverables: ["The process, mapped", "A pipeline that runs", "A log of every run"],
  },
  {
    id: "ecommerce",
    name: "E-commerce",
    description: "Storefront, checkout and stock that hold up on a sale day.",
    group: "commerce",
    deliverables: ["Catalogue and checkout", "Payments and tax", "Stock that stays in sync"],
  },
  {
    id: "dashboards",
    name: "Dashboards",
    description: "Live operational views your team opens every morning.",
    group: "data",
    deliverables: ["A live data feed", "Charts and alerts", "Views you can share"],
  },
  {
    id: "landing-pages",
    name: "Landing pages",
    description: "One page, one job: turn attention into a booked call.",
    group: "web",
    deliverables: ["Copy and layout", "Forms wired to your inbox", "Analytics and events"],
  },
  {
    id: "apis",
    name: "APIs",
    description: "Versioned, documented, rate-limited. Built for other people's code.",
    group: "platform",
    deliverables: ["Versioned endpoints", "Reference documentation", "Keys and rate limits"],
  },
  {
    id: "workflows",
    name: "Automation workflows",
    description: "Internal ops wired end to end. Nobody copies data by hand.",
    group: "ops",
    deliverables: ["Your systems connected", "Retries and error handling", "An ops runbook"],
  },
  {
    id: "mobile",
    name: "Mobile apps",
    description: "One codebase, both stores, and a release process you can run.",
    group: "mobile",
    deliverables: ["One codebase, both stores", "Store listings and builds", "A release pipeline"],
  },
  {
    id: "chatbots",
    name: "Chatbots",
    description: "Answers drawn from your own docs, with a clean handoff to a human.",
    group: "support",
    deliverables: ["Answers from your own docs", "A clean handoff to a human", "Transcripts to review"],
  },
  {
    id: "agents",
    name: "AI agents",
    description: "Tool-using agents that take a task and come back with the result.",
    group: "ai",
    deliverables: ["Tools and guardrails", "An evaluation set", "A trace for every run"],
  },
  {
    id: "security-seo",
    name: "Security & SEO",
    description: "Hardening, audits and technical SEO before launch, not after it.",
    group: "infra",
    deliverables: ["An audit, and the fixes", "A technical SEO pass", "A pre-launch checklist"],
  },
  {
    id: "whatsapp",
    name: "WhatsApp bots",
    description: "Orders, reminders and support inside the app your customers live in.",
    group: "messaging",
    deliverables: ["A verified business number", "Order and reminder flows", "Support handoff"],
  },
  {
    id: "deployed-sites",
    name: "Deployed websites",
    description: "Design through DNS. Live, monitored, and handed over to you.",
    group: "delivery",
    deliverables: ["Domain and DNS", "Monitoring and backups", "Handover documentation"],
  },
];

/* -------------------------------------------------------------------------- */

export const STATS: Stat[] = [
  {
    value: "70,000+",
    label: "Builders in the field",
    note: "OpenAI Academy × NxtWave Buildathon",
  },
  {
    value: "₹5,00,000",
    label: "Grand prize",
    note: "India AI Impact Summit 2026, New Delhi",
  },
  {
    value: "#1",
    label: "In India",
    note: "Grand Champion, national finale",
  },
];

/**
 * NOTE: the second and third entries below are read off the supplied
 * photographs (the UAi / HawkAI mascot and the finalist trophy). Confirm the
 * exact event names, placements and dates before launch.
 */
export const AWARDS: Award[] = [
  {
    id: "buildathon",
    event: "OpenAI Academy × NxtWave GenAI Buildathon",
    placement: "Grand Champion — 1st of 70,000+",
    year: "2026",
    location: "India AI Impact Summit, New Delhi",
    image: "/images/5 lakh hackathon win.png",
    desaturate: true,
    caseStudyId: "lumos-ai",
  },
  {
    id: "certificate-win",
    event: "Universal AI University — AI challenge",
    placement: "Winning team",
    year: "2026",
    location: "Karjat, Maharashtra",
    image: "/images/Another Hackathon win.jpg",
    desaturate: false,
  },
  {
    id: "mumbai",
    event: "Regional finale",
    placement: "Top 1 in Mumbai",
    year: "2026",
    location: "Mumbai, Maharashtra",
    image: "/images/top 1 in mumbai.jpg",
    desaturate: false,
  },
];

export const CASE_STUDIES: Record<string, CaseStudy> = {
  "lumos-ai": {
    id: "lumos-ai",
    name: "Lumos AI",
    tagline:
      "A real-time wearable that gives blind, deaf and mute users independent communication and awareness of what is around them.",
    facts: [
      { label: "Competition", value: "OpenAI Academy × NxtWave Buildathon" },
      { label: "Stage", value: "National finale, India AI Impact Summit 2026" },
      { label: "Venue", value: "Sushma Swaraj Bhavan, New Delhi" },
      { label: "Field", value: "70,000+ participants" },
      { label: "Result", value: "Grand Champion — ₹5,00,000" },
      { label: "Team", value: "Unfazed — Lumos AI" },
    ],
    body: [
      "Lumos AI is a wearable assistive system built for people who cannot see, hear or speak. It reads the wearer's surroundings in real time and turns them into a channel that person can actually use — so a conversation, a street crossing or a room full of strangers stops depending on someone else being there to interpret it.",
      "It was built by team Unfazed out of Pillai HOC College of Engineering and Technology, and took the top prize at the national finale of the OpenAI Academy × NxtWave Buildathon — India's largest GenAI student challenge — at the India AI Impact Summit 2026 in New Delhi.",
      "The judging field was over seventy thousand participants. One team walked out with ₹5,00,000 and the Grand Champion title.",
    ],
    image: "/images/5 lakh hackathon win.png",
    sourceLabel: "Read the coverage on ET Edge Insights",
    sourceUrl:
      "https://etedge-insights.com/trending/openai-academy-x-nxtwave-buildathon-maharashtra-team-wins-indias-largest-genai-student-challenge-at-india-ai-impact-summit-2026/",
  },
};

/* --------------------------------------------------------------------------
   Selected work. Twelve products that are built, deployed and — apart from the
   one internal system — reachable from this page.

   Descriptions are the client's own framing of what the product does. Nothing
   here claims a result, a figure or a rating that is not on the product itself.

   `domain` is null only for Clinic Queue, which has no public URL by design.
   Hosts are stored exactly as they resolve — three of them need their `www.`
   subdomain — and the card strips that prefix for display only.
   -------------------------------------------------------------------------- */

export const SELECTED_WORK: WorkItem[] = [
  {
    id: "shoogle",
    name: "Shoogle",
    category: "AI website builder",
    description:
      "Turn your Instagram into a premium, mobile-first website in seconds. AI writes the copy and ships it live.",
    domain: "shoogle.in",
    accent: "pink-to-orange gradient",
    image: "/work/shoogle.png",
    imagePosition: "50% 100%",
  },
  {
    id: "bencher",
    name: "Bencher",
    category: "Campus marketplace",
    description:
      "Digital campus space — connect with your college community. By students, for students.",
    domain: "bencher.in",
    accent: "teal",
    image: "/work/bencher.png",
  },
  {
    id: "pranashakti",
    name: "PranaShakti Clinic",
    category: "Healthcare",
    description:
      "Homeopathic care with online consults, appointments, and medicine delivery.",
    domain: "pranashakticlinic.com",
    accent: "rose",
    image: "/work/pranashakti-clinic.png",
  },
  {
    id: "clinic-queue",
    name: "Clinic Queue",
    category: "SaaS · Ops",
    description:
      "Real-time token orchestration — token boards, staff workflows, calmer waits.",
    domain: null,
    note: "Internal tool",
    accent: "cyan",
    image: "/work/clinic-queue.png",
  },
  {
    id: "kr-moondra",
    name: "KR Moondra & Co.",
    category: "Brand site",
    description:
      "Chartered accountancy firm — a trust-first brand site for a 30-year-old practice. Est. 1994, 30+ years, 500+ clients.",
    domain: "www.krmoondra.com",
    accent: "amber",
    image: "/work/kr-moondra.png",
  },
  {
    id: "leadpilot",
    name: "LeadPilot",
    category: "AI · SaaS",
    description:
      "AI sales rep — discovers ICP on LinkedIn, qualifies, and opens conversations. Replies land on WhatsApp.",
    domain: "linkdnoutreach.vercel.app",
    accent: "indigo",
    image: "/work/leadpilot.png",
  },
  {
    id: "vahanready",
    name: "VahanReady",
    category: "Service / WhatsApp",
    description:
      "Hassle-free Indian driving license assistance — learner's, permanent, renewals and IDP handled over WhatsApp.",
    domain: "vahanready.in",
    accent: "orange",
    image: "/work/vahanready.png",
  },
  {
    id: "shooks",
    name: "Shooks",
    category: "AI · SaaS",
    description:
      "AI-native carousel engine — a topic in, an 8-slide Instagram/LinkedIn carousel out.",
    domain: "shooks.online",
    accent: "purple-to-orange gradient",
    image: "/work/shooks.png",
  },
  {
    id: "serendrop",
    name: "Serendrop",
    category: "E-commerce",
    description:
      "A curated Shopify storefront for lifestyle and everyday essentials — built for calm browsing and smooth checkout.",
    domain: "serendrop.com",
    accent: "teal/pink/orange product swatches",
    image: "/work/serendrop.png",
  },
  {
    id: "signagewale",
    name: "Signagewale",
    category: "Brand site",
    description:
      "Premium custom signage boards — stainless steel, acrylic and LED glow sign fabrication for brands and storefronts.",
    domain: "www.signagewale.com",
    accent: "teal/purple/orange",
    image: "/work/signagewale.png",
  },
  {
    id: "mumbai-darshan",
    name: "Mumbai Darshan",
    category: "Travel / Booking",
    description:
      "Explore Mumbai's top attractions and heritage landmarks with AC bus tours, meals and entry tickets included.",
    domain: "mumbaidarshan.com",
    accent: "blue",
    image: "/work/mumbai-darshan.png",
  },
  {
    id: "ns-wellness",
    name: "NS Wellness",
    category: "Healthcare / Booking",
    description:
      "Massage therapy center in Nerul, Navi Mumbai — Swedish, deep tissue, sciatica and reflexology treatments with online booking. 5.0 rating, 31 reviews.",
    domain: "www.nswellness.in",
    accent: "green",
    image: "/work/ns-wellness.png",
  },
];

/* --------------------------------------------------------------------------
   Founders, in the exact display order requested.
   -------------------------------------------------------------------------- */

export const FOUNDERS: Founder[] = [
  {
    id: "devashish-sharma",
    name: "Devashish Sharma",
    role: "AI Automations",
    image: "/images/Devashish Sharma.png",
    bio: "Devashish builds the automation layer — the pipelines that take a repetitive process apart and put it back together without a person in the middle. He works backwards from the task a client is tired of doing, then makes it run on its own and leave a record behind.",
    owns: ["Automation pipelines", "Model integration", "Process mapping"],
  },
  {
    id: "sunny-mishra",
    name: "Sunny Mishra",
    role: "Cloud Engineer",
    image: "/images/Sunny Mishra.jpg",
    bio: "Sunny owns where things run. Provisioning, networking, storage and cost — the parts nobody sees until they break. He sizes infrastructure for the traffic a product will actually get, not the traffic it hopes for.",
    owns: ["Cloud architecture", "Networking & storage", "Cost control"],
  },
  {
    id: "pranay-pelapkar",
    name: "Pranay Pelapkar",
    role: "Agent Tech AI",
    image: "/images/Pranay Pelapkar.jpg",
    bio: "Pranay works on agents — systems that are given a goal, pick their own tools, and come back with a result. He spends most of his time on the unglamorous half of that: what the agent is allowed to touch, and what happens when it gets something wrong.",
    owns: ["Agent architecture", "Tool design & guardrails", "Evaluation"],
  },
  {
    id: "aryan-singh",
    name: "Aryan Singh",
    role: "Full Stack Engineer",
    image: "/images/Aryan Singh.jpg",
    bio: "Aryan takes a product from an empty repository to something a user can log into. Schema, API, interface and the seams between them — he led the team through the Buildathon finale on exactly that range.",
    owns: ["Product engineering", "APIs & data models", "Interface build"],
  },
  {
    id: "yash-tambe",
    name: "Yash Tambe",
    role: "DevOps Engineer",
    image: "/images/Yash Tambe.png",
    bio: "Yash owns the path from a merged commit to a live URL. Pipelines, environments, monitoring and rollbacks — so that shipping on a Friday is a decision, not a gamble.",
    owns: ["CI/CD", "Environments & releases", "Monitoring"],
  },
];

/* --------------------------------------------------------------------------
   PLACEHOLDER CONTENT — replace before launch.
   Clients are described by sector and role rather than named. Swap in real,
   attributed quotes once you have written permission to use them.
   -------------------------------------------------------------------------- */

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    quote:
      "We had been quoted six weeks by two other studios. Unfazed scoped it down to what we actually needed, built it, and had us live in nineteen days.",
    attribution: "Founder",
    sector: "D2C skincare",
    city: "Mumbai",
  },
  {
    id: "t2",
    quote:
      "The handover is the part that usually goes wrong. We got documentation, environment access and a walkthrough, and our own team has shipped to it since without calling them once.",
    attribution: "Head of Engineering",
    sector: "Logistics SaaS",
    city: "Pune",
  },
  {
    id: "t3",
    quote:
      "They pushed back on half our feature list in the first call. That was the moment we knew we had the right team.",
    attribution: "Product Lead",
    sector: "Fintech",
    city: "Bengaluru",
  },
  {
    id: "t4",
    quote:
      "Our support inbox dropped by roughly seventy percent in the first month. The bot answers from our own documentation, and it escalates when it should.",
    attribution: "Operations Director",
    sector: "Ed-tech",
    city: "Delhi NCR",
  },
];
