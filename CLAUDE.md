# CLAUDE.md

Guidance for working in this repo.

## What this is

`draw.marcopontili.com`: a personal, static, single-page whiteboard. The repo is
public (MIT); the hamburger credit links to it. Social cards (`og:*`,
`public/og.png`) and the brand images in `.github/brand/` are in. Excalidraw plus LaTeX (KaTeX), Mermaid-to-shapes, sanitized Markdown, auto
light/dark theme, and PNG/JPEG/SVG/PDF/`.excalidraw` export. React 19 + TypeScript +
Vite, shipped as a PWA. No backend, no login, no tracking.

## Commands

- `npm run dev` - Vite dev server
- `npm run build` - `tsc -b` then `vite build` (must pass before shipping)
- `npm run preview` - serve `dist/` (used by Playwright on port 4173)
- `npm run lint` - ESLint, zero-warning gate
- `npm test` - Vitest unit tests (`src/**/*.test.ts`)
- `npm run test:e2e` - Playwright smoke (`e2e/`, excludes `readme-*`)
- `npm run assets:brand` - favicon/app icons from `public/favicon*.svg`
- `npm run brand:images` / `brand:images:check` - README, GitHub social and OG
  PNGs from `.github/brand/*.svg` (repo-brand kit; do not edit kit files)
- `npm run readme:shots` - README screenshots to `docs/readme/` (needs `npm run preview`)
- `npm run verify:agent-readiness` - agent discovery files in `dist/` + bridge

## Architecture

- `src/main.tsx` - entry: registers the service worker, sets
  `window.EXCALIDRAW_ASSET_PATH`, imports self-hosted Roboto, mounts `<App>`.
- `src/App.tsx` - the only screen. Hosts `<Excalidraw>`, a floating
  `.app-toolbar` (Insert / Export / Theme / Help), boards autosaved to
  IndexedDB (`src/lib/boards.ts`, one Excalidraw mount per board via `key`),
  and lazy-loaded modals (LaTeX, Markdown, Boards). LaTeX/Markdown images keep
  their source in `customData.drawInsert` so double-click reopens the editor.
- `src/components/` - app-owned UI. `Modal.tsx` is the shared dialog shell
  (focus trap, Escape, focus return); the LaTeX, Markdown and Boards modals wrap it.
- `src/lib/` - pure-ish logic (export, boards, db, persist, importFiles, theme,
  latex, markdown, insertImage, download, documentTitleGuard), mostly with a
  colocated `*.test.ts`. `persist.ts` only reads the pre-IndexedDB
  localStorage scene so `boards.ts` can migrate it.
- `public/share-target-sw.js` - Web Share Target handler, pulled into the
  Workbox service worker via `workbox.importScripts`; the manifest also
  declares `file_handlers` for `.excalidraw` (read via `window.launchQueue`).
  Mermaid import is handled by Excalidraw's built-in "Mermaid to Excalidraw".
- `src/lib/agentBridge.ts` - `window.draw` (`getScene`, `setScene`,
  `exportImage`) for coding agents, registered from `App.tsx`; the hamburger
  links "For agents" to `public/for-agents.html`. Discovery files (`llms.txt`,
  `auth.md`, `openapi.json`, `.well-known/*`) are listed in
  `docs/agent-surface.md`.
- `src/styles.css` - app chrome only. Tokens live on `.app-shell`; theme flips by
  toggling a `dark` class so there is no useEffect/commit timing race. Excalidraw's
  own UI is restyled via scoped overrides; do not restyle its canvas.

## Constraints and gotchas

- The site is intentionally NOT indexed: `index.html` sets `noindex, nofollow`
  (plus googlebot/bingbot variants). Do not remove or weaken these. `robots.txt`
  allows only the agent discovery files and social unfurl bots; no canonical tag
  (the page is `noindex`).
- Fonts are self-hosted: Roboto via `@fontsource/roboto/latin-*.css` (latin subset
  only; this is an English tool) and Excalidraw's fonts copied to `dist/fonts/` at
  build by `excalidrawAssetsPlugin`. Runtime never touches a CDN.
- PWA precache globs in `vite.config.ts` match `assets/index-*.{js,css}`. Renaming
  the entry chunk pattern breaks precache.
- `siteMeta.ts` exports (`SITE_DOCUMENT_TITLE`, `SITE_ORIGIN`, `SITE_SHORT_NAME`,
  `SITE_CANONICAL_URL`, `SITE_PAGE_TITLE`, `SITE_OG_IMAGE`) are imported by `vite.config.ts` and components. Add exports
  freely; do not rename or remove.
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
- PWA/meta: iOS/PWA web-app meta and `SITE_CANONICAL_URL` landed here; OG tags
  were removed in 1.6.0 and restored in 1.7.0. The noindex directives stay.
- Code quality: `src/lib` audited; already clean, no changes. Known non-blocking
  item: `utf8ToBase64` is duplicated in `latex.ts` and `markdown.ts`.

## Auditing

`node scripts/audit-shots.mjs <label>` captures screenshots to
`docs/audit/<label>/` across desktop/tablet/mobile in light and dark (plus the
Insert menu and LaTeX modal on desktop). Run `baseline` before changes and
`after` once done, then diff. Requires `npm run preview` running on 4173. The
full workflow is the `site-audit` skill in `.claude/skills/`.
