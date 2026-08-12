# Content to replace before launch

Everything below is in `lib/constants.ts` unless stated otherwise.

## 1. Testimonials — written by me, not by clients

`TESTIMONIALS` contains four quotes I wrote. They are attributed by role and
sector ("Founder — D2C skincare brand, Mumbai") rather than to named people, so
nothing on the page claims a specific person said something they did not. They
are still invented and must be replaced with real quotes you have written
permission to publish, or the section should be cut.

The section headline ("Ask the people who paid for it.") and
the paragraph beside it are also mine — both live in
`components/testimonials/TestimonialsSection.tsx`, not in `constants.ts`. The
paragraph makes process claims (scope agreed up front, something running every
week, documentation and a walkthrough at handover); confirm each one is true of
how you actually work before this goes live.

Each panel sets `sector` where a client logo would normally go. If any client
ever agrees to be named, that slot takes their wordmark and the copy above
needs revisiting.

## 2. Two of the three awards

`AWARDS` — the first entry (OpenAI Academy × NxtWave Buildathon) is sourced from
press coverage and is accurate. The other two are read off the photographs you
supplied and need confirming:

| Entry | What I wrote | What to check |
| --- | --- | --- |
| `certificate-win` | "Universal AI University — AI challenge", Karjat | Read from the UAi / HawkAI mascot and the certificates in the photo. Confirm the real event name, the placement, and the date. |
| `mumbai` | "Regional finale — Top 1 in Mumbai" | The photo shows a *finalist* trophy. Confirm the event name and whether the result was first place or finalist. |

## 3. Founder biographies

`FOUNDERS[].bio` and `FOUNDERS[].owns` describe what each person does, derived
from the role you gave me. No years of experience, employers or credentials are
claimed. Have each founder read their own paragraph and correct it.

## 4. Social links

`components/footer/Footer.tsx` — the LinkedIn, GitHub and Instagram entries
point at `#`. Add the real URLs or remove the rows.

## 5. Hero copy

`components/hero/HeroSection.tsx` — the standfirst ("Deadlines move. Scope
grows. Models change. The build ships anyway.") is written by me. The three
figures along the bottom are not: "70,000+ beaten" and "₹5,00,000 won" both come
from the press coverage and are accurate, and "13 disciplines" is counted from
`SERVICES`, so it stays correct on its own if you add or drop one.

## 5a. The four band images are no longer used

`public/images/band-ai.png`, `band-products.png`, `band-web.png`,
`band-platform.png`.

Nothing references these any more — the capabilities section now shows the
thirteen disciplines directly rather than four grouped cards, so the artwork
came out with the grouping. You can delete all four files.

Worth knowing if you ever think about putting them back: they were the mockups
you supplied rather than Unfazed's own work, and `band-ai.png` still carries
another studio's name and domain in the artwork ("Nexora Studio",
"nexorastudio.com"). On a page that also makes real, checkable claims about a
national competition win, a visitor has every reason to read an image like that
as your project. Use screenshots of your own work, or nothing.

## 6. Team roster discrepancy — worth a decision

Press coverage of the Buildathon win lists the team as **Aryan Singh (lead),
Pranay Pelapkar, Yash Tambe and Krish Patil**. The founders section on this
site lists **Devashish Sharma, Sunny Mishra, Pranay Pelapkar, Aryan Singh and
Yash Tambe**.

The site does not name the competition roster anywhere, so there is no conflict
on the page as it stands. If you want to name who competed, add it explicitly —
otherwise a visitor who reads the linked article may notice the difference.

## 7. Domain

`app/layout.tsx` — `metadataBase` is set to `https://unfazedsolution.com`. Point
it at the real domain before deploying, or Open Graph URLs will be wrong.

## 8. "Building since 2026"

`SITE.founded` in `lib/constants.ts`, shown at the top right of the hero.

I took 2026 from the competition dates, which is the only year anything on the
site is anchored to. If the studio started trading earlier, this understates it;
if it has not started trading yet, it overstates it. Set the real year or drop
the line.
