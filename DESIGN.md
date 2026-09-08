---
name: Super Awesome Math
description: The site is the exercise book it prints — white chrome on a lightly tinted page, squared paper and real ink where the worksheet is.
colors:
  cover: "#f5f5f0"
  cover-deep: "#ffffff"
  cover-raised: "#ffffff"
  cover-line: "rgba(26, 31, 36, 0.16)"
  cover-line-strong: "rgba(26, 31, 36, 0.34)"
  cover-wash: "rgba(26, 31, 36, 0.055)"
  cover-wash-strong: "rgba(26, 31, 36, 0.10)"
  on-cover: "#1a1f24"
  on-cover-muted: "#5a6570"
  mark: "#d0452f"
  mark-deep: "#ab331f"
  paper: "#ffffff"
  paper-edge: "#e6e4dd"
  paper-hover: "#f6f6f2"
  edge: "rgba(26, 31, 36, 0.20)"
  edge-strong: "rgba(26, 31, 36, 0.34)"
  ink: "#1a1f24"
  graphite: "#5a6570"
  control-ink: "#23282e"
  control-ink-deep: "#14181c"
  border: "#e0dcd1"
  border-dark: "#7c7770"
  border-light: "#eeebe2"
  border-worksheet: "#dcd7cb"
  ink-multiply: "#2d6cb5"
  ink-addsub: "#2e7d5b"
  ink-coladd: "#17706b"
  ink-colmul: "#8a4b2a"
  ink-coldiv: "#a83a5b"
  ink-compare: "#9a6212"
  ink-rounding: "#8f3b6e"
  ink-patterns: "#5b4a91"
  ink-eqexplore: "#1f7a8c"
  ruling-screen: "rgba(148, 163, 184, 0.28)"
  ruling-print: "rgba(107, 114, 128, 0.42)"
typography:
  display:
    fontFamily: "Archivo, Inter, -apple-system, sans-serif"
    fontSize: "clamp(20px, 2.6vw, 30px)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Archivo, Inter, -apple-system, sans-serif"
    fontSize: "25px"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Archivo, Inter, -apple-system, sans-serif"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  subtitle:
    fontFamily: "Archivo, Inter, -apple-system, sans-serif"
    fontSize: "16px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  lead:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.65
  ui:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.3
  label:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    letterSpacing: "0.08em"
  figure:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "16px"
    fontWeight: 500
    fontFeature: "tabular-nums"
rounded:
  paper: "2px"
  cover: "3px"
  tab: "2px"
spacing:
  half-sq: "13px"
  sq: "26px"
  sq-lg: "31px"
  sq-xl: "42px"
  sq-2x: "52px"
components:
  button-primary:
    backgroundColor: "{colors.mark}"
    textColor: "#ffffff"
    typography: "{typography.ui}"
    rounded: "{rounded.paper}"
    padding: "10px 20px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.mark-deep}"
    textColor: "#ffffff"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.ui}"
    rounded: "{rounded.paper}"
    padding: "10px 20px"
    height: "44px"
  button-toggle:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.ui}"
    rounded: "{rounded.cover}"
    padding: "7px 14px"
  button-toggle-active:
    backgroundColor: "{colors.control-ink}"
    textColor: "#ffffff"
  catalog-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.subtitle}"
    rounded: "{rounded.paper}"
    padding: "0"
  sidebar-row:
    backgroundColor: "transparent"
    textColor: "{colors.on-cover}"
    typography: "{typography.ui}"
    rounded: "{rounded.cover}"
    padding: "9px 12px"
    height: "44px"
  sidebar-row-hover:
    backgroundColor: "{colors.cover-wash}"
    textColor: "{colors.ink}"
  sidebar-row-active:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
  chip-mobile:
    backgroundColor: "{colors.cover-wash}"
    textColor: "{colors.on-cover}"
    typography: "{typography.ui}"
    rounded: "{rounded.cover}"
    padding: "8px 14px"
    height: "44px"
  settings-panel:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.cover}"
    padding: "18px 24px 20px"
  input-number:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.cover}"
    padding: "7px 10px"
    width: "72px"
  worksheet-sheet:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.paper}"
    padding: "32px 36px"
  brand-label:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.paper}"
    padding: "5px 14px"
    height: "44px"
---

# Design System: Super Awesome Math

## Overview

**Creative North Star: "The Exercise Book"**

The site *is* the exercise book it prints. The chrome is white — the site header, the catalog, every panel and the sheet — and a quiet page tint (`#f5f5f0`) shows through behind it in the worksheet area and under the footer. Two coloured board stocks were tried before this, an ink-navy field and then a cream one, and both were rejected by the maintainer: the navy for being dark, the cream for reading as aged paper. What ships is the arrangement the product had before either. The landing view is white end to end; the tint is what says "you are inside a sheet now".

**The Governing Rule.** Cover carries the interface; paper is reserved for where real paper is. A surface earns the sheet stock only if it is a sheet, a leaf, or a control panel that configures a sheet. Chrome, catalog ground, headers, footers and empty states stay on the cover.

**How the rule is carried now.** The page tint and the white chrome are **1.09:1** apart — no separation at all by tone. **EDGE** and **LIFT** are therefore the whole system: a 1px ink hairline (`--edge`, 1.51:1 on white) around every plate plus a tight, short-throw shadow under it. A plate that ships without both does not read as a plate; it disappears. Tone's only remaining job is to say which side of the boundary you are on — white means chrome, tint means you are looking at the page a sheet sits on.

Mode is Operate: a hurried adult picks a worksheet, adjusts it, and prints. Density is moderate and legibility outranks it — the screen is read over a shoulder by a six-year-old. The world refuses the pastel kids-edu register: no rounded illustration icons in tinted squares, no chimes, no stars, no gradient candy. It also refuses a dark ground: this is stationery, and stationery is light.

**Key Characteristics:**
- One light board field, one warm mark colour, one paper stock, held apart by tone + edge + lift.
- Paper surfaces sit on the board as square-cut plates with a hairline keyline plus a tight shadow — stapled stock, not floating glass.
- Nine subject inks, carried as a 4–5px edge tab, as a card head band, and as the tint on the dense-context icons — never as text.
- Type is Archivo for cover/display, Inter for UI and prose, JetBrains Mono for every figure.
- The notebook square (`--sq: 26px`) is the shared module between the sheet and the chrome that configures it.
- Motion is one authored moment: the set stamp coming down.

## Colors

One light ground in three tones, one warm mark, and a small residual control accent. Everything structural is warm-neutral; the only saturated colour that reaches a wide area is the teacher's marking pencil, and it is spent almost entirely on the act of making paper.

### Primary
- **Board Stock** (`cover`): the body ground and the ground of every chrome surface — catalog field, worksheet chrome, footer, sidebar.
- **Scored Board** (`cover-deep`): the site header band only, one step down from the field, ruled off by a 2px `cover-line` — the cover scored above its first sheet.
- **Raised Board** (`cover-raised`): declared for lifted cover surfaces; used sparingly.

### Secondary
- **Marking Red** (`mark`): the one warm colour. Spent on exactly four things — the Print button, the global focus ring, the set-stamp animation, and text selection. `mark-deep` carries prose links and the primary-button hover.

### Tertiary — the nine subject inks
Each worksheet carries its own ink (`ink-multiply` … `ink-eqexplore`), assigned in `src/worksheets.js`. They appear as geometry and as icon tint: the 5px band across the head of a catalog card, the 4px tab on a resume card, and the stroke colour of the sidebar/chip icon (19px) and the worksheet-title icon (22px). They are never used as text colour, never as a fill, and never as the only signal of which sheet is selected — the active row also inverts to paper and bolds its label.

### Neutral
- **Sheet Paper** (`paper`): every real sheet — worksheet, settings panel, static prose plate, language menu, catalog card, brand label, the active sidebar row.
- **Paper Edge / Paper Hover** (`paper-edge`, `paper-hover`): rules inside paper and hover fills on paper rows.
- **Ink** (`ink` / `on-cover`, one value): all primary text, on paper (16.17:1) and on the board (12.86:1 on the field, 11.58:1 in the header band). One ink for both grounds is what the light ground bought.
- **Graphite** (`graphite`): secondary text on paper — card descriptions, setting labels, problem numbers (5.79:1).
- **Faded Board** (`on-cover-muted`): secondary text on the board field — footer, worksheet subtitle (4.89:1). It measures 4.40:1 on `cover-deep`, so it does not belong in the header band.
- **Board Lines** (`cover-line`, `cover-line-strong`): the only borders permitted on the board — ink at 16% and 34%.
- **Board Washes** (`cover-wash`, `cover-wash-strong`): hover and raised states on the board, tinted from the ink of the ground rather than from white, so an interactive board surface stays on the same stock. Ink on `cover-wash-strong` still measures 10.58:1.
- **Paper Edge Hairlines** (`edge`, `edge-strong`): the ring that separates a sheet from the board. Not decorative — this is half the governing rule.
- **Control Ink** (`control-ink`, `--color-primary` `#23282e`): the segmented-toggle active fill, `accent-color` on checkbox and slider, the input focus border, and the current locale in the language menu. White on it measures 14.6:1. It is deliberately a neutral, not a second hue: the marking red stays reserved for Print, so the system keeps exactly one warm mark. The navy that held this role in the dark-ground build is gone.
- **Border family** (`border`, `border-dark`, `border-light`, `border-worksheet`): warm greys that belong to paper. `border-dark` is the writable rule and the input stroke; `border-worksheet` is the sheet header rule.
- **Ruling** (`ruling-screen`, `ruling-print`): the squared-paper grid lines, darkened for print because inkjets lose the screen value.

### Named Rules
**The Plate Rule.** Every white plate on the page tint states its own `color: var(--color-text)` *and* carry `box-shadow: 0 0 0 1px var(--edge)` plus `--shadow-sm`/`--shadow-md`. A paper surface without its edge and lift is invisible.

**The One Warm Mark Rule.** Marking red is the product's single warm colour and it belongs to the act of making paper. Do not use it for chips, badges, headings, dividers, or decoration.

**The Grayscale Rule.** On paper, colour is never the sole carrier of meaning. Every printed distinction survives a grayscale inkjet: states are named in words, and the sheet's marks are ink-black, not tinted.

**The Ink Discipline Rule.** No decorative grey on paper. Print overrides push every screen grey to a real ink value — field labels `#333`, rules `#333`, problem numbers `#555`, the stamp `#111` — so every printed mark carries information.

## Typography

**Display Font:** Archivo (700/800) with Inter fallback
**Body / UI Font:** Inter (400/500/600/700)
**Figure Font:** JetBrains Mono (400/500/600)

**Character:** A heavy grotesk for anything that names something (wordmark, hero, worksheet titles, card labels, section headings), a neutral workhorse for prose and controls, and a monospace with tabular figures for every number a child will read or a grown-up will check. Display type is tightly tracked (−0.01em to −0.02em); prose is untracked.

### Hierarchy
- **Display** (Archivo 700, `clamp(20px, 2.6vw, 30px)`, 1.15, −0.02em): the catalog hero sentence, balanced and capped at 32ch. Renders at 30px/34.5px at 1440.
- **Headline** (Archivo 800, 25px/27.5px, −0.02em): the worksheet page `h1`, on the board, with its subject icon.
- **Title** (Archivo 700, 22px/26.4px, −0.015em): static-page `h2`, with more space above (`calc(var(--sq) * 1.6)`) than below (`--half-sq`).
- **Subtitle** (Archivo 700, 16px, −0.01em): catalog card labels and the resume-card label; the site brand is Archivo 800 17px/−0.015em (15px on mobile).
- **Lead** (Inter 400, 19px/28.5px): the opening paragraph of a static page.
- **Body** (Inter 400, 16px/26.4px): prose, constrained by `--measure: 608px` — an absolute measure, roughly 68 characters, not `ch`, so headings and body share one left edge.
- **UI** (Inter 500–700, 13–14px, 1.25–1.3): nav links, setting labels, toggles, buttons, card descriptions, sheet title (Inter 700 20px).
- **Label** (Inter 600, 11px, 0.08em, uppercase): the sheet's ruled field captions (NAME / DATE / SET NO.) — form-field captions on a document, not editorial eyebrows.
- **Figure** (JetBrains Mono 500, 16px screen / 15px print): every problem, digit, stamp and answer.
- **Print sizes** (answer key only, in points): title 15pt Archivo 800; answer 12pt mono; meta 11pt; stamp 10pt; item number 9pt; print footer 9pt.

### Named Rules
**The Tabular Rule.** Every number a reader compares or aligns is `font-variant-numeric: tabular-nums` in JetBrains Mono: problem values, the set stamp, problem counters, answer-key numbers and values. Digits never render through `toLocaleString()`.

**The Named Face Rule.** Three loaded families and no fourth. No system display face, and no icon font — every icon is inline stroked SVG.

## Layout

**The module.** `--sq: 26px` and `--half-sq: 13px` are the notebook square, matching `SCREEN_SQUARE = 26` in `useNotebookGrid.js`, so the chrome measures in the same unit as the sheet it configures.

Where the module actually governs: catalog grid gap (`--sq`), catalog vertical padding (`1.5sq` / `2sq`), hero and resume-card margins, static-page heading rhythm (`1.6sq` above / `half-sq` below), footer padding, the worksheet-details plate, and the site header's vertical padding (`--half-sq`).

Where it does not: component-internal padding is a conventional 8/10/12/16/20/24px scale (buttons `10px 20px`, settings body `18px 24px 20px`, sheet `32px 36px`, nav `8px 12px`). The interface sits *on* the square at the block level and *off* it inside components. Record that honestly rather than pretending the ruling is total.

**Containers.** Catalog grid max 940px, `repeat(auto-fill, minmax(268px, 1fr))` (296px cards at 1440); static prose plate is a centred 856px paper band with the board showing down both margins; worksheet content max 960px; prose measure 608px.

**Responsive.** One breakpoint at 768/769px, plus 380px for the single-column catalog.
- ≥769px with a sheet active: the app is a fixed-height two-column split — a 220px catalog sidebar (compact rows on the board, separated by a 1px `border` rule) and a scrolling worksheet column. Settings flow two per row (`flex: 1 1 calc(50% - 16px)`), and a control that cannot shrink takes a full row instead.
- ≤768px: catalog becomes a horizontally scrolling, snap-aligned chip rail under the header; the landing grid becomes two columns at 12px gap (one column ≤380px); settings stack, segmented groups go full width and never wrap, numeric inputs go 16px to stop iOS zoom.

**The 44px Rule.** Every interactive element declares `min-height: 44px` — nav links, footer links, brand label, back button, language button and menu items, catalog rows and chips, buttons, checkbox rows, sliders, fold summaries.

## Elevation & Depth

Stapled stock, not floating glass. Depth is a hairline keyline plus a tight, short-throw shadow; paper never levitates. The board itself has no shadow at all — it separates by tone (`cover-deep` header) and by ink keylines.

Because both grounds are light, the keyline is not optional garnish: it is the primary separator, with the shadow reinforcing it.

### Shadow Vocabulary
- **Sheet keyline** (`0 0 0 1px var(--edge)` / `var(--edge-strong)`): the ring that separates the sheet from the board. Every paper plate carries one; borders are not used for this.
- **Small** (`--shadow-sm`, `0 1px 2px rgba(26,31,36,0.10)`): settings panel, worksheet-details plate, brand label, active sidebar row.
- **Medium** (`--shadow-md`, `0 2px 4px rgba(26,31,36,0.09), 0 8px 18px -8px rgba(26,31,36,0.20)`): catalog cards, worksheet sheet, language menu, skip link.
- **Card hover** (`0 0 0 1px var(--edge-strong), 0 6px 10px rgba(26,31,36,0.10), 0 18px 30px -12px rgba(26,31,36,0.22)`) with `translateY(-3px)`: the sheet lifted off the board.

### Named Rules
**The Keyline-First Rule.** Separation on the board is a 1px ink ring at low alpha, not a border and not a heavier shadow. A paper plate that drops its keyline has broken the governing rule, not just lost a detail.

**The Flat Cover Rule.** Nothing on the board is elevated except paper. Board-side controls (nav links, back button, sidebar rows, resume card, empty state) use `cover-wash` / `cover-wash-strong` tonal washes instead of shadow.

## Shapes

Softly cut, on a three-step scale and nothing else: `--radius-sm` **6px** for small marks, `--radius` **8px** for every control (buttons, inputs, the segmented toggle's outer corners, chips, the language menu, the skip link), and `--radius-lg` **12px** for plates (worksheet, catalog card, settings panel, static page). A literal pixel radius in a component file is drift. A segmented group rounds only its first and last children; interior seams are shared 1px borders with the left border removed.

Form language: rules and bands, not pills or blobs. Subject identity is a 4–5px straight bar or a stroked icon. The writable field is a 104px underline (72px on mobile) sized for a child's handwriting. The set stamp is a 1.5px stroked box with 3px corners. The empty state is the only dashed border in the system (`1px dashed cover-line-strong`).

**The Three-Step Radius Rule.** Every corner in the app is `--radius-sm`, `--radius` or `--radius-lg`. A 2–3px scale was tried and read as too sharp for a product a six-year-old sits in front of; a literal px value is drift in either direction.

**The Stroked-Mark Rule.** Every mark in the interface is drawn: sheet miniatures are hand-authored SVG at one stroke weight and one 8px grid pitch (`SheetThumb.jsx`); interface icons are inline stroked SVG (Tabler, `stroke` 1.7–2.0, 19–26px), tinted with the subject ink. No icon font, no emoji, no raster glyph, no illustration-in-a-tinted-square.

## Components

### Buttons
- **Shape:** `--radius` (8px), 44px minimum height, Inter 700 at 14px, `translateY(1px)` on press.
- **Primary:** marking red on white (`10px 20px`); hovers to `mark-deep`. This is the Print action and, at the sheet's foot, widens to full width on mobile (`12px 28px`, 15px).
- **Secondary:** transparent with a 1.5px `border-dark` stroke and ink text; hovers to a 6% ink wash with a `control-ink` border.
- **Toggle (segmented):** 1px `border-dark`, transparent, Inter 500 13px, `7px 14px`; active fills `control-ink` with white text; focused segment raises `z-index` so its ring is not clipped. Never wraps; on mobile the group is full-width with equal flex children and wrapping labels.
- **Disabled:** `opacity: 0.45`, `not-allowed`, no press transform.

### Cards (catalog, landing)
Paper on the board: sheet stock, 2px corners, `edge` keyline + `--shadow-md`, subject band 5px across the head, a drawn miniature of the real sheet (max 208px, 104:64) above a hairline `paper-edge` rule, then label (Archivo 700 16px) and description (Inter 13px graphite). Hover lifts 3px on `cubic-bezier(0.2,0.8,0.3,1)` over 0.18s and strengthens the keyline.

### Sidebar rows and mobile chips (compact catalog)
Transparent rows on the board, 44px tall, `9px 12px`, with a 19px subject-tinted icon and an ink-on-board label (Inter 600 13px). Hover is `cover-wash`. **Active is the sheet pulled out of the book:** the row fills with paper, takes the `edge` keyline and `--shadow-sm`, and the label goes 700. On mobile the same row becomes a snap-aligned chip that rests on `cover-wash` (a transparent chip has no shape on a light board) and inverts to paper when active.

**The Two-Cue Rule.** In a dense list the icon is the faster cue and the colour is the second one. Colour alone carries nothing for a viewer who cannot separate the hues, so a subject ink never travels without either its icon or its label. The full catalog keeps the drawn sheet miniatures instead: at card size the real sheet is more informative than any icon, and a stock icon there would be the tinted-square register this world refuses.

### Settings panel
The shared control primitive for every printable worksheet, holding the same positions on every sheet. Paper card, 3px corners, 1px `border` stroke, `--shadow-sm`, body `18px 24px 20px`, two-up on desktop, footer rule with Regenerate + Print right-aligned. Rows are label (Inter 500 13px graphite) over control. No `overflow: hidden` — it would clip focus rings at the card edge.

### Inputs
Numeric input: 72px wide, 1px `border-dark`, 3px corners, centred 14px on paper. Focus drops the outline for a `control-ink` border plus a 3px `rgba(26,31,36,0.12)` halo. Checkboxes and sliders use `accent-color: var(--color-primary)`.

### Navigation
Site header on `cover-deep` with a 2px `cover-line` bottom rule. The wordmark is a masthead printed straight onto that stock — Archivo 800 at 19px, tracked −0.022em, beside a 22px stroked ruler icon — with no plate, no keyline and no hover lift. It is still a link home, so the wordmark (not the mark) carries a 2px underline in `cover-line-strong` on hover. Nav links are ink Inter 600 13px on transparent, hovering to `cover-wash`. The language button is an outlined board control; its menu is a paper plate (172px min) with 44px rows, `paper-hover` on hover, and the current locale in `control-ink` 600.

### Skip link
Paper chip parked at `translateY(calc(-100% - 20px))`, top-left, 44px tall, z-index 100; slides to 0 on `:focus-visible` over 0.16s.

### Resume card
The remembered sheet, offered not forced: a board-side link on `cover-wash` with a `cover-line` border, a 4px subject tab, and an Archivo 700 16px label. Hover goes to `cover-wash-strong` and `cover-line-strong`.

### Empty state
Board-side, max 46ch, dashed `cover-line-strong` border on `cover-wash`, ink 15px/1.55. It says what went wrong and how to fix it, where the sheet would have been.

### Worksheet header (signature)
The sheet is a document, so it carries a document's head: title (Inter 700 20px) with optional graphite meta, beside a ruled `<dl>` of **NAME**, **DATE** and **SET NO.** Field captions are 11px/600/0.08em uppercase graphite; the writable rules are 104px × 1.15em `border-dark` underlines (72px mobile); the set number is a stroked, tabular-num stamp box. The block is closed by a 2px `border-worksheet` rule and renders identically on screen and on paper — what the parent approves is what prints.

### Worksheet sheet (signature)
Sheet paper with the squared ruling painted as two gradients at `--notebook-grid-size` pitch, anchored to the padding box so content laid out in whole squares lands in cells. `print-color-adjust: exact` keeps the ruling on paper. Every problem grid runs a CSS counter and prints its sequence number absolutely positioned at 10px/600 tabular, adding no height so the square grid is never broken.

### Answer key (signature, print only)
`.print-only` on screen, `display: block` in print, `break-before: page`. Same paper, same ruled head (Archivo 800 15pt title, meta, stamp box), then a six-column list, `break-inside: avoid`, mono tabular values with 9pt right-aligned numbers. It is a separate page on purpose: a key at the foot of the child's own sheet would hand them the instant feedback the product exists to withhold.

## Do's and Don'ts

### Do:
- **Do** put paper only where a sheet, a leaf, or a sheet's control panel is; everything else stands on the board.
- **Do** give every new paper surface all three separators: its own `color: var(--color-text)`, a 1px `var(--edge)` keyline, and `--shadow-sm`/`--shadow-md`. On a light board, one of the three is not enough.
- **Do** give every plate its 1px `--edge` keyline and its lift. At 1.09:1 the tint cannot separate anything on its own; the hairline is the boundary.
- **Do** build board-side hover and raised states from `cover-wash` / `cover-wash-strong`, tinted from the ground's own ink.
- **Do** spend marking red only on the Print action, the focus ring, prose links (`mark-deep`) and the set stamp.
- **Do** pair every subject ink with an icon or a text label — colour is the second cue, never the only one.
- **Do** set every figure in JetBrains Mono with `tabular-nums`.
- **Do** give every interactive element `min-height: 44px`.
- **Do** measure block rhythm in `--sq` / `--half-sq`.
- **Do** convert every screen grey to a real ink value inside `@media print`.
- **Do** budget the tallest translation when computing rows per printed page.

### Don't:
- **Don't** introduce a dark ground. The world is stationery and stationery is light; the ink-navy field was tried and rejected outright.
- **Don't** ship a paper plate without its keyline. Without the edge it is a cream shape on a cream field.
- **Don't** use white-tinted washes on the board. White on light board is invisible; washes are ink-tinted.
- **Don't** use a subject ink as text, as a fill, or as the only signal of state.
- **Don't** use marking red for badges, headings, dividers or decoration.
- **Don't** treat `control-ink` as a ground. It is a control accent (toggle fill, `accent-color`, focus border) and nothing larger.
- **Don't** put `on-cover-muted` text on `cover-deep` — it measures 4.40:1 there.
- **Don't** put decorative grey on paper: every printed mark carries information and must survive grayscale on a cheap inkjet.
- **Don't** round anything past 3px.
- **Don't** use an icon font, emoji, or a raster glyph. Interface icons are inline stroked SVG at 1.7–2.0 stroke; sheet miniatures are drawn SVG at one weight and one grid pitch.
- **Don't** put an icon in the full catalog in place of the sheet miniature — at card size the real sheet is the argument.
- **Don't** add a second authored animation. The set stamp is the product's one moment; feedback that rewards a tap is the thing this product argues against.
- **Don't** add uppercase editorial kickers or eyebrows above titles. The 11px uppercase style belongs to ruled document field captions (NAME / DATE / SET NO.) only.
- **Don't** clip focus rings: no `overflow: hidden` on control containers.
- **Don't** force a paper size in `@page`. Orientation only; lay out to the Letter/A4 intersection.

## Print

- **Paper strategy:** `@page` sets orientation only (`size: landscape`) and margins `0.3in 0.3in 0.5in`. Paper size stays the user's — five of seven locales are A4. Sheets are laid out to the Letter/A4 intersection (11in × 8.27in minus margins) so one page stays one page in either tray.
- **Page budget:** `rowsPerPage()` and `listRowsPerPage()` compute how many problem rows fit, given `PRINT_SQUARE = 24` (quarter inch at 96dpi), a `HEADER_BAND` of 3 squares, one square of row gap, and `SHEET_PAD_TOP` of 0.4in. List worksheets budget the tallest translation of the header (112px) so a wrapped German or Russian instruction never spills a row.
- **Sheet in print:** no border, no radius, no shadow, `padding: 0.4in 0.5in 0` — the wider `@page` bottom margin already reserves the footer band.
- **Print footer:** `position: fixed; bottom: 0`, 9pt, `#4a5560` on paper (7.41:1), repeating on every sheet.
- **Ink discipline:** greys become inks (`#333` labels and rules, `#555` counters, `#111` stamp, `#999` header rule, `#666` blank underlines, `#ddd` row rules); the blank slot loses its gradient fill; the ruling switches to `ruling-print`.
- **`no-print`:** all chrome — header, catalog, settings panel, print CTA, Equation Explorer controls, footer. `print-only` is the mirror and reveals only the answer key and the print footer.

## Motion

One authored moment. **The set stamp** (`ws-stamp-down`, 0.42s, `cubic-bezier(0.16, 1, 0.3, 1)`): the set number comes down like a rubber stamp — `scale(1.32)` and marking-red for an instant, settling to rest and to `border-dark`/ink. It is keyed on the stamp value so it fires exactly when the sheet's content changed, from an already-visible default, so nothing flashes in from nothing. It confirms Regenerate, the highest-frequency action.

Everything else is a state transition of 0.12–0.18s: button colour, card lift, nav wash, skip-link slide, fold chevron.

**The Reduced-Motion Guarantee.** A global `prefers-reduced-motion: reduce` block clamps every animation and transition to 0.01ms with a single iteration, and the stamp explicitly sets `animation: none`. Paper never animates: the stamp is also disabled in `@media print`.

## Accessibility

- **Focus:** a 3px `mark` outline at 2px offset, global on `:focus-visible`, so the ring follows each element's own radius (3.56:1 against the board, 4.47:1 against paper). Where a ring needs an inner separator, surfaces set `--focus-inner` to their own ground.
- **Contrast (measured against the shipped light ground):** ink on paper 16.17:1; ink on board 12.86:1; ink on the header band 11.58:1; ink on `cover-wash-strong` 10.58:1; faded board text 4.89:1; graphite on paper 5.79:1; white on `control-ink` 14.6:1; white on marking red 4.59:1 (AA for the 14px/700 button); prose links `mark-deep` on paper 6.34:1; print footer on paper 7.41:1.
- **Subject inks:** 3.25:1 to 7.22:1 on paper and 2.58:1 to 5.74:1 on the board as icon tint. They are decorative-plus, never the sole cue, and never text.
- **Touch targets:** 44px minimum, declared on every control including mobile chips, the back button (which keeps its label — a bare arrow reads as browser-back) and footer links.
- **Skip link:** first focusable element, visible on focus, jumps to main content.
- **Headings:** one `h1` per page (the brand label on the catalog, the worksheet title on a sheet route), `h2` for sections; collapsible worksheet prose keeps its `h2` inside the `summary`.
- **Non-colour signals:** subject inks are always paired with an icon and a text label; the active sheet is signalled by paper fill, keyline and weight, not hue; sheet and difficulty states are named in words.

## Deviations from the direction contract

Recorded as shipped, not as intended:
- The contract's FIRST VIEWPORT called for the catalog as **cover label-strips**; the build shipped a **paper card grid** (`repeat(auto-fill, minmax(268px, 1fr))`, 940px). The label-strip form survives only in the compact sidebar/chip mode. The card grid is what is documented above.
- *(resolved)* The Equation Explorer's controls sat outside the shared settings panel. They are now a `SettingsPanel` with labelled `Operation` and `Limit` rows in the same position as the other eight worksheets, and its board, tiles, blank, numpad and explanation panel were rebuilt in the paper vocabulary (2px corners, `--edge` keylines, no hex literals). The confetti burst and the wrong-answer shake are gone: a reward loop is what the About page argues against.

## Not canonized

Shipped, but deliberately excluded from the system above:
- *(resolved)* The mobile hero was pinned to 14px by a `≤768px` override left from the old caption-sized tagline — a step *below* body size. The override is gone; `clamp(20px, 2.6vw, 30px)` now yields 20px at 390px and 30px at 1440px.
- *(resolved)* `ink-compare` was `#c07f1e` at 2.58:1 on the board, under the 3:1 non-text floor. It is now `#9a6212` (3.94:1 board, 4.95:1 paper). All nine subject inks clear 3:1 on both grounds; a new one must too.
- *(resolved)* `--shadow-sm` / `--shadow-md` were navy-tinted (`rgba(16,47,77,…)`) from the dark-ground build. Every shadow and keyline is now ink-tinted (`rgba(26,31,36,…)`).
- *(resolved)* The `.worksheet` keyline is `var(--edge)` and `.catalog-card-sheet`'s wash is ink-tinted. No navy literal remains in the stylesheets.


## Revision — full-site coherence pass

Measured re-review of the shipped build (30/40, up from 24/40) found the world
stopped at three borders. What changed, and why:

- **Control strokes.** `--color-border-dark` was `#b9b0a0`, measuring **2.09:1
  on paper and 1.66:1 on the board** — under the 3:1 non-text floor for the
  toggles, inputs, the language button and the sheet's Name/Date rules. Now
  `#7f776a` (4.31 / 3.43 / 3.08 on paper, board and header band).
- **One muted grey.** `--on-cover-muted` `#5c6068` and `--color-text-muted`
  `#5a6570` were two values for one role; both are now `#5a6570`.
- **Rounding's ink** was `#c4362b`, 8° from the marking red, so on that route
  the title icon and the Print button were nearly the same hue and the one
  warm mark stopped being one. Now `#8f3b6e`.
- **The `=` sign** in the Equation Explorer was `border-dark` at **1.66:1**. It
  is the pivot of the activity, and it is now ink.
- **Ink discipline on paper.** Every operator (`.colarith-op`, `.problem-text
  .op`, `.stacked-row .op`, `.rounding-arrow`, `.pattern-comma`) was grey on
  screen and printed grey; a grey `+` against a grey `−` is what a child
  misreads on a cheap inkjet. All are ink now, with `#111` print overrides.
- **One numbering system.** Patterns used an inline `1.`; it now uses the same
  corner counter as every other sheet.
- **Cover stays on the cover.** The multiplication table painted `--cover` onto
  the paper head row and a `control-ink` fill in the corner, and printed both
  as blue-tinted greys (`#d5dcea` / `#e8edf6`) left from the dark build. The
  head is `--paper-edge`, the corner a ruled outline, and print is neutral.
- **Print is white.** The sheet, the answer key and the print footer painted
  the cream screen stock onto a white page, which read as a second paper
  stopping where the content stopped.
- **Keyline-first, everywhere.** `.settings-panel` used a grey `border` at 3px
  while the sheet below it used a keyline at 2px; both are keyline + lift now.
- **44px at every width.** `.btn-toggle`, `.checkbox-option` and `.num-input`
  had their touch sizing only under `max-width: 768px`, so an 820px tablet —
  which is served the desktop layout — got 33px controls and 17px checkbox
  rows.
- **The static plate** is a leaf of the book: Archivo title left on the
  measure, keyline, lift, and a square of stock above it. Its centring is
  scoped to `.catalog--full.static-page` so `.worksheet-details`, which shares
  the class, no longer inherits a different centre and width from the sheet
  it explains.
- **The rail scrolls to the open sheet.** On phones the active chip was
  off-screen on load for four of five routes, so the rail showed no selection.
- **Sheets scale, they do not crop.** `usePreviewScale` fits a sheet to a
  narrow column instead of cutting its last column mid-number; print is
  untouched.
- **ARIA.** `role="tablist"`/`role="tab"`/`role="tabpanel"` were declared on a
  `<nav>` of links with no roving tabindex and no arrow-key handling. They are
  gone; the open sheet is `aria-current="page"`.
- **Dead tokens removed:** `--focus-ring` (focus is an `outline`),
  `--color-accent-orange`, `--color-accent-purple`, `--color-header-bg`.
- **Guarded state added:** a multiplication range wider than 15 factors cannot
  fit one page, so it now says so instead of silently paging.

## Revision — printed ruling, preview alignment, card treatment

Four defects, all measured before and after.

- **The printed ruling was gone.** In the print block `.worksheet { background:
  #fff }` and `.notebook-grid-bg { background-image: … }` are the same
  specificity, so the later rule won the image while the shorthand won
  `background-size` — resetting it to `auto`. Measured on long division:
  `26px 26px, 26px 26px` on screen, **`auto, auto`** in print, which paints one
  stray 1px rule at the edge of the sheet instead of squared paper. Every
  notebook worksheet printed unruled. The shorthand is now `background-color`,
  and the print rule restates `background-size`, `-origin`, `-position` and
  `-repeat` so an unrelated shorthand can never flatten the layer again.
  Rule: **inside `@media print`, never the `background` shorthand on a surface
  another rule paints an image onto.**
- **The ruling now reaches the bottom margin.** It used to stop at the last
  problem, so bracket long division printed 2.4in of bare white under the
  method that needs working room most. `PAGE_SQUARES` (29, the page's own
  square budget) is published as `--nb-page-sq` and the print sheet carries
  `min-height: calc(var(--nb-page-sq) * var(--nb-sq))` — 696px against a 717px
  printable height, so it fills the page and cannot push a second one.
- **Long division clears its header by one square.** Its frames grow *upward*
  into the quotient row (`.coldiv-item` is `flex-start`, unlike the carry space
  above a column sum), so at `headerGap: 0` the first row's quotient boxes butt
  against the header rule. `headerGap: 1` costs nothing: `rowsPerPage` returns
  the same count for all six preset × notation combinations.
- **The ruling is neutral.** `--notebook-grid-line-color` was slate-400
  (`rgba(148,163,184,.28)`) — the last cool hue left on the paper after the
  palette went warm, and distinctly lavender on cream. Both screen and print
  values are neutral now, at the same blended lightness (≈223 on paper, ≈196
  on white), so the ruling is no heavier, only the right colour.
- **The catalog previews sit on their own ruling.** `SheetThumb` drew squared
  paper at an 8px pitch and then placed every mark off it — digits at `y=30`,
  rules at `y=20`/`44`, headers on grid *lines* rather than cell centres, and a
  `fontSize` of 9 against an 8px square. All nine mark sets are redrawn through
  `cx`/`cy`/`ln`/`span`: a digit is centred in a cell at the sheet's own 0.77
  digit-to-square ratio, a rule falls on a grid line, a blank is ink inside a
  cell. The times table's cells are two squares wide, as the real table's are.
  Long division shows the frame `frameLayout()` renders rather than a
  decorative curly brace.
- **The subject colour moved from a band to the shadow.** The 5px band ruled
  across the head of each card sat between the card edge and the preview and
  read as chrome — the loudest thing on a page whose subject is nine drawn
  sheets. The card now casts a shadow tinted with `--card-color` via
  `color-mix`, declared after a neutral shadow so an engine without `color-mix`
  keeps depth rather than losing it.

Verified: 195 tests, lint and build clean; 8 print configurations at
`background-size: 24px 24px`, `boxH: 696`, one page each, long division at a
24px header gap with no problem lost; the 10-route full print sweep still one
page in A4 and Letter (two with the answer key); 21 route × viewport
combinations with zero contrast failures and no horizontal overflow; detector
clean of non-advisory findings on every touched file.

## Revision — the board gets lighter and loses the yellow

The board stock read as aged paper. Two things caused it, and lightness was
the smaller one: `--cover` was `#e8e2d5` at **chroma 19** — a real yellow cast,
not a neutral warm — and it sat at L 0.764, a full step below the sheet.

The ground is now `#eeece4`: **L 0.764 → 0.838, chroma 19 → 10**. Every
cream-adjacent neutral moved with it rather than being left behind, so the
board does not now sit lighter than its own borders and washes —
`--cover-deep`, `--cover-raised`, `--paper-edge`, `--color-surface-hover`,
`--color-border`, `--color-border-light`, `--color-border-worksheet`, and
`--color-border-dark` (`#7f776a` → `#7c7770`, chroma 21 → 12). `THEME_COLOR`
in `seo/site.js` tracks `--cover-deep`, and the no-JS fallback body in
`seo/render.js` tracks `--cover`.

Text contrast improves everywhere on the ground: ink 12.86 → **14.03**, muted
grey 4.61 → **5.03**, and `--color-border-dark` clears the 3:1 non-text floor
on both grounds by a wider margin than before (paper 4.33, board 3.75).

**The cost, stated plainly.** Cover and paper now sit **1.15:1** apart, down
from 1.26:1. TONE is now the weakest of the three carriers, not the first. The
consequence is a hard rule, not a preference: **a paper plate that ships
without `box-shadow: 0 0 0 1px var(--edge)` and a lift is invisible at this
tone step.** Any further lightening of the board has to come with a
correspondingly stronger edge, or the page becomes one flat field.

Verified: 195 tests, lint and build clean; 21 route × viewport combinations
with **zero contrast failures** and no horizontal overflow; the 8 print
configurations unchanged (ruled, 696px, one page each).

## Revision — the brand stops being a button

`.site-brand` was a paper plate: `--paper` ground, an `--edge-strong` keyline,
`--shadow-sm`, and a 1px rise on hover. It sat immediately beside the outlined
language switcher, so the two read as a pair of buttons — and on the lightened
board the plate stood out more, not less. It also broke the cover/paper rule
from the unusual direction: paper is reserved for where real paper is, and a
wordmark is not a sheet.

The wordmark is now a masthead on the cover stock. Archivo 800 at 19px
(16px on phones), tracked −0.022em, ink, beside the drawn ruler mark. It is
still a link home, so it owes an affordance — a 2px underline in
`--cover-line-strong` at a 4px offset, on the wordmark only, since the mark
beside it is not text. Focus keeps the marking-red ring.

**The header now contains exactly one boxed element, and it is the one real
control.** That is the test to apply to anything added there later.

Verified: the wordmark, About and the switcher fit one line at 390px in every
locale including German (`Über uns`) and Russian (`О сайте`) with no
horizontal overflow; 21 route × viewport combinations still report zero
contrast failures; 195 tests, lint and build clean.

## Revision — back to white chrome on a tinted page

The maintainer rejected the cream board outright. Restored, at their direction,
is the ground arrangement the product had before the redesign — and only the
grounds and the radii; the ink, the marking red, the drawn sheet previews, the
masthead and all of the print work stay.

- **Grounds.** `--cover` `#eeece4` → **`#f5f5f0`** (the page tint), `--cover-deep`
  → **white** (the site header, ruled off with a 1px hairline instead of a 2px
  score), `--cover-raised` and `--paper` → **white**. `.catalog` is painted
  white, so the landing view reads as one clean sheet and the tint shows only
  under the footer; the worksheet area leaves the tint exposed behind its white
  panels. `THEME_COLOR` and the no-JS fallback body track the new values.
- **Radii.** The 2–3px scale read as too sharp. Three steps now, all tokens:
  `--radius-sm` 6px, `--radius` 8px, `--radius-lg` 12px. 34 literal 2px/3px
  radii across five files were replaced.
- **The card wash is gone.** `.catalog-card-sheet` carried a top-down ink
  gradient that separated the preview from its label on cream stock; on a white
  card it read as a grey smudge over the top half. The 1px rule under the
  preview does that job on its own.

Contrast improves again on both grounds: ink **15.17** on the tint and **16.60**
on white; muted grey **5.44** / **5.95**; `--color-border-dark` **4.06** / **4.44**
against a 3:1 floor.

Verified: 195 tests, lint and build clean; 21 route × viewport combinations with
zero contrast failures and no horizontal overflow; the 8 notebook print
configurations unchanged (ruled, 696px, one page each) and the full 10-sheet
sweep still one page in A4 and Letter, two with the answer key.

## Revision — one column for the worksheet page

The worksheet page had no shared measure. Its three blocks each sized
themselves, and all three were pinned to the left edge of the main area:

| | before | after |
|---|---|---|
| title / panel / sheet, at 1680px | `244..1156`, 524px dead to the right | `494..1406`, centred |
| prose plate width | **960px** | **912px**, matching the sheet |
| mobile title left edge | 16px | 12px, on the panel's edge |

`.worksheet-main` now declares the column — `--page-max: 960px` outer and
`--page-gutter` (24px, 12px on phones) — and the topbar, the content and the
prose plate all take it. The plate subtracts the gutters (`width: calc(100% -
var(--page-gutter) * 2)`; the `width` rather than only a `max-width` is what
keeps its gutter on a narrow screen), so it lands on exactly the sheet's edges
instead of overhanging it by 48px.

The title stays left on the column rather than centring inside it — centring
the block is not the same as centring the type in it, and every other title in
the product sits left on its measure.

Verified: title, panel, sheet and prose share one left edge and one width at
1680 / 1440 / 1180 / 900 / 390; six routes × four widths all centred with no
horizontal overflow; print, the 8 notebook configurations, 195 tests, lint and
build unchanged.

**Known and not addressed:** the prose inside that plate runs the full 912px
(~110 characters). The type ramp asks for 65–75ch, so it wants a `--measure`
cap centred in the plate the way `.static-page` does. Left alone because the
brief was the plate's width, not the copy's.

## Revision — the worksheet appendix

The prose under every sheet was set as a second article. Six measured defects, not one.

**The scale ran backwards, in two places.** The lede was **19px** against **16px** section
headings, and every FAQ answer was **16px** against its own **15px** question. That is the
whole of "the font size is too large": no single value was outrageous, the ranking was
inverted, so the eye could not find the entry point.

| piece | before | after |
|---|---|---|
| lede | 19px | **15px** |
| Skills / Format line | 19px ink | **13px muted**, with a paragraph break |
| section heading | 16px | **13px** (the FAQ's own label: 11px tracked micro-label) |
| list items | 16px | **13px** |
| FAQ question | 15px | **14px** |
| FAQ answer | 16px | **13px** |
| dead white down the right | **286px** | **0** |

**A third of it was empty.** The plate is 912px, but the block borrows `.static-page`, whose
`> *` and `.static-fold` rules cap children at `--measure` and whose `align-items: center` is
a no-op here (not a flex container). Every line and every hairline hugged the left edge. The
appendix is a two-column grid above 1080px now — questions in the wider left column, a
reference rail of Settings / Example problems / Other worksheets on the right — so the width
is used rather than apologised for.

**Three shared rules had to be beaten on specificity, not source order.** `.static-page`'s
`--measure`, `.static-intro` size and `align-items` all sit later in the file at equal
specificity. Every appendix rule that overrides one is written `.worksheet-details.static-page`
— the block carries both classes. The prerendered `.static-page` article is untouched.

**Structure.** `fold()` now takes a section key, so the layout places a fold by *what it is*
rather than by where it happens to sit; the reference lists share one `.static-aside` wrapper,
because a grid item spanning three rows distributes its height across them and prised the
three labels 200px apart. The FAQ ships `open`: it is the only part a parent reads, it leads
the DOM, and Google wants content behind `FAQPage` markup visible rather than behind a click.

**"How to use this worksheet" is gone from the page.** Its first step was *Open the URL you
are already on*. It survives in the Markdown twin and `llms-full.txt`, where an agent
genuinely needs the URL. Four message keys and the `link()` helper had no other consumer and
went with it, in all seven locales.

Verified: 284 tests, lint and build clean; the how-to absent from `dist/worksheets/*.html` and
present in the `.md` twin and `llms-full.txt`; `FAQPage` still emitted and the heading outline
still sequential; 21 route × viewport combinations with zero contrast failures and no
horizontal overflow; the 8 notebook print configurations and the 10-sheet A4/Letter sweep
unchanged (the block is `no-print`).
