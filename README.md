# draw

Personal whiteboard at https://draw.marcopontili.com. Excalidraw with LaTeX
and Markdown inserts, native Mermaid diagrams, a system-aware light/dark theme,
and PNG/JPEG/SVG/PDF/`.excalidraw` export. Local-first PWA: no backend, no login,
no tracking. Built on [Excalidraw](https://github.com/excalidraw/excalidraw) (MIT).

## Dev

Node 20 (`nvm use`).

```bash
npm ci
npm run dev      # http://localhost:5173
npm run build    # production output in dist/
npm run preview  # serve dist/ on :4173
npm run lint     # ESLint, zero-warning gate
npm test         # Vitest unit tests
npm run test:e2e # Playwright smoke
```

## Layout

| Path | Description |
| --- | --- |
| `src/` | React app: `App.tsx`, components, `lib/` helpers |
| `src/lib/` | Export, LaTeX, Markdown, theme, persist adapters |
| `src/components/` | Insert/export menus and modals |
| `public/` | Static assets, `robots.txt`, Apache `.htaccess` template |
| `dist/` | Production output after `npm run build` |

Licensed under [MIT](./LICENSE).
