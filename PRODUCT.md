# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary: a parent at the kitchen table**, printing a page of math practice for a child in grades 1–6 (ages 6–12). Often in a hurry — the two minutes before school is a real scenario. They pick a worksheet, adjust difficulty to what their child is working on right now, and print.

**The child (6–12) is the recipient, not the operator.** The parent drives the screen; the child is nearby and sees it. The screen must feel warm and unintimidating to a child looking over a shoulder, but it is designed for adult hands — not for a child to navigate alone. **The child's real surface is the printed page.**

**Teachers and tutors are welcome but not the design target.** A teacher preparing a lesson or a tutor needing one more page of practice is a supported, happy accident. The set number is a seed, so a parent can send a friend the page they printed, and a Copies count prints several *different* sheets (a sibling gets their own). Classroom machinery beyond that — batches of identical copies, class rosters — is explicitly out of scope. An answer key is in scope, because it serves the parent checking a sheet as much as a teacher.

## Product Purpose

Generate free, printable, randomized math worksheets for grades 1–6, entirely in the browser. Every sheet is re-randomized on open or regenerate, so a child gets fresh practice instead of memorising one page. Success is a printed page a child works through with a pencil, and a grown-up who checks it afterwards.

The product exists because the alternative was ad-filled worksheet sites or a subscription. It was built by a parent for their own daughters.

## Positioning

**Paper instead of an app, on purpose, with the argument written down.** Most children's math apps reward every tap with instant feedback — a chime, a star, an animation. This product's claim is that instant feedback teaches children to guess quickly and wait for a verdict, while a printed sheet forces the child to commit an answer in pencil, judge it themselves, and receive feedback later from a grown-up. That pause is the mechanism.

The claim is argued, not asserted: the About page cites ten real studies (Butler/Karpicke/Roediger 2007, Fyfe & Rittle-Johnson 2017, Bjork & Bjork 2011, Kapur 2014, Kluger & DeNisi 1996, Hattie & Timperley 2007, Mueller & Dweck 1998, Van der Weel & van der Meer 2024, among others) and explicitly concedes that the evidence is not one-sided. **A neighbouring product could copy the worksheets; it could not truthfully copy this argument or the willingness to concede against itself.**

The second mechanism is the **notebook grid**: worksheets are laid out on squared paper where every digit snaps to a cell, so carry columns line up. This targets the actual failure mode of early column arithmetic — misalignment, not arithmetic.

## Operating Context

The real sequence, and the one the design serves:

1. An adult opens the site on a laptop or phone, often under time pressure.
2. They pick a worksheet and adjust difficulty (number range, digits, columns, layout).
3. They print — to Letter **or A4**, depending on country. Seven locales are served (en, fr, es, de, it, ru, zh); five of them are A4 countries.
4. The child works the page in pencil, away from the screen. This is the longest phase and the one with no interface at all.
5. A grown-up checks the page later and talks it through — commenting on the method, not the child. The About page gives explicit guidance on how to do this well.

Settings are remembered per device so step 2 is shorter next time. Nothing is uploaded; there is no account.

## Capabilities and Constraints

- React 19 + Vite SPA. Worksheets are generated **client-side**; no backend, no account, no upload, no cost, no ads.
- Ten worksheets: multiplication tables, addition & subtraction, column addition, column multiplication, long division, comparison, rounding, number patterns, order of operations, and an interactive Equation Explorer (the one screen-only, non-printable surface).
- Per-worksheet settings persist to localStorage under the legacy key `mathsheets`, kept deliberately across the rename.
- **Print is the primary output.** Sheets are promised to fit one Letter or A4 page. Paper size must follow the user's locale/printer, not a hard-coded default.
- Seven locales, English at the root and the rest under a path prefix. Message files must keep identical key sets. Long German and French labels are a real layout constraint.
- Heavy prerendered SEO surface: per-route HTML, Markdown twins, `llms.txt`, `llms-full.txt`, `sitemap.xml`, per-page OG cards. Crawlable copy must survive hydration. **This structure is load-bearing and must not be broken by visual work.**
- GA4 via Consent Mode v2, denied by default; no cookie banner.
- Numbers render as plain digits (`String(n)`), never `toLocaleString()`.
- **Undecided:** whether the answer key prints as a separate page, a second column, or a toggle. Scope is confirmed; the form is not.

## Brand Commitments

**Binding:**
- Name **Super Awesome Math**, domain **superawesomemath.com**. Operated by **Superposition Labs Inc.** Licensed **CC BY-NC 4.0**. Formerly "MathSheets" (`BRAND_ALT`).
- **The About page's voice**: plain, honest, specific, and willing to concede against its own thesis ("The evidence is not one-sided"). Never breezy, never salesy, never overclaiming. This voice is an asset and applies to all product copy.
- **The notebook grid** (`useNotebookGrid()`, `--nb-sq`): the squared-paper system that snaps digits into cells and swaps cell size between screen and print. Keep it and build outward from it.

**Explicitly not binding — free to replace:** the `#2563eb` blue and the Tabler ruler wordmark icon. Both were confirmed as incumbent, not settled identity.

## Evidence on Hand

- Ten real, citable studies with working links, already written into `src/pages.js`. Genuine and load-bearing for the positioning.
- The product's own origin story (a parent building it for their daughters) — true and usable.
- Committed 1200×630 OG cards per page under `public/og/`.
- **Absences future work must not fabricate:** no testimonials, no user counts, no download or print statistics, no school adoptions, no press, no endorsements, no pricing. None of these exist and none may be invented.

## Product Principles

1. **The paper is the product; the screen is its configurator.** Design decisions are settled by what improves the printed page a child holds, not what improves the screen.
2. **Defend the pause.** Nothing in the product should supply the instant feedback the About page argues against — no chimes, no auto-marking on screen, no stars. The Equation Explorer is the deliberate, bounded exception.
3. **Two minutes to paper.** The parent's path from landing to printed sheet stays short enough to complete before school.
4. **Concede honestly.** Copy states what is true, including what is uncertain or unavailable. No invented proof.
5. **Free and unobstructed.** No account, no ads, no upload, no dark patterns, no cost.

## Accessibility & Inclusion

- The screen is operated by adults, but read by children over a shoulder: legibility outranks density.
- Seven locales including Russian and Chinese; long compound German labels must not break layout.
- WCAG AA is the working floor — the current build fails it in one specific pairing (muted grey on the tinted page ground, 4.35:1) and carries sub-44px touch targets, both of which are defects to fix rather than accepted constraints.
- Full `prefers-reduced-motion` coverage already exists and must be preserved.
- Printed output must stay legible in grayscale and on a cheap inkjet: colour may never be the sole carrier of meaning on paper.
