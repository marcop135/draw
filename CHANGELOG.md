# Changelog

All notable changes to this project are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and
this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] — 2026-04-27

### Added

- **`.excalidraw` export.** New format alongside PNG/JPEG/SVG/PDF that
  round-trips: open it later via Excalidraw's "Open" menu and you're back
  exactly where you left off, including images and styles. Uses
  `serializeAsJSON` from `@excalidraw/excalidraw`. (`src/lib/export.ts`,
  `src/components/ExportMenu.tsx`)
- **PWA / installable web app.** `vite-plugin-pwa` generates a service
  worker (Workbox) that precaches the HTML shell + main bundles and
  runtime-caches `/assets/` and `/fonts/`. The site can be installed and
  works offline once visited. Web App Manifest at `/manifest.webmanifest`,
  `display: standalone`, brand colours wired up.
- **Mobile UX.**
  - Floating toolbar moves to bottom-right on viewports ≤640px so it no
    longer collides with Excalidraw's own mobile top-bar.
  - Insert/Export popups now flip up on mobile (relative to their button,
    not page).
  - Touch targets bumped to 40px+ on mobile and `font-size: 16px` on
    textareas to suppress iOS auto-zoom.
  - Modals use `100dvh` and full width on phones.
- `.github/dependabot.yml` — weekly grouped npm + monthly grouped
  GitHub Actions updates, targeting `develop`. Transitive deps already
  pinned via `overrides` are ignored to keep the noise out.

### Changed

- `@excalidraw/mermaid-to-excalidraw` direct dep `^1.1.2 → ^2.2.2`,
  matching the version Excalidraw 0.18 already bundles internally. This
  drops a duplicate copy plus its older `mermaid 10.9.4`, `uuid 9`, and
  `nanoid 4` chains. `npm ls @excalidraw/mermaid-to-excalidraw` now
  shows a single deduped `2.2.2`.

### Security

- CSP gains `worker-src 'self'` and `manifest-src 'self'` for the
  service worker + manifest.
- Cache-control rules in `dist/.htaccess` updated so `sw.js`,
  `workbox-*.js`, and `manifest.webmanifest` are no-cache (otherwise the
  PWA auto-update flow stalls).
- Added `serialize-javascript ^7.0.5` to the `overrides` block (clears
  the high-severity Workbox-build advisory pulled in transitively by
  `vite-plugin-pwa`). `npm audit` still reports 0 vulnerabilities.

## [0.1.2] — 2026-04-27

### Fixed

- **Deploy works.** Switched the FTP step to mirror the working `md2pdf` setup:
  `server-dir: ./` (the production FTP user is chroot'd directly into the
  domain's document root, so absolute paths were nesting an extra level deep
  and Apache was serving the host-default 404), `protocol: ftps` with
  `security: loose`, and bumped `SamKirkland/FTP-Deploy-Action` to `v4.4.0`.

### Verified

- `https://draw.marcopontili.com` responds with HTTP 200, our `index.html`,
  our `/robots.txt`, and the `Content-Security-Policy` header from
  `dist/.htaccess` — all three layers of the privacy/security posture intact.

## [0.1.1] — 2026-04-25

### Added

- `public/robots.txt` with `Disallow: /` for `User-agent: *` plus explicit
  blocks for GPTBot, ChatGPT-User, OAI-SearchBot, ClaudeBot, Claude-Web,
  anthropic-ai, Google-Extended, GoogleOther, PerplexityBot, Perplexity-User,
  CCBot, Bytespider, Meta-ExternalAgent, Applebot-Extended, cohere-ai,
  Diffbot, PetalBot, Amazonbot, DuckAssistBot, YouBot, Omgilibot, SemrushBot,
  AhrefsBot, MJ12bot, ImagesiftBot, TimpiBot.
- `<meta name="robots|googlebot|bingbot" content="noindex, nofollow,
  noarchive, nosnippet, noimageindex">` in `index.html`.
- `X-Robots-Tag` HTTP header in `dist/.htaccess` covering non-HTML assets.

### Changed

- Bumped `vite` `^5.4.8 → ^6.4.2` (clears GHSA-4w7w-66w2-5vf9, path traversal
  in optimized-deps `.map` handling).
- Added npm `overrides` to force patched versions of transitive deps that
  Mermaid/Excalidraw drag in:
  - `dompurify ^3.4.1` (clears 13 DOMPurify XSS-bypass advisories)
  - `nanoid ^5.1.9`
  - `uuid ^14.0.0`
  - `esbuild ^0.25.0`
  - `lodash-es ^4.18.1` (post the `<=4.17.23` prototype-pollution advisories)

### Security

- `npm audit` reports **0 vulnerabilities** after the upgrades and overrides.

## [0.1.0] — 2026-04-25

### Added

- Initial release: Excalidraw-based drawing web app at
  `https://draw.marcopontili.com`.
- Insert flows (each input is sandboxed before render):
  - **LaTeX** via KaTeX (`trust: false`, `strict: "error"`).
  - **Mermaid** via `@excalidraw/mermaid-to-excalidraw` (parsed to shapes,
    no HTML injection path).
  - **Markdown** via `marked` + DOMPurify.
- Export flows: PNG, JPEG, SVG, PDF (the latter via `jspdf`).
- Self-hosted Excalidraw fonts (no third-party runtime calls; CSP can stay
  locked to `'self'`).
- `dist/.htaccess` ships a hard CSP, X-Frame-Options, X-Content-Type-Options,
  Referrer-Policy, Permissions-Policy, and HSTS.
- Insert modals (LaTeX/Mermaid/Markdown) lazy-loaded via `React.lazy`, so the
  Mermaid parser etc. only ship to clients that click "Insert".
- Excalidraw "Excalidraw links" submenu (GitHub/X/Discord) hidden via a
  custom `<MainMenu>`.

### Tooling

- React 18 + TypeScript + Vite, ESLint with `--max-warnings=0` gate, Prettier.
- GitHub Actions workflow that lints, builds, then FTP-syncs `dist/` on every
  push to `main`.
