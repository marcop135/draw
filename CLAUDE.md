# CLAUDE.md

Guidance for working in this repo.

## What this is

`draw.marcopontili.com`: a free, static, single-page whiteboard. Excalidraw plus
LaTeX (KaTeX), Mermaid-to-shapes, sanitized Markdown, auto light/dark theme, and
PNG/JPEG/SVG/PDF/`.excalidraw` export. React 19 + TypeScript + Vite, shipped as a
PWA. No backend, no login, no tracking.

## Commands

- `npm run dev` - Vite dev server
- `npm run build` - `tsc -b` then `vite build` (must pass before shipping)
- `npm run preview` - serve `dist/` (used by Playwright on port 4173)
- `npm run lint` - ESLint, zero-warning gate
- `npm test` - Vitest unit tests (`src/**/*.test.ts`)
- `npm run test:e2e` - Playwright smoke (`e2e/`, excludes `readme-*`)

## Architecture

- `src/main.tsx` - entry: registers the service worker, sets
  `window.EXCALIDRAW_ASSET_PATH`, imports self-hosted Roboto, mounts `<App>`.
- `src/App.tsx` - the only screen. Hosts `<Excalidraw>`, a floating
  `.app-toolbar` (Insert / Export / Theme / GitHub / Help), autosave to
  localStorage with restore, and three lazy-loaded modals.
- `src/components/` - app-owned UI. `Modal.tsx` is the shared dialog shell
  (focus trap, Escape, focus return); the LaTeX/Mermaid/Markdown modals wrap it.
- `src/lib/` - pure-ish logic (export, persist, theme, latex, markdown, mermaid,
  insertImage, download, documentTitleGuard), each with a colocated `*.test.ts`.
- `src/styles.css` - app chrome only. Tokens live on `.app-shell`; theme flips by
  toggling a `dark` class so there is no useEffect/commit timing race. Excalidraw's
  own UI is restyled via scoped overrides; do not restyle its canvas.

## Constraints and gotchas

- The site is intentionally NOT indexed: `index.html` sets `noindex, nofollow`
  (plus googlebot/bingbot variants). Do not remove or weaken these.
- `vite.config.ts` has an `injectAbsoluteSocialPreview` plugin that rewrites the
  `og:image` and `twitter:image` lines to absolute URLs via a literal
  `replaceAll`. If you reformat those two lines in `index.html`, the rewrite
  silently stops. Keep them byte-identical or update the plugin.
- Fonts are self-hosted: Roboto via `@fontsource/roboto/latin-*.css` (latin subset
  only; this is an English tool) and Excalidraw's fonts copied to `dist/fonts/` at
  build by `excalidrawAssetsPlugin`. Runtime never touches a CDN.
- PWA precache globs in `vite.config.ts` match `assets/index-*.{js,css}`. Renaming
  the entry chunk pattern breaks precache.
- `siteMeta.ts` exports (`SITE_DOCUMENT_TITLE`, `SITE_ORIGIN`, `SITE_SHORT_NAME`,
  `PROJECT_SOURCE_URL`, `SITE_CANONICAL_URL`) are imported by `vite.config.ts` and
  components. Add exports freely; do not rename or remove.
- Build target is `es2022`; `modulePreload.polyfill` is off (native support).

## Optimization pass (2026-06-04)

Performance, accessibility, SEO, and code-quality audit. Changes:

- Performance: `src/main.tsx` switched Roboto imports to latin-only entrypoints
  (drops ~8 unused subset woff2 per weight); `vite.config.ts` set
  `build.modulePreload.polyfill = false`. Precache dropped ~33 KiB.
- Accessibility: `Modal.tsx` gained a focus trap, `aria-labelledby`, and focus
  return to the opener (guarded so it does not steal focus from a child's
  `autoFocus`). `InsertMenu`/`ExportMenu` got Escape-to-close, outside-click
  close, `role="menuitem"`, trigger `aria-label`s (needed because labels are
  `display:none` below 1300px), and explicit labels on the PDF pills.
  `styles.css` added a `prefers-reduced-motion` block and darkened `--ui-muted`
  to clear WCAG AA on white.
- SEO: `index.html` added `rel=canonical`, `og:url`, and iOS/PWA web-app meta;
  `siteMeta.ts` added `SITE_CANONICAL_URL`. The noindex directives are unchanged.
- Code quality: `src/lib` audited; already clean, no changes. Known non-blocking
  item: `utf8ToBase64` is duplicated in `latex.ts` and `markdown.ts`.

## Auditing

`node scripts/audit-shots.mjs <label>` captures screenshots to
`docs/audit/<label>/` across desktop/tablet/mobile in light and dark (plus the
Insert menu and LaTeX modal on desktop). Run `baseline` before changes and
`after` once done, then diff. Requires `npm run preview` running on 4173. The
full workflow is the `site-audit` skill in `.claude/skills/`.
