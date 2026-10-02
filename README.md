# draw

[![CI](https://github.com/marcop135/draw/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/marcop135/draw/actions/workflows/ci.yml)
[![Version](https://img.shields.io/badge/version-1.7.2-informational)](./CHANGELOG.md)

Personal whiteboard at [draw.marcopontili.com](https://draw.marcopontili.com). The app is live; this repository is **private**.

Built on [Excalidraw](https://github.com/excalidraw/excalidraw) (MIT) with app-owned inserts, export, theme, and PWA chrome on top. Local-first: no backend, no login, no tracking.

## Features

- Full **Excalidraw** sketching: draw, select, undo, load and save scene
- **LaTeX** math via KaTeX; **Mermaid** diagrams as native editable shapes (Excalidraw's built-in Mermaid to Excalidraw); sanitized **Markdown** notes
- **Automatic theme**: follows system light/dark, with a toolbar cycle for light or dark
- **Export** to PNG, JPEG, SVG, PDF, and `.excalidraw`
- **PWA**: installable; Workbox precaches the shell and assets for offline use
- **Agent bridge**: coding agents drive the canvas through `window.draw` (`getScene`, `setScene`, `exportImage`). See [docs/agent-surface.md](docs/agent-surface.md)

## Usage

- **Insert** (floating toolbar): add LaTeX or Markdown. Mermaid is under Excalidraw's More tools menu (Mermaid to Excalidraw).
- **Export**: download PNG, JPEG, SVG, PDF, or `.excalidraw`.
- **Theme**: cycle automatic (OS) → light → dark; the choice is remembered.
- **Excalidraw** hamburger: help, theme, background, load scene, defaults. "For agents" links to the agent discovery page.

## Privacy / local-first

Drawings live in browser `localStorage`. Clearing site data wipes them. Inserts are sandboxed: KaTeX strict mode, Markdown through DOMPurify, Mermaid parsed to shapes (not raw HTML). HTTP hardening (CSP and related headers) ships in `dist/.htaccess`.

See [SECURITY.md](SECURITY.md) for vulnerability reports.

## Tech stack

- React 19 and TypeScript with Vite
- `@excalidraw/excalidraw`
- KaTeX, marked, DOMPurify, jsPDF
- `vite-plugin-pwa` (Workbox) for the service worker
- Vitest and Playwright for automated tests

## Quick start

Node 22 (`nvm use`).

```bash
npm ci
npm run dev      # http://localhost:5173
```

```bash
npm run build && npm run preview   # production build on :4173
npm run lint && npm test && npm run test:e2e
```

## Layout

| Path | Description |
| --- | --- |
| `src/` | React app: `App.tsx`, components, `lib/` helpers |
| `src/lib/` | Export, LaTeX, Markdown, theme, persist, agent bridge |
| `src/components/` | Insert/export menus and modals |
| `public/` | Static assets, agent discovery files, Apache `.htaccess` |
| `docs/` | Maintainer notes (agent surface) |
| `e2e/` | Playwright smoke tests |
| `dist/` | Production output after `npm run build` |

## Brand assets

```bash
npm run assets:brand          # favicons / app icons from public/favicon*.svg
npm run brand:images          # GitHub social and OG PNGs from .github/brand/
npm run brand:images:check    # assert those PNGs match the SVGs
npm run verify:agent-readiness
```

## Contributing

Personal project. External pull requests are not expected. See [CONTRIBUTING.md](CONTRIBUTING.md), [SECURITY.md](SECURITY.md), and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

Copyright (c) 2026 Marco Pontili. All rights reserved. See [LICENSE](./LICENSE).
