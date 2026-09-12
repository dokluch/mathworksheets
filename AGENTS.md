# AGENTS.md — Super Awesome Math

Guidance for coding agents (Claude Code, Codex, Cursor, …) working in this repository.

## What this is

Super Awesome Math (formerly "MathSheets") is a React 19 + Vite single-page app that generates printable,
randomized math worksheets for grades 1–6 client-side. Live site: https://superawesomemath.com
(hosted on Vercel, zero-config Vite preset plus `vercel.json` and a Routing Middleware).

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server on http://localhost:5176 |
| `npm test` | Vitest (unit + jsdom component tests) |
| `npm run lint` | ESLint (must be clean) |
| `npm run build` | `vite build` then `scripts/prerender.mjs` writes per-route HTML, Markdown twins, `llms.txt`, `llms-full.txt`, `sitemap.xml`, `robots.txt`, `agents.md`, `worksheets.json`, `404.html` into `dist/` |
| `npm run verify:live -- <url>` | Post-deploy smoke test of every public SEO/agent surface (including each page's `og:image`) |
| `npm run og` | Regenerate the `public/og/` Open Graph previews for every page and locale from the running app with Playwright (`npm run og -- <slug>`, `-- <locale>` or `-- <locale>/<slug>` for a subset; needs `npx playwright install chromium` once, and `pngquant` on PATH to shrink the PNGs) |

Node 24, npm 11. No TypeScript.

## Layout

- `src/worksheets.js` — **the catalog**: id, slug, label, descriptions, grades, skills, settings, color (English). Everything SEO-related derives from it.
- `src/i18n/` — **i18n**: `locales.js` (`LOCALES` = en, fr, es, de, it, ru, zh; `LOCALE_META`; `splitLocale`/`localizePath`), `index.js` (`t(locale, key, params)` with `{param}` interpolation and `Intl.PluralRules` plural objects, `localizeWorksheet`/`localizePage`), `context.js` (`useT()`/`useLocale()` for React), `messages/<locale>.js` (one nested tree per language; `en.js` is the reference key set, the others add `worksheets.<id>` and `pages.<id>` blocks). English is served at the root, every other locale under `/<locale>/…`.
- `src/pages.js` — static pages (About `/about`, Privacy `/privacy`, Terms `/terms`): title, description, `updated`, sections of paragraphs/items with `[label](url)` links. HTML, Markdown twin, sitemap, llms.txt and the React view all derive from it; operator/contact constants live in `src/seo/site.js`.
- `src/App.jsx` — catalog UI + worksheet switcher. `ICONS` and `COMPONENTS` maps keyed by worksheet id. Provides `LocaleContext`; renders `components/SiteHeader.jsx` (brand link home, About link, `components/LanguageSwitcher.jsx` globe button + `role="menu"` of real links; `.no-print`) above every view, with the brand as the `<h1>` only on the catalog, `components/StaticPage.jsx` (innerHTML from `staticBody()` in `render.js`) for `/about`, `/privacy`, `/terms`, and `components/SiteFooter.jsx` (`.no-print`) on the catalog, static pages and, in compact form, the worksheet sidebar.
- `src/components/*.jsx` — one component per worksheet; each uses `usePersistedState(tabId, key, default)` for settings (localStorage key `mathsheets` — the legacy key, kept intentionally across the rename) and renders them with the shared panel in `src/components/controls/SettingsPanel.jsx` (`SettingsPanel` card, one `SettingRow` per setting, `SegmentedControl` / `CheckboxOption` controls, `PanelActions` = Regenerate + Print via `window.print()`; the bottom `components/PrintCta.jsx` carries the Copies count). Every printable sheet deals its problems through `src/hooks/useSheetSet.js` (`useSheetSet(rng => generate(…, rng), deps)` → `{ sheets, set, setSet, regenerate }`) and renders them through `src/components/SheetCopies.jsx`; the set number is the seed (`src/lib/sheetSet.js`, `src/lib/rng.js`) and the header stamp edits it in place (`WorksheetHeader` `onStampChange`). `App.css` holds the global `.btn*` / `.btn-group` / `.btn-toggle` primitives; the panel's own layout (two settings per row ≥ 769px with over-wide controls dropping to a full row, full-width 44px controls ≤ 768px) lives in `SettingsPanel.css`.
- `src/hooks/useRoute.js` — tiny history router returning `[activeSheet, navigate, activePage, locale, setLocale, pathInLocale]`: `/worksheets/<slug>` selects a sheet, `/about`, `/privacy`, `/terms` select a static page, an optional `/<locale>` prefix selects the language (`/en/…` is a 404), unprefixed URLs are moved to the remembered locale and `/` restores the remembered sheet via `replaceState`. `navigate()` takes a worksheet id, a site path or `null` and keeps the locale; `setLocale(code)` pushes the same page under another prefix and syncs `<html lang>`, canonical and hreflang links.
- `src/seo/site.js` — brand, `SITE_URL` (`VITE_SITE_URL` env), author, license.
- `src/seo/render.js` — pure string renderers: `<head>` metadata + JSON-LD, crawlable static HTML, Markdown twins, llms.txt, sitemap, robots, `agents.md`, catalog JSON, 404 bodies, `buildSiteFiles()`.
- `src/agents.js` — when an agent should reach for this site and when it should not, as data. Folded into `llms.txt`, `llms-full.txt`, `/agents.md` and `worksheets.json` (`usage.whenToUse` / `usage.whenNotToUse`) so the four cannot drift.
- `src/seo/negotiate.js` — RFC 9110 `Accept` negotiation (q-values, specificity).
- `middleware.js` — Vercel Routing Middleware: `Accept: text/markdown` → `.md` twin, `Vary: Accept`, `Content-Language`, `Link: rel="alternate"`, 406, Markdown 404s in the language of the path prefix. No `Accept-Language` redirect. Matcher skips any path with an extension.
- `src/lib/analytics.js` — GA4 via gtag with Consent Mode v2 (denied by default); no-op unless `VITE_GA_MEASUREMENT_ID` is set.
- `vite.config.js` — `seoHtml()` plugin injects home metadata/static content between the `<!-- seo:head -->` / `<!-- seo:content -->` markers in `index.html`; also holds the Vitest config.
- `scripts/prerender.mjs`, `scripts/verify-live.mjs` — build and verification scripts.
- `scripts/og-images.mjs` — screenshots every page's preview element in headless Chromium, once per locale at its localized URL, and composes the 1200×630 cards: `public/og/<slug>.png` for English and `public/og/<locale>/<slug>.png` for the rest, with translated title, description, badges and tagline (`ogImagePath()` in `render.js` links to them). Cards are quantised in place with pngquant when installed. Images are committed, not built on Vercel; `Math.random` is seeded per page so reruns are reproducible.

## Adding a worksheet

1. Append an entry to `src/worksheets.js` (unique `id` and `slug`, `longDesc` ≥ 80 chars, at least one skill and one setting), then add a `worksheets.<id>` block (label, shortDesc, longDesc, skills, settings with the same counts) to every `src/i18n/messages/<locale>.js` except `en.js` (`src/i18n/i18n.test.js` fails until you do).
2. Create `src/components/<Name>.jsx` (+ `.css`), using `usePersistedState('<id>', …)` for settings, `const t = useT()` for every visible string (add the keys to all message files) and building the settings with `SettingsPanel` / `SettingRow` / `SegmentedControl` / `CheckboxOption` plus `<PanelActions worksheetId="<id>" onRegenerate={regenerate} />` from `src/components/controls/SettingsPanel.jsx` (it fires `trackEvent('regenerate_worksheet', …)` for you). Generate with `const { sheets, setSet, regenerate } = useSheetSet(rng => generateSheet(…, rng), [settings])` — the generator must draw only from the `rng` it is given (`asHelpers(rng)` from `src/lib/rng.js` gives `int`/`pick`/`chance`/`shuffle`), never from `Math.random`, so a set number reproduces the page. Render the sheet through `<SheetCopies sheets={sheets}>{({ set, data }, primary) => …}</SheetCopies>` with measuring refs only on the primary copy, `<WorksheetHeader stamp={String(set)} onStampChange={primary ? setSet : undefined} />`, and one `<AnswerKey>` per entry of `sheets`. Do not hand-roll control markup. Render numbers as plain digits (`String(n)`, never `toLocaleString()`).
3. Register it in `COMPONENTS` and `ICONS` in `src/App.jsx`.
4. `npm run og -- <slug>` to generate its preview card in every locale (a test fails while any is missing).
5. `npm test && npm run lint && npm run build`. Static pages, Markdown, sitemap, llms.txt and `worksheets.json` regenerate automatically.

## Adding a static page

1. Append an entry to `src/pages.js` (unique `slug`, `title`, `navLabel`, `description`, `updated` as `YYYY-MM-DD`, sections).
2. Add a `pages.<id>` block with the same section shape (headings, paragraph and item counts) to every non-English `src/i18n/messages/<locale>.js`; translated text may use `{brand}`, `{operator}`, `{contact}`, `{license}`, `{github}` and `[label](/path)` links (paths are prefixed per locale automatically).
3. Nothing else: `findRoute()`/`routes()` pick it up, so the HTML, Markdown twin, sitemap, llms.txt "Optional" entry, 404 links, footer link and React view follow in every locale. Static pages share the home `og:image`.
4. **Append** to `PAGES`; do not insert. `App.test.jsx` and `render.test.js` index `PAGES[0..2]` as About/Privacy/Terms.
5. Link machine-readable files (`/llms.txt`, `/agents.md`, `/worksheets.json`) with the absolute `{llms}` / `{agents}` / `{catalog}` params, never `[x](/llms.txt)`: `inlineHtml()` locale-prefixes root-relative links, which would produce `/fr/llms.txt`.
6. A page may set `schemaType` (a single string) to get a more specific JSON-LD type than `WebPage`.
3. Bump `updated` whenever the text changes (it is the JSON-LD `dateModified` and the "Last updated" line).

## Invariants (tests enforce these)

- Home HTML without JavaScript has ≥ 500 characters of text, exactly one `<h1>`, sequential heading levels, and a link to every worksheet.
- `llms.txt` follows llmstxt.org: `# Super Awesome Math`, a `>` blockquote, free prose between the blockquote and the first H2, then `## Worksheets`, `## Developers`, `## Optional` lists of `- [title](absolute url): notes`. The when-to-use guidance lives in that prose region — a heading there would break both the format and the one-H1-per-route count in `llms-full.txt`.
- `/agents.md` is a file, not a route: it is emitted by `buildSiteFiles()` but never enters `routes()`, so it has no locale twins, no sitemap entry and no `llms-full.txt` section. `/agents` (extensionless) is a 404. It carries a single H1 and only absolute links.
- The JSON-LD `@graph` names `Superposition Labs Inc.` as an `Organization` at `${SITE_URL}/#organization`, publisher of the `WebSite`, the `WebApplication`, every `LearningResource` and every page. The organization node carries no `inLanguage` — it is the same in every locale.
- Every page URL has a `.md` twin and is listed once in `sitemap.xml`; `llms.txt` lists every static page under `## Optional`.
- Every page (static HTML and React) carries the site footer linking every entry in `PAGES` (About, Privacy, Terms); the footer is `.no-print`. No GitHub link: the repository is going private.
- Every worksheet and the home page have a committed 1200×630 PNG per locale under `public/og/` (English at the top level, others under `<locale>/`) that their `og:image` points to; static pages reuse their locale's `home.png`.
- Unknown extensionless paths return HTTP 404 with a Markdown body (HTML for browsers), in the language of the path's locale prefix.
- Languages: English at the root; the same pages under `/fr`, `/es`, `/de`, `/it`, `/ru`, `/zh` (`/<locale>` home is `<locale>.html` + `<locale>.md`, the rest under `<locale>/`); `/en/*` is a 404. Every locale × page is prerendered with its `.md` twin, appears once in `sitemap.xml` with `xhtml:link` alternates, and carries `<html lang>`, hreflang for every locale plus `x-default`, `og:locale` + `og:locale:alternate` and JSON-LD `inLanguage`. OG PNGs are shared across locales. `llms.txt`/`llms-full.txt` stay English (llms.txt links the localized home pages under `## Optional`).
- Message files have identical key sets and `{param}` sets (`labelLower` counts as `label`), a `worksheets.<id>` block for every worksheet and a `pages.<id>` block for every static page.
- No `Accept-Language` redirect: HTML varies on `Accept` only. An explicit switcher choice is stored in localStorage (`app.locale`), never in a cookie; it applies client-side to every unprefixed URL (`/worksheets/x` → `/fr/worksheets/x` via `replaceState`), while a prefixed URL always wins and never overwrites the stored choice.
- Problem numbers print only when an answer key does. The counter is gated on `.tool-panel:has(.answer-key)` in `AddSubtract.css`, so a new worksheet inherits the rule by rendering `<AnswerKey>` — there is no per-sheet class to set. A sheet without an answer key shows no numbers.
- The set number is the seed: `/worksheets/<slug>?set=N` with the same settings deals the same sheet in every browser (`src/App.test.jsx` renders every printable sheet twice at one set). Generators never call `Math.random` directly. Copies print further sets derived from the first (`setSequence`), one sheet per page, each with its own answer key.
- `npm run lint` and `npm test` stay green; keep the print output unchanged and every worksheet's settings on the shared `SettingsPanel`.

## Analytics events (GA4)

`page_view`, `select_worksheet`, `select_grade` (with `grade`: `all` or `1`–`6`), `regenerate_worksheet`, `print_worksheet` (with `copies` and `setting_*` params), `solve_equation`, `switch_locale` (with `locale`).
Key events (`print_worksheet`, `solve_equation`) are marked in the GA4 admin UI, not in code.
