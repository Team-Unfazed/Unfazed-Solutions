# SEO — what is done, what is manual, what comes next

Written 17 September 2026, after the technical pass that followed the site
audit. None of this guarantees a ranking. It removes the things that were
stopping the site from being indexed and understood, and lists what only a
person with account access can do.

## 1. Manual actions (cannot be done from this repo)

### Vercel — the `www` host
`www.unfazedsolutions.online` does not resolve at all, so any link that uses it
is dead. This is a domain setting, not code:

1. Vercel → Project → **Settings → Domains** → add `www.unfazedsolutions.online`.
2. When asked, choose **Redirect to `unfazedsolutions.online`** (308).
3. At the DNS provider for `unfazedsolutions.online`, add the record Vercel
   shows — normally `CNAME  www  cname.vercel-dns.com`.
4. Check: `curl -I https://www.unfazedsolutions.online` returns `308` with
   `location: https://unfazedsolutions.online/`.

### Google Search Console
1. Add a **Domain property** for `unfazedsolutions.online` (DNS TXT record).
2. **Sitemaps** → submit `https://unfazedsolutions.online/sitemap.xml`.
3. **URL inspection** → request indexing for `/` and `/work/lumos-ai`.
4. After a week or two, check **Pages → Indexed**. The audit inferred the site
   was not indexed from a brand search; this is where that is confirmed.

Bing Webmaster Tools can import the property from Search Console in one step.

### After deploying
- Run <https://pagespeed.web.dev> on the live URL. The audit could not get real
  Core Web Vitals numbers; this is the measurement of record for LCP/INP/CLS.
- Run <https://search.google.com/test/rich-results> on `/` to confirm the
  JSON-LD parses.
- Paste the URL into a WhatsApp / LinkedIn / X composer to see the new card.

### Off-site (the audit's biggest gap, and not a code problem)
- Google Business Profile, as a **service-area business** — no address shown.
  Use the exact name "Unfazed Solutions".
- LinkedIn company page → then fix the footer link and add it to `sameAs` in
  `lib/schema.ts`.
- Clutch, GoodFirms, DesignRush profiles. Directories hold roughly half of
  every "software company in Mumbai"-type results page.
- Ask the eleven client sites in Selected Work for a "Built by Unfazed
  Solutions" footer link. None of their home pages links back today.

## 2. Content decisions still open
See `CONTENT-TODO.md`. The ones with SEO weight:

- **§1 testimonials** — off the page until real ones exist.
- **§2 two of the three awards** are unconfirmed and are still displayed. They
  are excluded from the structured data. Confirm or remove them.
- **§8 "Building since 2026"** — placeholder year; excluded from structured data.
- **§6 roster** — the case study page now makes the press article one click
  away, and it names a different four people than the team section.

## 3. Future routes — a recommendation, not yet built

The site is one page trying to answer four different searches (SaaS build, AI
agents, automation, "software company in Mumbai"). The pages that rank for
those are dedicated service pages and directories. More routes are the only way
to compete for non-brand searches — but only with real content. A thin page
built to hold a keyword does more harm than no page.

Build each one only when its "needs" column can be filled honestly.

| Route | Purpose | Needs before it is worth building |
| --- | --- | --- |
| `/work/[id]` for the 12 products | Case studies. The route and template already exist (`app/work/[id]/page.tsx` renders anything in `CASE_STUDIES`). | Per product: the problem, what was built, the stack, the timeline, a real screenshot, and — with the client's permission — a result. 300+ words that are not on the card already. |
| `/services/saas-development` | The SaaS build offer | What is in scope, how an engagement runs week to week, stack, which Selected Work items are examples, rough budget bands (the brief form already has them). 800+ words. |
| `/services/ai-agents` | Agents and AI automation | Same shape. Lumos and LeadPilot/Shooks are the natural examples. |
| `/services/automation` | Workflow / WhatsApp automation | Same shape. VahanReady is the example. |
| `/services/web-and-ecommerce` | Sites and stores | Same shape. Five of the twelve products are examples. |
| `/about` | Who the company is | The legal entity name, when it actually started trading (§8), the five people with real profile links, the Buildathon story with its source. |
| `/contact` | A non-WhatsApp path | Email and/or a calendar link as well as the brief form. Enterprise buyers will not open WhatsApp. |
| `/privacy` | Trust and compliance | The brief form collects personal data and hands it to WhatsApp. This needs an actual policy — write it or have it reviewed, do not paste a template. |

Thirteen disciplines should **not** become thirteen pages. Four or five
service pages that each hold several disciplines will be deeper and rank
better than thirteen thin ones.

When a route is added: give it its own `alternates.canonical`, add it to
`app/sitemap.ts`, link to it from the home page in plain `<a>`/`<Link>` markup,
and bump `LAST_MODIFIED`.

## 4. Performance — what was left alone, and why
- **The intro loader still runs (~2.5 s) on every visit to `/`.** The hero is no
  longer hidden behind it in the HTML, which was the SEO problem. Whether to
  skip it for returning visitors is a brand decision; a `sessionStorage` gate in
  `IntroProvider` would do it.
- **Three.js is already loaded with `next/dynamic` and `ssr: false`**, so it was
  never in the server HTML or the critical bundle. Nothing to defer.
- **The services carousel and the GSAP text reveal are not code-split.** Both
  render real text content on the server; moving them behind `ssr: false` would
  take that text out of the HTML to save JavaScript, which is the wrong trade.
- **No Content-Security-Policy yet** — see the note in `next.config.ts`.
