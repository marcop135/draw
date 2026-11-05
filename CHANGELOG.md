# Changelog

- **Format:** Based on [Keep a Changelog](https://keepachangelog.com).
- **Voice:** Use the imperative, like a commit message. Write add, fix, increase, force, not added, fixed, increased, forced.
- **Length:** Keep each bullet on one line, max 120 characters (link URLs do not count toward the cap, only the visible text does).
- **Links:** Add inline markdown links for related PRs, docs, and external references when they help the reader.

## [Unreleased]

### Changed

- Check for npm updates monthly instead of weekly.

### Fixed

- Keep Safari's Adaptive Dark Mode from darkening the app when the light theme is chosen ([#192](https://github.com/marcop135/whiteboard/pull/192), [#191](https://github.com/marcop135/whiteboard/issues/191)).

## [1.13.1] - 2026-11-03

### Security

- Update Vite to 6.4.5 ([#166](https://github.com/marcop135/whiteboard/pull/166)).
- Update fast-uri to 3.1.9 ([#180](https://github.com/marcop135/whiteboard/pull/180)).
- Update serialize-javascript to 7.1.4 ([#186](https://github.com/marcop135/whiteboard/pull/186)).

## [1.13.0] - 2026-10-30

### Added

- Make `draw-scene` discoverable by supported coding tools ([#182](https://github.com/marcop135/whiteboard/pull/182), [#181](https://github.com/marcop135/whiteboard/issues/181)).

## [1.12.6] - 2026-10-23

### Changed

- Link the README banner to the live app ([#161](https://github.com/marcop135/whiteboard/pull/161)).
- Add an Author section to the README ([#161](https://github.com/marcop135/whiteboard/pull/161)).

### Security

- Update DOMPurify to 3.4.17 ([#161](https://github.com/marcop135/whiteboard/pull/161)).
- Update Mermaid's bundled KaTeX to 0.18.2 or later ([#161](https://github.com/marcop135/whiteboard/pull/161)).
- Update Vitest to 4.1.12 ([#161](https://github.com/marcop135/whiteboard/pull/161)).
- Update dev-only brace-expansion to 1.1.21 and 2.1.7 ([#161](https://github.com/marcop135/whiteboard/pull/161)).

## [1.12.5] - 2026-10-21

### Changed

- Clarify the README previews with labeled examples and separate desktop and mobile images ([#160](https://github.com/marcop135/whiteboard/pull/160), [#170](https://github.com/marcop135/whiteboard/issues/170)).

### Fixed

- Distinguish mobile drawing toolbars from the canvas in light mode ([#160](https://github.com/marcop135/whiteboard/pull/160), [#170](https://github.com/marcop135/whiteboard/issues/170)).

## [1.12.4] - 2026-10-19

### Changed

- Update the README ([#157](https://github.com/marcop135/whiteboard/pull/157)).
- Dock both mobile toolbars to the screen edges with horizontal scrolling and a Canvas tools menu ([#157](https://github.com/marcop135/whiteboard/pull/157), [#170](https://github.com/marcop135/whiteboard/issues/170)).

## [1.12.3] - 2026-10-19

### Changed

- Raise contrast on the README banners, GitHub social preview and link preview image, matching md2pdf ([#155](https://github.com/marcop135/whiteboard/pull/155)).

## [1.12.2] - 2026-10-19

### Changed

- Update KaTeX to 0.19.0, marked to 18.1.1 and React to 19.3.1 ([#152](https://github.com/marcop135/whiteboard/pull/152)).

### Fixed

- Keep rendering LaTeX with glyphs KaTeX lacks font metrics for, like CJK in `\text{}`, under KaTeX 0.19 ([#153](https://github.com/marcop135/whiteboard/pull/153), [#176](https://github.com/marcop135/whiteboard/issues/176)).

## [1.12.1] - 2026-10-16

### Fixed

- Send page views to whiteboard's own Matomo site instead of the shared marcopontili.com one ([#150](https://github.com/marcop135/whiteboard/pull/150), [#177](https://github.com/marcop135/whiteboard/issues/177)).

## [1.12.0] - 2026-10-16

### Added

- Add a `/privacy` page, a 404 page and `/.well-known/security.txt`, linked from the menu and page footers ([#146](https://github.com/marcop135/whiteboard/pull/146)).
- Count page views with self-hosted, cookieless Matomo (Do Not Track honoured), no banner ([#146](https://github.com/marcop135/whiteboard/pull/146), [#177](https://github.com/marcop135/whiteboard/issues/177)).
- Add `retire-draw.yml`: uploads self-unregistering service workers to the old draw host before its redirect ([#146](https://github.com/marcop135/whiteboard/pull/146), [#177](https://github.com/marcop135/whiteboard/issues/177)).

### Changed

- Move the canonical host to [whiteboard.marcopontili.com](https://whiteboard.marcopontili.com/) and rename to whiteboard ([#146](https://github.com/marcop135/whiteboard/pull/146), [#177](https://github.com/marcop135/whiteboard/issues/177)).
- Rename the PWA `short_name`, titles, agent files and brand images to whiteboard; `window.draw` stays ([#146](https://github.com/marcop135/whiteboard/pull/146)).
- Add canonical, Twitter card tags and `WebApplication` JSON-LD to the app head; the page stays `noindex` ([#146](https://github.com/marcop135/whiteboard/pull/146)).
- Deploy with the `WHITEBOARD_FTP_*` secrets and fail fast when they are missing; purge the new host ([#146](https://github.com/marcop135/whiteboard/pull/146), [#177](https://github.com/marcop135/whiteboard/issues/177)).

### Security

- Allow only `self-hosted Matomo` in the CSP `script-src`, `connect-src` and `img-src` for Matomo ([#146](https://github.com/marcop135/whiteboard/pull/146), [#177](https://github.com/marcop135/whiteboard/issues/177)).

## [1.11.3] - 2026-10-10

### Changed

- Replace the local `site-audit` skill with an `## Audit contract` in CLAUDE.md for the global skill ([#145](https://github.com/marcop135/whiteboard/pull/145)).

### Security

- Bump `source-map-js` to 1.2.2 for the high-severity source-map DoS ([GHSA-68fv-2mgg-jv7q](https://github.com/advisories/GHSA-68fv-2mgg-jv7q)) ([#145](https://github.com/marcop135/whiteboard/pull/145)).

## [1.11.2] - 2026-10-05

### Fixed

- Keep the phone hamburger menu above the overlay action bar and aligned with the taller bottom bar ([#140](https://github.com/marcop135/whiteboard/pull/140), [#170](https://github.com/marcop135/whiteboard/issues/170)).

## [1.11.1] - 2026-10-05

### Changed

- Standardize the changelog on Keep a Changelog sections with Format/Voice/Length/Links preamble and inline links ([#133](https://github.com/marcop135/whiteboard/pull/133)).
- Tighten the README intro and drop the Authors section ([#138](https://github.com/marcop135/whiteboard/pull/138)).

### Fixed

- Install Linux and Windows esbuild/rollup binaries after npm install ([#132](https://github.com/marcop135/whiteboard/pull/132), [#178](https://github.com/marcop135/whiteboard/issues/178)).

## [1.11.0] - 2026-10-04

### Changed

- Pre-select the freedraw (pencil) tool when a board opens ([#129](https://github.com/marcop135/whiteboard/pull/129)).
- Regroup the Export menu into full-row Scene, Image, Vector and PDF actions ([#129](https://github.com/marcop135/whiteboard/pull/129)).
- Rewrite the README as a use-case story with Privacy and Security split and a commands doc ([#129](https://github.com/marcop135/whiteboard/pull/129)).

## [1.10.1] - 2026-10-04

### Changed

- Bump KaTeX to 0.18.10 for LaTeX inserts ([#126](https://github.com/marcop135/whiteboard/pull/126)).

## [1.10.0] - 2026-10-04

### Added

- Keep several named boards in IndexedDB, with a Boards dialog to create, open, rename and delete them ([#122](https://github.com/marcop135/whiteboard/pull/122), [#169](https://github.com/marcop135/whiteboard/issues/169)).
- Reopen the last board on load instead of the restore chip; copy the old autosave once ([#122](https://github.com/marcop135/whiteboard/pull/122), [#169](https://github.com/marcop135/whiteboard/issues/169), [#168](https://github.com/marcop135/whiteboard/issues/168), [#124](https://github.com/marcop135/whiteboard/pull/124)).
- Warn with a download option when a board cannot be saved, instead of dropping the save silently ([#122](https://github.com/marcop135/whiteboard/pull/122), [#169](https://github.com/marcop135/whiteboard/issues/169)).
- Reopen LaTeX and Markdown inserts for editing by double-click or Insert → Edit selected ([#122](https://github.com/marcop135/whiteboard/pull/122), [#169](https://github.com/marcop135/whiteboard/issues/169)).
- Open `.excalidraw` files from the OS and accept shared images and scenes in the installed app ([#122](https://github.com/marcop135/whiteboard/pull/122)).
- Tint the browser chrome to the canvas in light and dark, following the toggle, Safari 26 included ([#122](https://github.com/marcop135/whiteboard/pull/122)).

### Changed

- Enlarge phone tap targets to 44px with 22px icons across the top, side and bottom bars ([#122](https://github.com/marcop135/whiteboard/pull/122)).
- Link the menu credit to the Excalidraw and draw repos, in the text color and weight ([#122](https://github.com/marcop135/whiteboard/pull/122)).
- Match the brand images' icon and heading to md2pdf: flat app mark, 70px Catamaran, solid ink ([#122](https://github.com/marcop135/whiteboard/pull/122)).
- Raise the tagline contrast in the README banner and the GitHub social and OG images ([#122](https://github.com/marcop135/whiteboard/pull/122)).
- Shorten the README to features, screenshots, privacy, development and the tech stack ([#122](https://github.com/marcop135/whiteboard/pull/122)).

### Security

- Override Excalidraw's `sass` to 1.105 so `braces` ([GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)) leaves the production tree ([#122](https://github.com/marcop135/whiteboard/pull/122)).

## [1.9.0] - 2026-10-02

### Changed

- Rewrite the README around one board, with a light/dark banner and desktop and mobile screenshots ([#118](https://github.com/marcop135/whiteboard/pull/118)).
- Add `npm run readme:shots` to re-capture the README screenshots in both themes ([#118](https://github.com/marcop135/whiteboard/pull/118)).
- Redraw the README banner as a labeled draw window, in light and dark ([#118](https://github.com/marcop135/whiteboard/pull/118)).
- Simplify the GitHub social and OG images to a light app mark, name and tagline that read at thumbnail size ([#118](https://github.com/marcop135/whiteboard/pull/118)).
- Release draw under the MIT license ([#118](https://github.com/marcop135/whiteboard/pull/118)).

### Fixed

- Preserve LaTeX superscripts, fractions and roots with KaTeX's MathML instead of unstyled HTML ([#118](https://github.com/marcop135/whiteboard/pull/118), [#176](https://github.com/marcop135/whiteboard/issues/176)).

## [1.8.1] - 2026-10-02

### Changed

- Keep the cPanel `.ftpquota` file out of the deploy's stale-file list and prune pass ([#116](https://github.com/marcop135/whiteboard/pull/116), [#175](https://github.com/marcop135/whiteboard/issues/175)).

## [1.8.0] - 2026-10-02

### Changed

- Credit "Built on Excalidraw by marcop135" with both names linked, below For agents, both in smaller menu type ([#112](https://github.com/marcop135/whiteboard/pull/112)).
- Long-cache only content-hashed assets and fonts; icons and the social image now refresh within a day ([#113](https://github.com/marcop135/whiteboard/pull/113)).
- Purge the Cloudflare cache for draw after each production deploy, and list stale server files on every run ([#113](https://github.com/marcop135/whiteboard/pull/113), [#175](https://github.com/marcop135/whiteboard/issues/175)).
- Move CI, deploy, and [`.nvmrc`](https://github.com/marcop135/draw/blob/develop/.nvmrc) from Node 20, now end of life, to Node 22 ([#112](https://github.com/marcop135/whiteboard/pull/112)).

### Fixed

- Declare only the self-hosted Excalidraw fonts, ending CSP errors from the esm.sh fallback on load ([#112](https://github.com/marcop135/whiteboard/pull/112), [#179](https://github.com/marcop135/whiteboard/issues/179)).
- Route Excalidraw's deprecated `unload` listener to `pagehide` so Chrome stops flagging it and bfcache works ([#112](https://github.com/marcop135/whiteboard/pull/112)).
- Serve the Excalidraw fonts on the dev server instead of an HTML fallback that fails to decode ([#112](https://github.com/marcop135/whiteboard/pull/112), [#179](https://github.com/marcop135/whiteboard/issues/179)).
- Fail the deploy when the FTPS upload fails instead of reporting success ([#113](https://github.com/marcop135/whiteboard/pull/113), [#175](https://github.com/marcop135/whiteboard/issues/175)).

### Security

- Verify the FTPS certificate, pin the SFTP host key, and restrict production deploys to main ([#113](https://github.com/marcop135/whiteboard/pull/113), [#175](https://github.com/marcop135/whiteboard/issues/175)).
- Restrict workflow tokens to read-only contents and audit production dependencies in CI on develop and main ([#113](https://github.com/marcop135/whiteboard/pull/113), [#175](https://github.com/marcop135/whiteboard/issues/175)).
- Send security headers on error responses, and add COOP and `upgrade-insecure-requests` to the policy ([#113](https://github.com/marcop135/whiteboard/pull/113), [#175](https://github.com/marcop135/whiteboard/issues/175)).
- Validate restored autosave data with Excalidraw's own restore before it reaches the canvas ([#113](https://github.com/marcop135/whiteboard/pull/113)).

## [1.7.2] - 2026-10-01

### Changed

- Expand the README for the live private Excalidraw app and replace the MIT claim with proprietary licensing ([#109](https://github.com/marcop135/whiteboard/pull/109)).

## [1.7.1] - 2026-10-01

### Changed

- Add SECURITY, CONTRIBUTING, Code of Conduct, issue and PR templates ([#106](https://github.com/marcop135/whiteboard/pull/106)).

### Removed

- Drop the README banner image and its brand sources; keep social and OG only ([#106](https://github.com/marcop135/whiteboard/pull/106)).

## [1.7.0] - 2026-10-01

### Added

- Restore og/twitter meta and add README, GitHub social and OG images from the repo-brand kit ([#101](https://github.com/marcop135/whiteboard/pull/101)).
- Expose `window.draw` (`getScene`, `setScene`, `exportImage`) for coding agents ([#101](https://github.com/marcop135/whiteboard/pull/101), [#174](https://github.com/marcop135/whiteboard/issues/174)).
- Add "For agents" to the menu and ship `llms.txt`, `auth.md`, `openapi.json`, and `.well-known` catalogs ([#101](https://github.com/marcop135/whiteboard/pull/101), [#174](https://github.com/marcop135/whiteboard/issues/174)).

### Changed

- Move the favicon and app icons to md2pdf's deep sky gradient ([#101](https://github.com/marcop135/whiteboard/pull/101)).
- Allow agent discovery files and social unfurl bots in `robots.txt`; add a `Content-Signal` line ([#101](https://github.com/marcop135/whiteboard/pull/101), [#174](https://github.com/marcop135/whiteboard/issues/174)).
- Add `sharp` (dev), `brand:images`, `brand:images:check`, and `verify:agent-readiness` ([#101](https://github.com/marcop135/whiteboard/pull/101)).
- Expand the README with badges, quick start, layout, and brand/agent script notes ([#101](https://github.com/marcop135/whiteboard/pull/101)) ([#174](https://github.com/marcop135/whiteboard/issues/174)).

### Fixed

- Name the tab `draw · Whiteboard with LaTeX, Mermaid and Markdown` instead of the bare hostname ([#101](https://github.com/marcop135/whiteboard/pull/101)).
- Render favicons with transparent corners, ship a 16/32/48 `favicon.ico`, and add a separate maskable icon ([#101](https://github.com/marcop135/whiteboard/pull/101)).

## [1.6.3] - 2026-09-29

### Changed

- Bump the production group: `katex`, `marked`, `react`, and `react-dom` ([#98](https://github.com/marcop135/whiteboard/pull/98)).
- Bump the development group: typescript-eslint, Prettier, `@types/node`, and `eslint-plugin-react-refresh` ([#98](https://github.com/marcop135/whiteboard/pull/98)).

### Security

- Raise `dompurify` to `^3.4.16` (direct and overrides) ([#98](https://github.com/marcop135/whiteboard/pull/98)).

## [1.6.2] - 2026-09-12

### Changed

- Bump the development group: Playwright, Vitest, typescript-eslint, Prettier, and `@types` ([#95](https://github.com/marcop135/whiteboard/pull/95)).
- Bump `actions/checkout` to v7.0.1 and `actions/setup-node` to v7.0.0 ([#95](https://github.com/marcop135/whiteboard/pull/95)).
- Align [`CLAUDE.md`](https://github.com/marcop135/draw/blob/develop/CLAUDE.md) and `siteMeta` comments with the private chrome (no GitHub toolbar, no public SEO/social tags) ([#95](https://github.com/marcop135/whiteboard/pull/95)).

### Security

- Raise `dompurify` to `^3.4.15` and pin overrides for `nanoid`, `mermaid`, `browserslist`, `fast-uri`, `js-yaml`, and `brace-expansion` ([#95](https://github.com/marcop135/whiteboard/pull/95)).

## [1.6.1] - 2026-07-28

### Changed

- Bump the production group: `@fontsource/roboto`, `katex`, `marked`, `react`, and `react-dom` ([#77](https://github.com/marcop135/whiteboard/pull/77)).
- Bump the dev-tooling group, 8 updates: Playwright, Prettier, Vitest, typescript-eslint, and `@types` ([#74](https://github.com/marcop135/whiteboard/pull/74)).
- Bump `fast-uri` 3.1.2 to 3.1.4 ([#76](https://github.com/marcop135/whiteboard/pull/76)).
- Bump `immutable` 4.3.8 to 4.3.9 ([#78](https://github.com/marcop135/whiteboard/pull/78)).
- Bump `js-yaml` 4.2.0 to 4.3.0 ([#79](https://github.com/marcop135/whiteboard/pull/79)).
- Bump `actions/checkout` to v7.0.0 ([#70](https://github.com/marcop135/whiteboard/pull/70)).

### Security

- Pin `dompurify` `^3.4.12` via overrides to clear audit advisories ([#77](https://github.com/marcop135/whiteboard/pull/77)).

## [1.6.0] - 2026-06-27

### Changed

- Slim the README to a personal note and delete [`SECURITY.md`](https://github.com/marcop135/draw/blob/develop/SECURITY.md); the public contributor and vuln-reporting docs no longer apply.

### Removed

- Drop the toolbar GitHub icon and the "Source code" hamburger-menu item; the repo is now private and personal.
- Remove the social-preview card, the Open Graph/Twitter meta, the canonical link, and the vite social-preview inject plugin.
- Remove the README/brand artifact specs, Playwright readme configs, and the hero/gif render scripts, plus their `capture:*` npm scripts.

## [1.5.1] - 2026-06-23

### Changed

- Bump `marked` 18.0.4 to 18.0.5 in the production group ([#62](https://github.com/marcop135/whiteboard/pull/62)).
- Bump the dev-tooling group, 9 updates: Playwright, Prettier, Vitest, typescript-eslint, and `@types` ([#68](https://github.com/marcop135/whiteboard/pull/68)).

## [1.5.0] - 2026-06-09

### Changed

- Show the app name beside the version in the hamburger menu (`draw v1.5.0`) ([#64](https://github.com/marcop135/whiteboard/pull/64)).
- Update README usage, structure and stack notes for Mermaid's move to Excalidraw's native menu ([#64](https://github.com/marcop135/whiteboard/pull/64)).

### Removed

- Drop the custom Insert > Mermaid modal and adapter; use Excalidraw's built-in Mermaid to Excalidraw (More tools menu), which parses the same diagrams into native editable shapes ([#64](https://github.com/marcop135/whiteboard/pull/64)).
- Drop GitHub from the phone bottom bar; keep it in the hamburger menu and desktop toolbar ([#64](https://github.com/marcop135/whiteboard/pull/64), [#170](https://github.com/marcop135/whiteboard/issues/170)).
- Drop the now-unused `@excalidraw/mermaid-to-excalidraw` direct dependency; Excalidraw still bundles its own copy ([#64](https://github.com/marcop135/whiteboard/pull/64)).

### Fixed

- Keep the phone action bar above Excalidraw's bottom bar while editing so Export stays reachable ([#64](https://github.com/marcop135/whiteboard/pull/64), [#170](https://github.com/marcop135/whiteboard/issues/170)).

## [1.4.6] - 2026-06-05

### Fixed

- Show our help (?) button only when Excalidraw hides its own, so it no longer doubles on mid-size screens ([#61](https://github.com/marcop135/whiteboard/pull/61)).
- Match Excalidraw's landscape-phone breakpoint so the action bar stays above the bottom bar ([#61](https://github.com/marcop135/whiteboard/pull/61), [#170](https://github.com/marcop135/whiteboard/issues/170)).

## [1.4.5] - 2026-06-04

### Changed

- Bump `actions/checkout` to v6.0.3 and `actions/setup-node` to v6.4.0 so both run on Node 24 before GitHub drops Node 20 from the runners ([#60](https://github.com/marcop135/whiteboard/pull/60)).

## [1.4.4] - 2026-06-04

### Changed

- Load Roboto from the latin-only `@fontsource` entrypoints, dropping the unused cyrillic, greek, vietnamese, and latin-ext woff2 subsets ([#59](https://github.com/marcop135/whiteboard/pull/59)).
- Disable the `modulePreload` polyfill since the es2022 build target supports `<link rel="modulepreload">` natively ([#59](https://github.com/marcop135/whiteboard/pull/59)).
- Trap focus inside the Insert modals, label with `aria-labelledby`, and return focus to the opener on close ([#59](https://github.com/marcop135/whiteboard/pull/59), [#172](https://github.com/marcop135/whiteboard/issues/172)).
- Close the Insert and Export menus on Escape or outside click, and add trigger `aria-label`s so the icon-only bar stays named below 1300px ([#59](https://github.com/marcop135/whiteboard/pull/59), [#172](https://github.com/marcop135/whiteboard/issues/172)).
- Honour `prefers-reduced-motion` by neutralising app-chrome transitions, and darken `--ui-muted` to clear WCAG AA on white ([#59](https://github.com/marcop135/whiteboard/pull/59)).
- Add `role="menuitem"` to the Insert, Export, and PDF-orientation items, with explicit labels on the PDF orientation pills ([#59](https://github.com/marcop135/whiteboard/pull/59), [#172](https://github.com/marcop135/whiteboard/issues/172)).
- Add `rel=canonical`, `og:url`, and iOS/PWA web-app meta to `index.html` and expose `SITE_CANONICAL_URL`; the deliberate noindex stays ([#59](https://github.com/marcop135/whiteboard/pull/59)).
- Add [`CLAUDE.md`](https://github.com/marcop135/draw/blob/develop/CLAUDE.md) with codebase orientation, the release flow, and repo gotchas ([#59](https://github.com/marcop135/whiteboard/pull/59)).
- Add [`scripts/audit-shots.mjs`](https://github.com/marcop135/draw/blob/develop/scripts/audit-shots.mjs) to capture baseline/after screenshots across breakpoints and themes for visual-regression review ([#59](https://github.com/marcop135/whiteboard/pull/59)).

## [1.4.3] - 2026-06-02

### Fixed

- Stop autosave from wiping the saved scene during restore so reloading preserves unsaved work ([#58](https://github.com/marcop135/whiteboard/pull/58), [#168](https://github.com/marcop135/whiteboard/issues/168)).

## [1.4.2] - 2026-06-02

### Changed

- Credit Excalidraw as the upstream library and md2pdf as a source of merged work; drop the author section ([#57](https://github.com/marcop135/whiteboard/pull/57)).
- Bump dependencies to their latest in-range versions ([#57](https://github.com/marcop135/whiteboard/pull/57)).

## [1.4.1] - 2026-06-02

### Changed

- Align the action bar with Excalidraw's top toolbar above 1024px and its footer controls below ([#56](https://github.com/marcop135/whiteboard/pull/56)).
- Centre the mobile lock/hand strip vertically on the right edge ([#56](https://github.com/marcop135/whiteboard/pull/56), [#170](https://github.com/marcop135/whiteboard/issues/170)).
- Trim the Help dialog links to a single Excalidraw Documentation link, dropping blog, issues, and YouTube ([#56](https://github.com/marcop135/whiteboard/pull/56)).
- Align the menu's Canvas background label and swatch row with the item-icon column above them ([#56](https://github.com/marcop135/whiteboard/pull/56)).
- Note the automatic system/light/dark theme in the README, site description, and repo metadata ([#56](https://github.com/marcop135/whiteboard/pull/56)).

### Fixed

- Overlay the phone action bar on Excalidraw's bottom bar; hide it while editing to prevent collisions ([#56](https://github.com/marcop135/whiteboard/pull/56), [#170](https://github.com/marcop135/whiteboard/issues/170)).
- Add a Help (?) button beside the GitHub link on phones, where Excalidraw drops its footer help icon ([#56](https://github.com/marcop135/whiteboard/pull/56), [#170](https://github.com/marcop135/whiteboard/issues/170)).
- Centre the action bar's popups over the bar on narrow screens so they no longer clip off the left edge ([#56](https://github.com/marcop135/whiteboard/pull/56)).
- Show an orientation hint under the toolbar on phones, replacing Excalidraw's desktop-only welcome arrows ([#56](https://github.com/marcop135/whiteboard/pull/56), [#170](https://github.com/marcop135/whiteboard/issues/170)).

## [1.4.0] - 2026-06-02

### Added

- Default to the selection tool so the welcome hint overlay shows on an empty canvas, matching Excalidraw ([#54](https://github.com/marcop135/whiteboard/pull/54)).
- Move About into the hamburger menu (Source code, Built on Excalidraw, version) and retire the standalone version chip and About modal ([#54](https://github.com/marcop135/whiteboard/pull/54)).

### Changed

- Keep the welcome hint arrows on short and landscape viewports, and mute their dark-mode colour to match the light-mode contrast ([#54](https://github.com/marcop135/whiteboard/pull/54), [#170](https://github.com/marcop135/whiteboard/issues/170)).
- Match the floating bar to Excalidraw's island (solid background, `--shadow-island`, 8px radius) with flat icon buttons of one size ([#54](https://github.com/marcop135/whiteboard/pull/54), [#170](https://github.com/marcop135/whiteboard/issues/170)).
- Rebuild the README demo gif to show shapes, colours, LaTeX, Mermaid, and the theme toggle ([#54](https://github.com/marcop135/whiteboard/pull/54)).

### Fixed

- Wrap the lazy LaTeX, Mermaid, Markdown, and About panels in an error boundary so a failed chunk load shows a recoverable notice instead of white-screening the whole app ([#54](https://github.com/marcop135/whiteboard/pull/54), [#171](https://github.com/marcop135/whiteboard/issues/171)).
- Reload once on `vite:preloadError` so a stale service-worker chunk after a deploy recovers automatically instead of crashing on first open ([#54](https://github.com/marcop135/whiteboard/pull/54), [#171](https://github.com/marcop135/whiteboard/issues/171)).
- Serve hashed JS/CSS via `StaleWhileRevalidate` (was `CacheFirst`) so a new deploy's chunks self-heal; keep fonts on `CacheFirst` ([#54](https://github.com/marcop135/whiteboard/pull/54), [#171](https://github.com/marcop135/whiteboard/issues/171)).
- Move the floating bar to bottom-centre below 1024px to avoid overlapping the toolbar or side panels ([#54](https://github.com/marcop135/whiteboard/pull/54), [#170](https://github.com/marcop135/whiteboard/issues/170)).
- Lower the floating bar below Excalidraw's UI layer so its menus and dialogs render above the bar instead of being covered ([#54](https://github.com/marcop135/whiteboard/pull/54), [#170](https://github.com/marcop135/whiteboard/issues/170)).

## [1.3.0] - 2026-06-01

### Added

- Add debounced scene autosave to `localStorage`; on reload show a top-left chip offering Restore or Discard ([#50](https://github.com/marcop135/whiteboard/pull/50), [#168](https://github.com/marcop135/whiteboard/issues/168)).
- Add a toolbar theme chip cycling `system` -> `light` -> `dark`, persisted and tracking OS theme via `matchMedia` ([#50](https://github.com/marcop135/whiteboard/pull/50)).
- Open an About modal from the version chip with version, repo, changelog, and MIT license links ([#50](https://github.com/marcop135/whiteboard/pull/50)).
- Add Copy PNG to clipboard in the Export popup; disable when `ClipboardItem` is unavailable ([#50](https://github.com/marcop135/whiteboard/pull/50)).
- Add PDF orientation auto, portrait, and landscape as three one-click pills in a single PDF export row ([#50](https://github.com/marcop135/whiteboard/pull/50)).

### Changed

- Show the version chip at all viewport widths above 420px; previously the 1300px icon-only rule hid it ([#50](https://github.com/marcop135/whiteboard/pull/50)).
- Move the theme chip between Export and the GitHub corner link in the floating toolbar ([#50](https://github.com/marcop135/whiteboard/pull/50)).
- Add `version-update:semver-major` to the [Dependabot ignore list](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot-yml-file#ignore) so single-major PRs stop opening ([#50](https://github.com/marcop135/whiteboard/pull/50)).
- Bump `dompurify` to 3.4.7, `marked` to 18.0.4, and `vite` to 6.4.3 ([#50](https://github.com/marcop135/whiteboard/pull/50)).
- Bump 7 dev dependencies via Dependabot group PR ([#45](https://github.com/marcop135/whiteboard/pull/45)).

### Security

- Override `brace-expansion` `^5.0.6` and `ws` `^8.20.1` to clear [GHSA-jxxr-4gwj-5jf2](https://github.com/advisories/GHSA-jxxr-4gwj-5jf2) and [GHSA-58qx-3vcg-4xpx](https://github.com/advisories/GHSA-58qx-3vcg-4xpx) ([#50](https://github.com/marcop135/whiteboard/pull/50)).

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

- Replace `@phosphor-icons/react` with self-hosted `bootstrap-icons`; centralize inline SVG-component wrappers in [`src/components/icons.tsx`](https://github.com/marcop135/draw/blob/develop/src/components/icons.tsx) so only the paths the app uses are shipped (chevron-down, github, pencil-square, filetype-png/jpg/svg/pdf, braces-asterisk, diagram-3, markdown).
- Introduce shared design tokens on `#root` (`--ui-radius`, `--ui-bg`, `--ui-border`, `--ui-fg`, `--ui-accent-bg`, `--ui-accent-fg`, `--ui-shadow`, `--ui-btn-size`); `#root.dark` flips the palette in one place. Toolbar, buttons, GitHub link, modals, and dropdowns all consume the same variables so the three bars read as one system.
- Match Excalidraw's selected-tool lavender chip (`#e0dfff` / `#6965db`) on the active/open state of every floating `app-btn` so the custom toolbar visually pairs with the stock toolbar's selected pencil.
- Bump icon size to 18px in the toolbar and 20px in dropdown rows; tighten gaps, paddings, and transitions for a consistent hover/focus/active feel.
- Bump `react`/`react-dom` to 19.2.6, `marked` to 18.0.3, `katex` to 0.16.47, `mermaid` to 11.15.0, `@babel/plugin-transform-modules-systemjs` to 7.29.4, and `fast-uri` to 3.1.2 via Dependabot ([#37](https://github.com/marcop135/whiteboard/pull/37), [#38](https://github.com/marcop135/whiteboard/pull/38), [#39](https://github.com/marcop135/whiteboard/pull/39), [#40](https://github.com/marcop135/whiteboard/pull/40)).

### Fixed

- Suppress the default Excalidraw welcome-screen hint strip (book/lock/hand) on the right edge by rendering an empty `<WelcomeScreen />`, so it no longer collides with the floating top-right toolbar.

## [1.0.6] - 2026-05-08

### Added

- Generate a dedicated 1280x640 social preview card (`public/social-preview.png`, ~40 KB) sized for GitHub's repo social image (max 1 MB) and matching the Open Graph spec.
- Ship cross-browser favicons: `favicon-16x16.png`, `favicon-32x32.png`, `favicon-48x48.png`, `apple-touch-icon.png` (180), and `android-chrome-192x192.png` / `512x512.png`, plus a PNG-in-ICO `favicon.ico` for legacy `/favicon.ico` requests.

### Changed

- Add `og:image:width`/`height`/`type`/`alt` and `twitter:image:alt` meta tags; reference the new favicon set from `index.html` and add the PWA Android icons to the manifest.

### Removed

- Drop the README banner copy prebuild step; the new `npm run assets:brand` ([`scripts/render-brand-assets.mjs`](https://github.com/marcop135/draw/blob/develop/scripts/render-brand-assets.mjs)) regenerates the social card and favicon variants on demand from `assets/social-preview.svg` and [`public/favicon.svg`](https://github.com/marcop135/draw/blob/develop/public/favicon.svg) via headless Chromium, with the rendered PNGs and ICO committed to [`public/`](https://github.com/marcop135/draw/blob/develop/public/) so CI builds don't need a browser.

## [1.0.5] - 2026-05-08

### Added

- Add a version chip in the app toolbar that reads from [`package.json`](https://github.com/marcop135/draw/blob/develop/package.json); hide it under 420px to save thumb space.

### Changed

- Replace the inline Octocat SVG and chevron glyphs with Phosphor icons in Insert, Export, and the GitHub link.
- Tighten toolbar buttons to 12px font, 7px by 12px padding, 36px height, with a 13px / 40px touch-friendly bump under 640px.
- Self-host Roboto via `@fontsource/roboto` so the Excalidraw UI, modal textareas, and markdown SVG never hit Google's CDN.
- Centralize Phosphor icon imports in [`src/components/icons.tsx`](https://github.com/marcop135/draw/blob/develop/src/components/icons.tsx) so each icon is tree-shaken individually.
- Alphabetize devDependencies in [`package.json`](https://github.com/marcop135/draw/blob/develop/package.json) (`jsdom`, `vite-plugin-pwa`, `vitest`).

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

- Add round-trip `.excalidraw` export via `serializeAsJSON`, alongside PNG, JPEG, SVG and PDF ([#8](https://github.com/marcop135/whiteboard/pull/8), [#167](https://github.com/marcop135/whiteboard/issues/167)).
- Ship as an installable PWA with Workbox precache and runtime caching for offline use after the first visit ([#8](https://github.com/marcop135/whiteboard/pull/8), [#167](https://github.com/marcop135/whiteboard/issues/167)).

### Changed

- Move the floating toolbar to bottom-right under 640px so it stops colliding with Excalidraw's mobile top bar ([#8](https://github.com/marcop135/whiteboard/pull/8)).
- Flip Insert and Export popups upward on mobile so they open relative to their button instead of the page ([#8](https://github.com/marcop135/whiteboard/pull/8), [#167](https://github.com/marcop135/whiteboard/issues/167)).
- Bump touch targets to 40px+ and textareas to 16px font on mobile to suppress iOS auto-zoom ([#8](https://github.com/marcop135/whiteboard/pull/8)).
- Use `100dvh` and full width for modals on phones so the keyboard doesn't push content off-screen ([#8](https://github.com/marcop135/whiteboard/pull/8)).
- Bump direct `@excalidraw/mermaid-to-excalidraw` from `^1.1.2` to `^2.2.2`, dropping a duplicate copy of mermaid, uuid, and nanoid ([#8](https://github.com/marcop135/whiteboard/pull/8)).
- Mark `sw.js`, `workbox-*.js` and `manifest.webmanifest` as no-cache in `.htaccess` for PWA updates ([#8](https://github.com/marcop135/whiteboard/pull/8), [#167](https://github.com/marcop135/whiteboard/issues/167)).
- Add `dependabot.yml` for weekly grouped npm and monthly grouped Actions updates against `develop`, ignoring deps already pinned via overrides ([#8](https://github.com/marcop135/whiteboard/pull/8)).

### Security

- Add `worker-src 'self'` and `manifest-src 'self'` to CSP to allow the service worker and manifest ([#8](https://github.com/marcop135/whiteboard/pull/8), [#167](https://github.com/marcop135/whiteboard/issues/167)).
- Pin `serialize-javascript ^7.0.5` in `overrides` to clear the high-severity Workbox-build advisory ([#8](https://github.com/marcop135/whiteboard/pull/8)).

## [0.1.2] - 2026-04-27

### Changed

- Verify production responds with HTTP 200 and the CSP, robots, and HTML headers from [`dist/.htaccess`](https://github.com/marcop135/draw/blob/develop/dist/.htaccess) reach clients ([#6](https://github.com/marcop135/whiteboard/pull/6)).

### Fixed

- Set FTP `server-dir: ./` and `protocol: ftps` to deploy into the chroot'd document root ([#6](https://github.com/marcop135/whiteboard/pull/6)).
- Bump `SamKirkland/FTP-Deploy-Action` to `v4.4.0` to match the known-good setup from a sibling project ([#6](https://github.com/marcop135/whiteboard/pull/6)).

## [0.1.1] - 2026-04-25

### Security

- Bump Vite `^5.4.8` to `^6.4.2` to clear [GHSA-4w7w-66w2-5vf9](https://github.com/advisories/GHSA-4w7w-66w2-5vf9) (path traversal in optimized-deps `.map` handling) ([#3](https://github.com/marcop135/whiteboard/pull/3)).
- Pin patched `dompurify`, `nanoid`, `uuid`, `esbuild`, and `lodash-es` via `overrides`; `npm audit` now reports zero vulnerabilities ([#3](https://github.com/marcop135/whiteboard/pull/3)).
- Add [`public/robots.txt`](https://github.com/marcop135/draw/blob/develop/public/robots.txt) blocking crawlers and AI bots, plus `<meta name="robots">` and an `X-Robots-Tag` header ([#3](https://github.com/marcop135/whiteboard/pull/3)).

## [0.1.0] - 2026-04-25

### Added

- Initial release: Excalidraw whiteboard with sandboxed LaTeX (KaTeX), Mermaid, and Markdown inserts plus PNG, JPEG, SVG, PDF, `.excalidraw` exports.
- Lazy-load Insert modals via `React.lazy` so the Mermaid parser and KaTeX only ship to users who click Insert.
- Self-host Excalidraw fonts so CSP can stay locked to `'self'` with no third-party runtime fetches.

### Changed

- Hide the Excalidraw links submenu (GitHub, X, Discord) via a custom `<MainMenu>` so it stops shipping with the toolbar.
- Add lint, build, test, and FTP deploy GitHub Actions workflows; lint is gated at `--max-warnings=0`.

### Security

- Ship [`dist/.htaccess`](https://github.com/marcop135/draw/blob/develop/dist/.htaccess) with a hard CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, and HSTS.
