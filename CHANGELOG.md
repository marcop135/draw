# Changelog

- **Format:** Based on [Keep a Changelog](https://keepachangelog.com).
- **Voice:** Use the imperative, like a commit message. Write add, fix, increase, force, not added, fixed, increased, forced.
- **Length:** Keep each bullet on one line, max 120 characters (link URLs do not count toward the cap, only the visible text does).
- **Links:** Add inline markdown links for related PRs, docs, and external references when they help the reader.

## [Unreleased]

## [1.11.0] - 2026-10-04

### Changed

- Pre-select the freedraw (pencil) tool when a board opens.
- Regroup the Export menu into full-row Scene, Image, Vector and PDF actions.
- Rewrite the README as a use-case story with Privacy and Security split and a commands doc.

## [1.10.1] - 2026-10-04

### Changed

- Bump KaTeX to 0.18.10 for LaTeX inserts.

## [1.10.0] - 2026-10-04

### Added

- Keep several named boards in IndexedDB, with a Boards dialog to create, open, rename and delete them.
- Reopen the last board on load, replacing the "Restore last session?" chip; the old autosave is copied in once.
- Warn with a download option when a board cannot be saved, instead of dropping the save silently.
- Reopen LaTeX and Markdown inserts for editing by double-click or Insert → Edit selected.
- Open `.excalidraw` files from the OS and accept shared images and scenes in the installed app.
- Tint the browser chrome to the canvas in light and dark, following the toggle, Safari 26 included.

### Changed

- Enlarge phone tap targets to 44px with 22px icons across the top, side and bottom bars.
- Link the menu credit to the Excalidraw and draw repos, in the text color and weight.
- Match the brand images' icon and heading to md2pdf: flat app mark, 70px Catamaran, solid ink.
- Raise the tagline contrast in the README banner and the GitHub social and OG images.
- Shorten the README to features, screenshots, privacy, development and the tech stack.

### Security

- Override Excalidraw's `sass` to 1.105 so `braces` (GHSA-vfj7-8cjw-p6xm) leaves the production tree.

## [1.9.0] - 2026-10-02

### Changed

- Rewrite the README around one board, with a light/dark banner and desktop and mobile screenshots.
- Add `npm run readme:shots` to re-capture the README screenshots in both themes.
- Redraw the README banner as a labeled draw window, in light and dark.
- Simplify the GitHub social and OG images to a light app mark, name and tagline that read at thumbnail size.
- Release draw under the MIT license.

### Fixed

- Keep superscripts, fractions and roots in inserted LaTeX by placing KaTeX's MathML instead of unstyled HTML.

## [1.8.1] - 2026-10-02

### Changed

- Keep the cPanel `.ftpquota` file out of the deploy's stale-file list and prune pass.

## [1.8.0] - 2026-10-02

### Changed

- Credit "Built on Excalidraw by marcop135" with both names linked, below For agents, both in smaller menu type.
- Long-cache only content-hashed assets and fonts; icons and the social image now refresh within a day.
- Purge the Cloudflare cache for draw after each production deploy, and list stale server files on every run.
- Move CI, deploy, and `.nvmrc` from Node 20, now end of life, to Node 22.

### Fixed

- Declare only the self-hosted Excalidraw fonts, ending hundreds of CSP errors from the esm.sh fallback on load.
- Route Excalidraw's deprecated `unload` listener to `pagehide` so Chrome stops flagging it and bfcache works.
- Serve the Excalidraw fonts on the dev server instead of an HTML fallback that fails to decode.
- Fail the deploy when the FTPS upload fails instead of reporting success.

### Security

- Verify the FTPS certificate, pin the SFTP host key, and refuse production deploys from branches other than main.
- Restrict workflow tokens to read-only contents and audit production dependencies in CI on develop and main.
- Send every security header on error responses too, and add COOP and `upgrade-insecure-requests` to the policy.
- Validate restored autosave data with Excalidraw's own restore before it reaches the canvas.

## [1.7.2] - 2026-10-01

### Changed

- Expand the README for the live private Excalidraw app and replace the MIT claim with proprietary licensing.

## [1.7.1] - 2026-10-01

### Changed

- Add SECURITY, CONTRIBUTING, Code of Conduct, issue and PR templates.

### Removed

- Drop the README banner image and its brand sources; keep social and OG only.

## [1.7.0] - 2026-10-01

### Added

- Restore og/twitter meta and add README, GitHub social and OG images from the repo-brand kit.
- Expose `window.draw` (`getScene`, `setScene`, `exportImage`) for coding agents.
- Add "For agents" to the hamburger menu and ship `llms.txt`, `auth.md`, `openapi.json`, and `.well-known` catalogs.

### Changed

- Move the favicon and app icons to md2pdf's deep sky gradient.
- Allow agent discovery files and social unfurl bots in `robots.txt`; add a `Content-Signal` line.
- Add `sharp` (dev), `brand:images`, `brand:images:check`, and `verify:agent-readiness`.
- Expand the README with badges, quick start, layout, and brand/agent script notes ([#101](https://github.com/marcop135/draw/pull/101)).

### Fixed

- Name the tab `draw · Whiteboard with LaTeX, Mermaid and Markdown` instead of the bare hostname.
- Render favicons with transparent corners, ship a 16/32/48 `favicon.ico`, and add a separate maskable icon.

## [1.6.3] - 2026-09-29

### Changed

- Bump the production group: `katex`, `marked`, `react`, and `react-dom` ([#98](https://github.com/marcop135/draw/pull/98)).
- Bump the development group: typescript-eslint, Prettier, `@types/node`, and `eslint-plugin-react-refresh` ([#98](https://github.com/marcop135/draw/pull/98)).

### Security

- Raise `dompurify` to `^3.4.16` (direct and overrides) ([#98](https://github.com/marcop135/draw/pull/98)).

## [1.6.2] - 2026-09-12

### Changed

- Bump the development group: Playwright, Vitest, typescript-eslint, Prettier, and `@types`.
- Bump `actions/checkout` to v7.0.1 and `actions/setup-node` to v7.0.0.
- Align `CLAUDE.md` and `siteMeta` comments with the private chrome (no GitHub toolbar, no public SEO/social tags).

### Security

- Raise `dompurify` to `^3.4.15` and pin overrides for `nanoid`, `mermaid`, `browserslist`, `fast-uri`, `js-yaml`, and `brace-expansion`.

## [1.6.1] - 2026-07-28

### Changed

- Bump the production group: `@fontsource/roboto`, `katex`, `marked`, `react`, and `react-dom` ([#77](https://github.com/marcop135/draw/pull/77)).
- Bump the dev-tooling group, 8 updates: Playwright, Prettier, Vitest, typescript-eslint, and `@types` ([#74](https://github.com/marcop135/draw/pull/74)).
- Bump `fast-uri` 3.1.2 to 3.1.4 ([#76](https://github.com/marcop135/draw/pull/76)).
- Bump `immutable` 4.3.8 to 4.3.9 ([#78](https://github.com/marcop135/draw/pull/78)).
- Bump `js-yaml` 4.2.0 to 4.3.0 ([#79](https://github.com/marcop135/draw/pull/79)).
- Bump `actions/checkout` to v7.0.0 ([#70](https://github.com/marcop135/draw/pull/70)).

### Security

- Pin `dompurify` `^3.4.12` via overrides to clear audit advisories.

## [1.6.0] - 2026-06-27

### Changed

- Slim the README to a personal note and delete `SECURITY.md`; the public contributor and vuln-reporting docs no longer apply.

### Removed

- Drop the toolbar GitHub icon and the "Source code" hamburger-menu item; the repo is now private and personal.
- Remove the social-preview card, the Open Graph/Twitter meta, the canonical link, and the vite social-preview inject plugin.
- Remove the README/brand artifact specs, Playwright readme configs, and the hero/gif render scripts, plus their `capture:*` npm scripts.

## [1.5.1] - 2026-06-23

### Changed

- Bump `marked` 18.0.4 to 18.0.5 in the production group ([#62](https://github.com/marcop135/draw/pull/62)).
- Bump the dev-tooling group, 9 updates: Playwright, Prettier, Vitest, typescript-eslint, and `@types` ([#68](https://github.com/marcop135/draw/pull/68)).

## [1.5.0] - 2026-06-09

### Changed

- Show the app name beside the version in the hamburger menu (`draw v1.5.0`).
- Correct the README usage, project structure, and tech-stack notes to reflect Mermaid moving to Excalidraw's native menu.

### Removed

- Drop the custom Insert > Mermaid modal and adapter; use Excalidraw's built-in Mermaid to Excalidraw (More tools menu), which parses the same diagrams into native editable shapes.
- Drop the GitHub link from the crowded phone bottom bar; it stays in the hamburger menu and on the desktop toolbar.
- Drop the now-unused `@excalidraw/mermaid-to-excalidraw` direct dependency; Excalidraw still bundles its own copy.

### Fixed

- On phones, keep the action bar above Excalidraw's bottom bar while editing so Export stays reachable in any tool state.

## [1.4.6] - 2026-06-05

### Fixed

- Show our help (?) button only when Excalidraw hides its own, so it no longer doubles on mid-size screens.
- Match Excalidraw's mobile breakpoint on landscape phones so the action bar no longer hides behind the bottom bar.

## [1.4.5] - 2026-06-04

### Changed

- Bump `actions/checkout` to v6.0.3 and `actions/setup-node` to v6.4.0 so both run on Node 24 before GitHub drops Node 20 from the runners.

## [1.4.4] - 2026-06-04

### Changed

- Load Roboto from the latin-only `@fontsource` entrypoints, dropping the unused cyrillic, greek, vietnamese, and latin-ext woff2 subsets.
- Disable the `modulePreload` polyfill since the es2022 build target supports `<link rel="modulepreload">` natively.
- Trap focus inside the Insert modals, label them via `aria-labelledby`, and return focus to the opener on close.
- Close the Insert and Export menus on Escape or outside click, and add trigger `aria-label`s so the icon-only bar stays named below 1300px.
- Honour `prefers-reduced-motion` by neutralising app-chrome transitions, and darken `--ui-muted` to clear WCAG AA on white.
- Add `role="menuitem"` to the Insert, Export, and PDF-orientation items, with explicit labels on the PDF orientation pills.
- Add `rel=canonical`, `og:url`, and iOS/PWA web-app meta to `index.html` and expose `SITE_CANONICAL_URL`; the deliberate noindex stays.
- Add `CLAUDE.md` with codebase orientation, the release flow, and repo gotchas.
- Add `scripts/audit-shots.mjs` to capture baseline/after screenshots across breakpoints and themes for visual-regression review.

## [1.4.3] - 2026-06-02

### Fixed

- Stop autosave from wiping the saved scene while a restore is pending, so a reload no longer silently loses unsaved work.

## [1.4.2] - 2026-06-02

### Changed

- Credit Excalidraw as the upstream library and md2pdf as a source of merged work; drop the author section.
- Bump dependencies to their latest in-range versions.

## [1.4.1] - 2026-06-02

### Changed

- Align the action bar with Excalidraw's top toolbar above 1024px and its footer controls below.
- Centre the mobile lock/hand strip vertically on the right edge.
- Trim the Help dialog links to a single Excalidraw Documentation link, dropping blog, issues, and YouTube.
- Align the menu's Canvas background label and swatch row with the item-icon column above them.
- Note the automatic system/light/dark theme in the README, site description, and repo metadata.

### Fixed

- On phones, overlay the action bar on Excalidraw's bottom bar and hide it while editing so the two never collide.
- Add a Help (?) button beside the GitHub link on phones, where Excalidraw drops its footer help icon.
- Centre the action bar's popups over the bar on narrow screens so they no longer clip off the left edge.
- Show an orientation hint under the toolbar on phones, replacing Excalidraw's desktop-only welcome arrows.

## [1.4.0] - 2026-06-02

### Added

- Default to the selection tool so the welcome hint overlay shows on an empty canvas, matching Excalidraw.
- Move About into the hamburger menu (Source code, Built on Excalidraw, version) and retire the standalone version chip and About modal.

### Changed

- Keep the welcome hint arrows on short and landscape viewports, and mute their dark-mode colour to match the light-mode contrast.
- Match the floating bar to Excalidraw's island (solid background, `--shadow-island`, 8px radius) with flat icon buttons of one size.
- Rebuild the README demo gif to show shapes, colours, LaTeX, Mermaid, and the theme toggle.

### Fixed

- Wrap the lazy LaTeX, Mermaid, Markdown, and About panels in an error boundary so a failed chunk load shows a recoverable notice instead of white-screening the whole app.
- Reload once on `vite:preloadError` so a stale service-worker chunk after a deploy recovers automatically instead of crashing on first open.
- Serve hashed JS/CSS via `StaleWhileRevalidate` (was `CacheFirst`) so a new deploy's chunks self-heal; keep fonts on `CacheFirst`.
- Move the floating bar to bottom-centre below 1024px so it no longer overlaps the centered toolbar or the side panels.
- Lower the floating bar below Excalidraw's UI layer so its menus and dialogs render above the bar instead of being covered.

## [1.3.0] - 2026-06-01

### Added

- Add debounced scene autosave to `localStorage`; on reload show a top-left chip offering Restore or Discard.
- Add a toolbar theme chip cycling `system` -> `light` -> `dark`, persisted and tracking OS theme via `matchMedia`.
- Open an About modal from the version chip with version, repo, changelog, and MIT license links.
- Add Copy PNG to clipboard in the Export popup; disable when `ClipboardItem` is unavailable.
- Add PDF orientation auto, portrait, and landscape as three one-click pills in a single PDF export row.

### Changed

- Show the version chip at all viewport widths above 420px; previously the 1300px icon-only rule hid it.
- Move the theme chip between Export and the GitHub corner link in the floating toolbar.
- Add `version-update:semver-major` to the [Dependabot ignore list](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot-yml-file#ignore) so single-major PRs stop opening.
- Bump `dompurify` to 3.4.7, `marked` to 18.0.4, and `vite` to 6.4.3.
- Bump 7 dev dependencies via Dependabot group PR ([#45](https://github.com/marcop135/draw/pull/45)).

### Security

- Override `brace-expansion` `^5.0.6` (scoped) and `ws` `^8.20.1` to clear [GHSA-jxxr-4gwj-5jf2](https://github.com/advisories/GHSA-jxxr-4gwj-5jf2) and [GHSA-58qx-3vcg-4xpx](https://github.com/advisories/GHSA-58qx-3vcg-4xpx).

## [1.2.0] - 2026-05-22

### Changed

- Hide the built-in Library sidebar trigger and the welcome-screen logo, tagline, and Open/Help menu so the canvas starts clean; keep the three arrow hints (menu, toolbar, help) for first-time orientation.
- Make the floating toolbar responsive: row 2 (`top: 72px`) below 870px, icon-only on row 1 from 870-1299px, full labels at 1300px+; the mobile bottom-right layout keeps the icon-only strip so it matches the desktop chrome.
- Add `PlusSquare` and `Download` Bootstrap-icons as top-level glyphs on the Insert and Export buttons, wrapping each label in `.app-btn-label` so it can be hidden in icon-only mode without losing meaning.
- Pre-select the freedraw (pencil) tool on first load via `initialData.appState.activeTool`.

### Fixed

- Move the dark-mode class from `#root` plus a `useEffect` to an `.app-shell` wrapper so the design-token CSS variables flip in the same React commit instead of one frame later.

## [1.1.0] - 2026-05-22

### Changed

- Replace `@phosphor-icons/react` with self-hosted `bootstrap-icons`; centralize inline SVG-component wrappers in `src/components/icons.tsx` so only the paths the app uses are shipped (chevron-down, github, pencil-square, filetype-png/jpg/svg/pdf, braces-asterisk, diagram-3, markdown).
- Introduce shared design tokens on `#root` (`--ui-radius`, `--ui-bg`, `--ui-border`, `--ui-fg`, `--ui-accent-bg`, `--ui-accent-fg`, `--ui-shadow`, `--ui-btn-size`); `#root.dark` flips the palette in one place. Toolbar, buttons, GitHub link, modals, and dropdowns all consume the same variables so the three bars read as one system.
- Match Excalidraw's selected-tool lavender chip (`#e0dfff` / `#6965db`) on the active/open state of every floating `app-btn` so the custom toolbar visually pairs with the stock toolbar's selected pencil.
- Bump icon size to 18px in the toolbar and 20px in dropdown rows; tighten gaps, paddings, and transitions for a consistent hover/focus/active feel.
- Bump `react`/`react-dom` to 19.2.6, `marked` to 18.0.3, `katex` to 0.16.47, `mermaid` to 11.15.0, `@babel/plugin-transform-modules-systemjs` to 7.29.4, and `fast-uri` to 3.1.2 via Dependabot (#37, #38, #39, #40).

### Fixed

- Suppress the default Excalidraw welcome-screen hint strip (book/lock/hand) on the right edge by rendering an empty `<WelcomeScreen />`, so it no longer collides with the floating top-right toolbar.

## [1.0.6] - 2026-05-08

### Added

- Generate a dedicated 1280x640 social preview card (`public/social-preview.png`, ~40 KB) sized for GitHub's repo social image (max 1 MB) and matching the Open Graph spec.
- Ship cross-browser favicons: `favicon-16x16.png`, `favicon-32x32.png`, `favicon-48x48.png`, `apple-touch-icon.png` (180), and `android-chrome-192x192.png` / `512x512.png`, plus a PNG-in-ICO `favicon.ico` for legacy `/favicon.ico` requests.

### Changed

- Add `og:image:width`/`height`/`type`/`alt` and `twitter:image:alt` meta tags; reference the new favicon set from `index.html` and add the PWA Android icons to the manifest.

### Removed

- Drop the README banner copy prebuild step; the new `npm run assets:brand` (`scripts/render-brand-assets.mjs`) regenerates the social card and favicon variants on demand from `assets/social-preview.svg` and `public/favicon.svg` via headless Chromium, with the rendered PNGs and ICO committed to `public/` so CI builds don't need a browser.

## [1.0.5] - 2026-05-08

### Added

- Add a version chip in the app toolbar that reads from `package.json`; hide it under 420px to save thumb space.

### Changed

- Replace the inline Octocat SVG and chevron glyphs with Phosphor icons in Insert, Export, and the GitHub link.
- Tighten toolbar buttons to 12px font, 7px by 12px padding, 36px height, with a 13px / 40px touch-friendly bump under 640px.
- Self-host Roboto via `@fontsource/roboto` so the Excalidraw UI, modal textareas, and markdown SVG never hit Google's CDN.
- Centralize Phosphor icon imports in `src/components/icons.tsx` so each icon is tree-shaken individually.
- Alphabetize devDependencies in `package.json` (`jsdom`, `vite-plugin-pwa`, `vitest`).

### Removed

- Drop the CI badge from the README; the Actions tab is one click away and the badge added noise.

## [1.0.4] - 2026-05-02

### Changed

- Tighten the README: drop the Deploy section, shorten the lede and Features, collapse Installation, trim Security and Usage.
- Add Contributing, Author, and License sections at the end of the README, with Contributing right before Author.

## [1.0.3] - 2026-05-01

### Changed

- Move the GitHub repo link from a fixed bottom-left control into the floating toolbar after Export, with chip styling matched.
- Update README usage and project-structure notes to reflect the new GitHub link placement.

## [1.0.2] - 2026-05-01

### Changed

- Move the source repo link from the floating toolbar to a fixed bottom-left corner control with safe-area padding.
- Replace em dashes with colons in `index.html`'s Open Graph and Twitter descriptions for consistency with site copy.
- Normalize em dashes to colons or periods across configs, scripts, public assets, source, and prior CHANGELOG headings.
- Restructure the README with a `draw` heading, centered banner and demo GIF, and clearer install, usage, and deploy sections.
- Expand the npm package `description` to match the public positioning of the app.
- Update the README GIF capture to draw rectangle, ellipse, freedraw, and arrow on the primary canvas.

## [1.0.1] - 2026-04-30

### Changed

- Roll back the Material 3 mobile overrides: custom FABs, bottom sheets, Excalidraw chrome restyling, and touch targets.

### Removed

- Drop the `lucide-react` and `@fontsource/roboto` dependencies that the mobile theme depended on.

## [0.2.0] - 2026-04-27

### Added

- Add `.excalidraw` export that round-trips scenes via `serializeAsJSON`, alongside PNG, JPEG, SVG, and PDF exports.
- Ship as an installable PWA with Workbox precache and runtime caching for offline use after the first visit.

### Changed

- Move the floating toolbar to bottom-right under 640px so it stops colliding with Excalidraw's mobile top bar.
- Flip Insert and Export popups upward on mobile so they open relative to their button instead of the page.
- Bump touch targets to 40px+ and textareas to 16px font on mobile to suppress iOS auto-zoom.
- Use `100dvh` and full width for modals on phones so the keyboard doesn't push content off-screen.
- Bump direct `@excalidraw/mermaid-to-excalidraw` from `^1.1.2` to `^2.2.2`, dropping a duplicate copy of mermaid, uuid, and nanoid.
- Mark `sw.js`, `workbox-*.js`, and `manifest.webmanifest` as no-cache in `.htaccess` so the PWA auto-update flow works.
- Add `dependabot.yml` for weekly grouped npm and monthly grouped Actions updates against `develop`, ignoring deps already pinned via overrides.

### Security

- Add `worker-src 'self'` and `manifest-src 'self'` to CSP so the service worker and manifest are explicitly allowed.
- Pin `serialize-javascript ^7.0.5` in `overrides` to clear the high-severity Workbox-build advisory.

## [0.1.2] - 2026-04-27

### Changed

- Verify production responds with HTTP 200 and the CSP, robots, and HTML headers from `dist/.htaccess` reach clients.

### Fixed

- Set FTP `server-dir: ./` and `protocol: ftps` so deploy lands in the chroot'd document root instead of nesting deeper.
- Bump `SamKirkland/FTP-Deploy-Action` to `v4.4.0` to match the known-good setup from a sibling project.

## [0.1.1] - 2026-04-25

### Security

- Bump Vite `^5.4.8` to `^6.4.2` to clear GHSA-4w7w-66w2-5vf9 (path traversal in optimized-deps `.map` handling).
- Pin patched `dompurify`, `nanoid`, `uuid`, `esbuild`, and `lodash-es` via `overrides`; `npm audit` now reports zero vulnerabilities.
- Add `public/robots.txt` blocking common crawlers and AI bots, plus `<meta name="robots">` and an `X-Robots-Tag` header.

## [0.1.0] - 2026-04-25

### Added

- Initial release: Excalidraw whiteboard with sandboxed LaTeX (KaTeX), Mermaid, and Markdown inserts plus PNG, JPEG, SVG, PDF, `.excalidraw` exports.
- Lazy-load Insert modals via `React.lazy` so the Mermaid parser and KaTeX only ship to users who click Insert.
- Self-host Excalidraw fonts so CSP can stay locked to `'self'` with no third-party runtime fetches.

### Changed

- Hide the Excalidraw links submenu (GitHub, X, Discord) via a custom `<MainMenu>` so it stops shipping with the toolbar.
- Add lint, build, test, and FTP deploy GitHub Actions workflows; lint is gated at `--max-warnings=0`.

### Security

- Ship `dist/.htaccess` with a hard CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, and HSTS.
