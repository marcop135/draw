# draw

<p align="center">
  <img src="docs/readme-banner.png" alt="draw whiteboard: illustration banner" width="840" />
</p>

<p align="center">
  <img src="docs/readme-demo.gif" alt="draw whiteboard: canvas demo with shapes and ink" width="840" />
</p>

Live app: https://draw.marcopontili.com

Excalidraw whiteboard with LaTeX and Markdown inserts, plus native Mermaid diagrams. Local-first PWA, no backend, no login.

## Acknowledgements

This app starts from the **[Excalidraw](https://github.com/excalidraw/excalidraw)** library (MIT), freely adding features and improvements on top, and merging part of the work done for **[md2pdf](https://github.com/marcop135/md2pdf)**.

---

## Features

- Full **Excalidraw** sketching (drawing, selection, themes, load/save scene, undo)
- **Automatic theme**: follows your system light/dark setting, with a one-tap toolbar toggle to force light or dark
- **LaTeX** math, **Mermaid** diagrams as native editable shapes, sanitized **Markdown** notes
- **Export** to `.excalidraw`, PNG, JPEG, SVG, PDF
- **PWA**: installable; Workbox precaches shell and assets for offline use

## Tech stack

- **React 18** and **TypeScript** with **Vite 6**
- **@excalidraw/excalidraw** (bundles **mermaid-to-excalidraw** for native diagram import)
- **KaTeX**, **marked**, **DOMPurify**, **jsPDF**
- **vite-plugin-pwa** (Workbox) for the service worker
- **Vitest** and **Playwright** for automated tests

## Security

- **Local-first**: drawings live in browser `localStorage`; clearing site data wipes them
- **Sandboxed inserts**: KaTeX strict mode, Markdown through DOMPurify, Mermaid parsed to shapes (not raw HTML)
- **HTTP hardening**: CSP and related headers shipped in `dist/.htaccess`

See [SECURITY.md](./SECURITY.md) for vulnerability reports.

## Installation

Requires Node 20.

```bash
git clone https://github.com/marcop135/draw.git
cd draw
nvm use
npm ci
npm run dev      # http://localhost:5173
npm run build    # production output in dist/
```

## Usage

- **Insert** menu (floating toolbar): add **LaTeX** or **Markdown**.
- **Mermaid**: Excalidraw's **More tools** menu -> **Mermaid to Excalidraw** turns diagrams into editable shapes.
- **Export** menu: download **PNG**, **JPEG**, **SVG**, **PDF**, or **`.excalidraw`**.
- **Theme** toggle (floating toolbar): cycle automatic (follows the OS) -> light -> dark; the choice is remembered.
- **Excalidraw** menu (hamburger): theme, background, **Load** scene, defaults.

## Project structure

| Path | Description |
| --- | --- |
| `src/` | React app: `App.tsx`, components, `lib/` helpers |
| `src/lib/` | Export, LaTeX, Markdown adapters |
| `src/components/` | Insert and export menus, modals, GitHub repo link |
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

## 🤝 Contributing

Contributions welcome! CI runs lint, production build, Vitest, and Playwright smoke tests on `main` and PRs.

- 🐛 Found a bug? [Open an issue](https://github.com/marcop135/draw/issues)
- 💡 Have a feature request? [Open an issue](https://github.com/marcop135/draw/issues)
- 📝 Want to contribute? Fork the repo and open a PR

## 📝 License

Licensed under the [MIT](./LICENSE) License.
