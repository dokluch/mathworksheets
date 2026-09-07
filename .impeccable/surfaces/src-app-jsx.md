---
version: 1
slug: "src-app-jsx"
primary_target: "src/App.jsx"
related_targets: ["src/index.css","src/App.css","src/components"]
---

# Surface brief — Super Awesome Math (site-wide)

Scope: the whole public site — catalog, worksheet routes, static pages, and the printed sheet. Visitor mode: **Operate**. The parent completes a task; the printed page is the output.

Audience and job: a parent at a kitchen table, often hurried, printing math practice for a child in grades 1–3. They pick a worksheet, adjust difficulty, print. The child receives paper, not screen.

Action: reach a printed sheet in two minutes. Proof: nine real worksheets and an About page arguing the paper-over-app case from ten cited studies.

Constraints: print is the primary output and must follow the user's paper size (Letter **and** A4); seven locales with long German and French labels; prerendered SEO/Markdown/llms.txt structure is load-bearing; colour may never be the sole carrier of meaning on paper.

## Direction contract

THESIS: The site is the exercise book it prints; it refuses the pastel kids-edu card grid.

OWN-WORLD: Saturated cover-stock fields carry the ground — ink navy, marking red, board green. Squared paper appears only where real paper does: the sheet. Thick cover keylines, ruled white name labels, graphite and red-pencil marks, heavy grotesk caps, tabular numerals on the grid module.

STORY: A hurried parent sees the real sheet before printing it, picks in one glance, reaches paper in two minutes.

FIRST VIEWPORT: A cover field fills the frame. Wordmark in a ruled label, top left. Nine worksheets as cover label-strips, each showing its own sheet, never an icon. Print sits at the sheet's foot.

FORM: The Exercise Book; ranked 1 of 7 on the grounded list; user-pinned over assigned candidate 7; seed key 32edaf82.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Carried disciplines

Donations from the direction round that survive the pinned world, each traceable to a critique finding:

- **FIXED PANEL** (from Night Flight Six-Pack) — settings hold the same positions on every worksheet, so the panel is learned once. Answers heuristic 6, Recognition over Recall.
- **SEGMENTED DOCUMENT** (from Boarding Pass & Gate Board) — the sheet carries a ruled header block with Name, Date and Set no., and a sequence number on every problem. Answers critique P1.
- **INK DISCIPLINE** (from Ikeda Datamatics) — no decorative grey on paper; every mark carries information and the sheet survives grayscale on a cheap inkjet.
- **NAMED STATES** (from Cyclorama Dawn) — difficulty and sheet states are named in words, never carried by colour alone.
- **ONE MODULE** (from Mesophotic Deep Dive) — the notebook square rules every measurement in the interface, not only the worksheet.
- **THE SEED IS VISIBLE** (from Generative Parametric Identity) — Regenerate restamps a visible set number, so the highest-frequency action confirms itself. Answers heuristic 1, Visibility of System Status.

## Unresolved decisions

- Answer key: scope is confirmed (in), form is not — separate page, second column, or toggle.
- Whether the catalog's per-worksheet sheet previews are rendered live from the worksheet components or pre-generated rasters.
