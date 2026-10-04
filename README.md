![draw: an Excalidraw whiteboard with LaTeX, Markdown and PDF export](.github/brand/readme-light.png#gh-light-mode-only)
![draw: an Excalidraw whiteboard with LaTeX, Markdown and PDF export](.github/brand/readme-dark.png#gh-dark-mode-only)

# draw

You need a whiteboard for a sketch, a formula, a note, or a quick flowchart. Open the app, draw on the canvas, drop in LaTeX or Markdown when you need them, and export when you are done. No account, no upload, and it keeps working offline.

**Live app: [draw.marcopontili.com](https://draw.marcopontili.com)**

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/readme/desktop-dark.png">
    <img alt="Desktop: a sketched right triangle, a typeset LaTeX formula, a Markdown note and a Mermaid flowchart" src="docs/readme/desktop-light.png" width="73%">
  </picture>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/readme/mobile-dark.png">
    <img alt="Mobile: the same board on a phone, with Insert, Export, theme and help in the bottom bar" src="docs/readme/mobile-light.png" width="21%">
  </picture>
</p>

<p align="center"><strong>Desktop</strong> (left) · <strong>Mobile</strong> (right)</p>

## How it works

1. Sketch on the [Excalidraw](https://github.com/excalidraw/excalidraw) canvas: shapes, arrows, freehand, text.
2. Use **Insert** for LaTeX formulas, Markdown notes, or Mermaid diagrams when a sketch alone is not enough. Double-click an inserted image to edit its source.
3. Export as PNG, JPEG, SVG, PDF, or `.excalidraw`, or copy the scene to the clipboard.

Boards autosave in the browser. On a phone, Insert, Export, theme and help sit in the bottom bar with 44px touch targets. The app follows your system theme, or pick light or dark from the toolbar.

## What you get

- **LaTeX**: KaTeX formulas placed as sharp images; double-click to edit.
- **Markdown**: sanitized GitHub-flavored notes placed as images; double-click to edit.
- **PDF and JPEG export**, next to PNG, SVG, `.excalidraw` and copy to clipboard.
- **Named boards** saved in the browser, with a warning if storage fills up.
- **Installable app** that opens `.excalidraw` files and accepts shared images and scenes.
- **Agent bridge**: coding agents drive the board through `window.draw` ([docs](docs/agent-surface.md)).

## Privacy

Boards stay in the browser's IndexedDB; nothing is uploaded.

## Security

KaTeX runs in strict mode with `trust: false`, Markdown goes through DOMPurify, and fonts and assets are self-hosted. Report vulnerabilities as described in [SECURITY.md](./SECURITY.md).

## Built with

| Layer | Stack |
| --- | --- |
| Frontend | React 19, TypeScript, Excalidraw, KaTeX, marked, DOMPurify, jsPDF |
| Framework and build | Vite, vite-plugin-pwa (Workbox) |
| Backend | None: a static single-page app, boards in IndexedDB |
| Server | Apache behind Cloudflare, deployed from GitHub Actions |

## Development

```bash
git clone https://github.com/marcop135/draw.git
cd draw
npm ci
npm run dev        # http://localhost:5173
```

More commands: [docs/commands.md](docs/commands.md).

## Contributing

Read [CONTRIBUTING.md](./CONTRIBUTING.md), then [report a bug](https://github.com/marcop135/draw/issues/new?template=01-bug-report.yml) or [request a feature](https://github.com/marcop135/draw/issues/new?template=02-feature-request.yml).

## Authors

[Marco Pontili](https://marcopontili.com) and the [Excalidraw](https://github.com/excalidraw/excalidraw) contributors

## License

[MIT](./LICENSE). [Excalidraw](https://github.com/excalidraw/excalidraw) is MIT as well.
