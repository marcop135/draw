# draw

[![CI](https://github.com/marcop135/draw/actions/workflows/ci.yml/badge.svg)](https://github.com/marcop135/draw/actions/workflows/ci.yml)

<p align="center">
  <img src="docs/readme-banner.png" alt="draw whiteboard: illustration banner" width="840" />
</p>

**Live:** [Open the app][deployed]

Free whiteboard powered by **native Excalidraw** tools, with **LaTeX** ([KaTeX](https://katex.org/)), **Mermaid** turned into editable shapes, and **Markdown** inserts that are **sanitized** before rendering. Export to **PNG**, **JPEG**, **SVG**, **PDF**, or **`.excalidraw`**. Works **offline as a PWA** after the first load; there is **no separate backend** and **no login**. **Privacy:** your scenes stay in **`localStorage`** in your browser tab; they are not uploaded to a server owned by this repo.

<p align="center">
  <img src="docs/readme-demo.gif" alt="draw whiteboard: canvas demo with shapes and ink" width="840" />
</p>

## Acknowledgements

This project is **not** a fork of **[realdennis/md2pdf](https://github.com/realdennis/md2pdf)** (MIT). Thanks to Dennis for the original app; this repo borrowed a practical **FTP plus GitHub Actions** deploy pattern from that ecosystem.

This codebase stands on its own: **[Excalidraw](https://github.com/excalidraw/excalidraw)** for the canvas, plus local insert and export wiring, static hosting headers, tests, and ongoing maintenance.

---

## Features

- Full **Excalidraw** sketching (drawing, selection, themes, load/save scene, undo)
- **LaTeX**: type math, insert a vector image on the canvas (KaTeX)
- **Mermaid**: paste a diagram, insert **native editable** shapes (`@excalidraw/mermaid-to-excalidraw`)
- **Markdown**: convert to a sanitized vector note (`marked` plus DOMPurify)
- **Export**: `.excalidraw`, PNG, JPEG, SVG, PDF
- **PWA**: installable; Workbox precaches shell and assets for repeat visits
- **Client-only**: no accounts, no API, no telemetry in this app layer
- Search engine opt-out (`noindex`, `robots.txt`)

## Tech stack

- **React 18** and **TypeScript** with **Vite 6**
- **@excalidraw/excalidraw**
- **KaTeX**, **@excalidraw/mermaid-to-excalidraw**, **marked**, **DOMPurify**, **jsPDF**
- **vite-plugin-pwa** (Workbox) for the service worker
- **Vitest** and **Playwright** for automated tests

## Security

- **Local-first**: drawings live in browser `localStorage` only; clearing site data wipes them
- **Sandboxed inserts**: KaTeX with strict defaults, Markdown through DOMPurify, Mermaid parsed to shapes (not raw HTML)
- **HTTP hardening**: CSP and related headers shipped in `dist/.htaccess` for Apache-style hosts

See [SECURITY.md](./SECURITY.md) if you think you found a vulnerability.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/marcop135/draw.git
   cd draw
   ```

2. Install dependencies (Node 20):

   ```bash
   nvm use
   npm ci
   ```

3. Run locally:

   ```bash
   npm run dev
   ```

   Then open [http://localhost:5173](http://localhost:5173).

4. Production build:

   ```bash
   npm run build
   ```

   Output is in `dist/`. The build copies **`public/.htaccess`** into **`dist/`** for recommended security headers and caching on Apache.

## Usage

- Use Excalidraw’s built-in tools for drawing, text, and shapes.
- Open **Insert** in the floating toolbar (top-right on desktop; moves on small screens) to add **LaTeX**, **Mermaid**, or **Markdown**.
- Use **Export** to download **PNG**, **JPEG**, **SVG**, **PDF**, or **`.excalidraw`**.
- Use the **Excalidraw** menu (hamburger) for theme, background, **Load** scene, and defaults.
- Tap the **rounded GitHub icon** in the **bottom-left** corner to open the source repository.

## Deploy

Production deploy is manual: run [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) from **Actions** (see workflow comments for TLS and path notes). Required secrets:

| Secret | Role |
| --- | --- |
| `FTP_HOST` | server |
| `FTP_USERNAME_PRODUCTION` | username |
| `FTP_PASSWORD_PRODUCTION` | password |

## Contributing

Issues and pull requests are welcome. CI runs lint, production build, Vitest, and Playwright smoke tests on `main` and PRs.

## Project structure

| Path | Description |
| --- | --- |
| `src/` | React app: `App.tsx`, components, `lib/` helpers |
| `src/lib/` | Export, LaTeX, Markdown, Mermaid adapters |
| `src/components/` | Insert and export menus, modals, GitHub corner link |
| `public/` | Static assets, `robots.txt`, Apache `public/.htaccess` template |
| `e2e/` | Playwright tests (smoke plus optional readme artefact specs) |
| `dist/` | Production output after `npm run build` |

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Typecheck and production build |
| `npm run preview` | Preview `dist/` locally |
| `npm run test` | Vitest unit tests |
| `npm run test:e2e` | Playwright smoke suite |
| `npm run lint` | ESLint |

## License

Licensed under the [MIT](./LICENSE) License.

[deployed]: https://draw.marcopontili.com
