![draw: an Excalidraw whiteboard with LaTeX, Markdown and PDF export](.github/brand/readme-light.png#gh-light-mode-only)
![draw: an Excalidraw whiteboard with LaTeX, Markdown and PDF export](.github/brand/readme-dark.png#gh-dark-mode-only)

# draw

[![CI](https://github.com/marcop135/draw/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/marcop135/draw/actions/workflows/ci.yml)
[![Version](https://img.shields.io/badge/version-1.9.0-informational)](./CHANGELOG.md)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)

[Excalidraw](https://github.com/excalidraw/excalidraw) with typeset math, Markdown notes and PDF export. No account, no upload, works offline.

**Live app: [draw.marcopontili.com](https://draw.marcopontili.com)**

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/readme/desktop-dark.png">
    <img alt="draw on desktop: a sketched right triangle, a typeset LaTeX formula, a Markdown note and a Mermaid flowchart" src="docs/readme/desktop-light.png" width="73%">
  </picture>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/readme/mobile-dark.png">
    <img alt="The same board on a phone, with Insert, Export, theme and help in the bottom bar" src="docs/readme/mobile-light.png" width="21%">
  </picture>
</p>

## What it adds to Excalidraw

- **LaTeX**: KaTeX formulas placed as sharp images; double-click to edit.
- **Markdown**: sanitized GitHub-flavored notes placed as images; double-click to edit.
- **PDF and JPEG export**, next to PNG, SVG, `.excalidraw` and copy to clipboard.
- **Boards**: several named boards saved in the browser, with a warning if storage fills up.
- **Automatic theme** that follows the OS, with the browser bar tinted to match.
- **Phone layout** with 44px touch targets and Insert, Export, theme and help in the bottom bar.
- **Installed app** opens `.excalidraw` files and accepts shared images and scenes.
- **Agent bridge**: coding agents drive the board through `window.draw` ([docs](docs/agent-surface.md)).

## Privacy

Boards stay in the browser's IndexedDB; nothing is uploaded. KaTeX runs in strict mode with `trust: false`, Markdown goes through DOMPurify, and fonts and assets are self-hosted. Report vulnerabilities as described in [SECURITY.md](./SECURITY.md).

## Development

Requires Node.js 22 and npm.

```bash
git clone https://github.com/marcop135/draw.git
cd draw
npm ci
npm run dev        # http://localhost:5173
```

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server on port 5173 |
| `npm run build` | Type-check and build to `dist/` |
| `npm run preview` | Serve `dist/` on port 4173 |
| `npm run lint` | ESLint, zero warnings |
| `npm test` | Vitest unit tests |
| `npm run test:e2e` | Playwright smoke test |
| `npm run verify:agent-readiness` | Check the agent discovery files in `dist/` |
| `npm run assets:brand` | Render favicons and app icons from `public/favicon*.svg` |
| `npm run brand:images` | Render the README, og:image and GitHub social images (`brand:images:check` reports stale ones) |
| `npm run readme:shots` | Recapture the README screenshots (needs `npm run preview`) |

`dist/` deploys to any static host. On Apache, the bundled `.htaccess` sets the security and caching headers.

## Built with

| Layer | Stack |
| --- | --- |
| Frontend | React 19, TypeScript, Excalidraw, KaTeX, marked, DOMPurify, jsPDF |
| Framework and build | Vite, vite-plugin-pwa (Workbox) |
| Backend | None: a static single-page app, boards in IndexedDB |
| Server | Apache behind Cloudflare, deployed from GitHub Actions |

## Acknowledgements

Built on [Excalidraw](https://github.com/excalidraw/excalidraw) (MIT); thanks to the Excalidraw team for the editor.

## Contributing

Read [CONTRIBUTING.md](./CONTRIBUTING.md), then [report a bug](https://github.com/marcop135/draw/issues/new?template=01-bug-report.yml) or [request a feature](https://github.com/marcop135/draw/issues/new?template=02-feature-request.yml).

## Author

[Marco Pontili](https://marcopontili.com)

## License

[MIT](./LICENSE)
