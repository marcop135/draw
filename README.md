# draw.marcopontili.com

A free, open-source whiteboard at **https://draw.marcopontili.com**.

Built on [Excalidraw](https://github.com/excalidraw/excalidraw) with extras:

- **LaTeX** — type math, get a vector image on the canvas (powered by [KaTeX](https://katex.org/)).
- **Mermaid** — paste a flowchart, get native, editable Excalidraw shapes (via [`@excalidraw/mermaid-to-excalidraw`](https://github.com/excalidraw/mermaid-to-excalidraw)).
- **Markdown** — type Markdown, get a sanitized vector note on the canvas.
- **Export** — PNG, JPEG, SVG, and PDF download.
- **No login. No backend. No tracking.** Drawings live only in your browser's `localStorage` (Excalidraw's default).

## Architecture (one paragraph)

Pure static SPA: React + TypeScript built with Vite. The whole app is bundled
into `dist/` and FTP-synced to a shared host. Excalidraw fonts are copied into
`dist/fonts/` at build time and `window.EXCALIDRAW_ASSET_PATH` points at the
site root, so no runtime CDN calls are made — keeps the CSP `default-src 'self'`
honest. All "Insert" inputs (LaTeX, Mermaid, Markdown) are sandboxed: KaTeX
runs with `trust: false` and `strict: "error"`; Markdown is run through
`DOMPurify` before it ever lands in the DOM or in the inserted SVG;
Mermaid input is parsed into shape primitives by the official
`mermaid-to-excalidraw` parser, never injected as HTML.

## Develop

```bash
nvm use            # node 20
npm ci
npm run dev        # http://localhost:5173
```

## Build & preview production bundle

```bash
npm run build
npm run preview
```

Output lands in `dist/`, including `dist/.htaccess` (security headers + caching
for Apache hosts) and `dist/fonts/` (Excalidraw fonts copied from the package).

## Deploy

A push to `main` triggers `.github/workflows/deploy.yml`, which runs
lint → build → FTP-sync `dist/` to `/draw.marcopontili.com/` on the host.

Required GitHub Actions secrets:

| Secret | Used as |
|---|---|
| `FTP_HOST` | `server` |
| `FTP_USERNAME_PRODUCTION` | `username` |
| `FTP_PASSWORD_PRODUCTION` | `password` |

If your host supports FTPS, change `protocol: ftp` to `protocol: ftps` in the
workflow — strict upgrade for credential safety.

## Security model

- No backend, no auth, no PII, no DB → no server-side attack surface.
- CSP locked to `'self'` for scripts/styles/fonts/connections; `frame-ancestors 'none'`; `object-src 'none'`. Set via `dist/.htaccess`.
- All third-party-shaped inputs (LaTeX, Mermaid, Markdown) are sanitized before rendering. See `src/lib/latex.ts`, `src/lib/markdown.ts`, `src/lib/mermaid.ts`.
- Drawings persist in browser `localStorage` only — clearing site data wipes them. There is no cloud save and no shared collaboration server.

## Tech

- Excalidraw (drawing engine)
- React 18 + TypeScript
- Vite 5 (bundler)
- KaTeX (math rendering)
- marked + DOMPurify (Markdown rendering, sanitized)
- jsPDF (PDF wrapping)

## License

MIT — see [LICENSE](./LICENSE).
