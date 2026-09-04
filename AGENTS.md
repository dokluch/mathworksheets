# AGENTS.md — MathSheets

Guidance for coding agents (Claude Code, Codex, Cursor, …) working in this repository.

## What this is

MathSheets ("Math Worksheets") is a React 19 + Vite single-page app that generates printable,
randomized math worksheets for grades 1–3 client-side. Live site: https://mathworksheets-eight.vercel.app
(hosted on Vercel, zero-config Vite preset plus `vercel.json` and a Routing Middleware).

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server on http://localhost:5176 |
| `npm test` | Vitest (unit + jsdom component tests) |
| `npm run lint` | ESLint (must be clean) |
| `npm run build` | `vite build` then `scripts/prerender.mjs` writes per-route HTML, Markdown twins, `llms.txt`, `llms-full.txt`, `sitemap.xml`, `robots.txt`, `worksheets.json`, `404.html` into `dist/` |
| `npm run verify:live -- <url>` | Post-deploy smoke test of every public SEO/agent surface |

Node 24, npm 11. No TypeScript.

## Layout

- `src/worksheets.js` — **the catalog**: id, slug, label, descriptions, grades, skills, settings, color. Everything SEO-related derives from it.
- `src/App.jsx` — catalog UI + worksheet switcher. `ICONS` and `COMPONENTS` maps keyed by worksheet id.
- `src/components/*.jsx` — one component per worksheet; each has Regenerate (`setSeed`) and Print (`window.print()`) buttons and uses `usePersistedState(tabId, key, default)` for settings (localStorage key `mathsheets`).
- `src/hooks/useRoute.js` — tiny history router: `/worksheets/<slug>`; `/` restores the remembered sheet via `replaceState`.
- `src/seo/site.js` — brand, `SITE_URL` (`VITE_SITE_URL` env), author, license.
- `src/seo/render.js` — pure string renderers: `<head>` metadata + JSON-LD, crawlable static HTML, Markdown twins, llms.txt, sitemap, robots, catalog JSON, 404 bodies, `buildSiteFiles()`.
- `src/seo/negotiate.js` — RFC 9110 `Accept` negotiation (q-values, specificity).
- `middleware.js` — Vercel Routing Middleware: `Accept: text/markdown` → `.md` twin, `Vary: Accept`, `Link: rel="alternate"`, 406, Markdown 404s. Matcher skips any path with an extension.
- `src/lib/analytics.js` — GA4 via gtag with Consent Mode v2 (denied by default); no-op unless `VITE_GA_MEASUREMENT_ID` is set.
- `vite.config.js` — `seoHtml()` plugin injects home metadata/static content between the `<!-- seo:head -->` / `<!-- seo:content -->` markers in `index.html`; also holds the Vitest config.
- `scripts/prerender.mjs`, `scripts/verify-live.mjs` — build and verification scripts.

## Adding a worksheet

1. Append an entry to `src/worksheets.js` (unique `id` and `slug`, `longDesc` ≥ 80 chars, at least one skill and one setting).
2. Create `src/components/<Name>.jsx` (+ `.css`), using `usePersistedState('<id>', …)` for settings and calling `trackEvent('regenerate_worksheet', { worksheet_id: '<id>' })` in the Regenerate handler.
3. Register it in `COMPONENTS` and `ICONS` in `src/App.jsx`.
4. `npm test && npm run lint && npm run build`. Static pages, Markdown, sitemap, llms.txt and `worksheets.json` regenerate automatically.

## Invariants (tests enforce these)

- Home HTML without JavaScript has ≥ 500 characters of text, exactly one `<h1>`, sequential heading levels, and a link to every worksheet.
- `llms.txt` follows llmstxt.org: `# MathSheets`, a `>` blockquote, then `## Worksheets`, `## Developers`, `## Optional` lists of `- [title](absolute url): notes`.
- Every page URL has a `.md` twin and is listed once in `sitemap.xml`.
- Unknown extensionless paths return HTTP 404 with a Markdown body (HTML for browsers).
- `npm run lint` and `npm test` stay green; keep existing visual design and print behaviour.

## Analytics events (GA4)

`page_view`, `select_worksheet`, `regenerate_worksheet`, `print_worksheet` (with `setting_*` params), `solve_equation`.
Key events (`print_worksheet`, `solve_equation`) are marked in the GA4 admin UI, not in code.
