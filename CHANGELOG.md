# Changelog

**Labels:** **Build**, **Chore**, **CI**, **Docs**, **Enhance**, **Feat**, **Fix**, **Perf**, **Revert**, **Sec**, **Style**; add **(WIP)** for incomplete work.

## [1.0.6] - 2026-05-08

- **Feat:** Generate a dedicated 1280x640 social preview card (`public/social-preview.png`, ~40 KB) sized for GitHub's repo social image (max 1 MB) and matching the Open Graph spec.
- **Feat:** Ship cross-browser favicons: `favicon-16x16.png`, `favicon-32x32.png`, `favicon-48x48.png`, `apple-touch-icon.png` (180), and `android-chrome-192x192.png` / `512x512.png`, plus a PNG-in-ICO `favicon.ico` for legacy `/favicon.ico` requests.
- **Enhance:** Add `og:image:width`/`height`/`type`/`alt` and `twitter:image:alt` meta tags; reference the new favicon set from `index.html` and add the PWA Android icons to the manifest.
- **Build:** Replace the README banner copy step with `scripts/render-brand-assets.mjs`, which uses headless Chromium to render the social card and favicon variants from `assets/social-preview.svg` and `public/favicon.svg` at every prebuild.

## [1.0.5] - 2026-05-08

- **Feat:** Add a version chip in the app toolbar that reads from `package.json`; hide it under 420px to save thumb space.
- **Enhance:** Replace the inline Octocat SVG and chevron glyphs with Phosphor icons in Insert, Export, and the GitHub link.
- **Style:** Tighten toolbar buttons to 12px font, 7px by 12px padding, 36px height, with a 13px / 40px touch-friendly bump under 640px.
- **Docs:** Drop the CI badge from the README; the Actions tab is one click away and the badge added noise.
- **Build:** Self-host Roboto via `@fontsource/roboto` so the Excalidraw UI, modal textareas, and markdown SVG never hit Google's CDN.
- **Chore:** Centralize Phosphor icon imports in `src/components/icons.tsx` so each icon is tree-shaken individually.
- **Chore:** Alphabetize devDependencies in `package.json` (`jsdom`, `vite-plugin-pwa`, `vitest`).

## [1.0.4] - 2026-05-02

- **Docs:** Tighten the README: drop the Deploy section, shorten the lede and Features, collapse Installation, trim Security and Usage.
- **Docs:** Add Contributing, Author, and License sections at the end of the README, with Contributing right before Author.

## [1.0.3] - 2026-05-01

- **Style:** Move the GitHub repo link from a fixed bottom-left control into the floating toolbar after Export, with chip styling matched.
- **Docs:** Update README usage and project-structure notes to reflect the new GitHub link placement.

## [1.0.2] - 2026-05-01

- **Style:** Move the source repo link from the floating toolbar to a fixed bottom-left corner control with safe-area padding.
- **Style:** Replace em dashes with colons in `index.html`'s Open Graph and Twitter descriptions for consistency with site copy.
- **Style:** Normalize em dashes to colons or periods across configs, scripts, public assets, source, and prior CHANGELOG headings.
- **Docs:** Restructure the README with a `draw` heading, centered banner and demo GIF, and clearer install, usage, and deploy sections.
- **Docs:** Expand the npm package `description` to match the public positioning of the app.
- **Chore:** Update the README GIF capture to draw rectangle, ellipse, freedraw, and arrow on the primary canvas.

## [1.0.1] - 2026-04-30

- **Revert:** Roll back the Material 3 mobile overrides: custom FABs, bottom sheets, Excalidraw chrome restyling, and touch targets.
- **Revert:** Drop the `lucide-react` and `@fontsource/roboto` dependencies that the mobile theme depended on.

## [0.2.0] - 2026-04-27

- **Feat:** Add `.excalidraw` export that round-trips scenes via `serializeAsJSON`, alongside PNG, JPEG, SVG, and PDF exports.
- **Feat:** Ship as an installable PWA with Workbox precache and runtime caching for offline use after the first visit.
- **Enhance:** Move the floating toolbar to bottom-right under 640px so it stops colliding with Excalidraw's mobile top bar.
- **Enhance:** Flip Insert and Export popups upward on mobile so they open relative to their button instead of the page.
- **Enhance:** Bump touch targets to 40px+ and textareas to 16px font on mobile to suppress iOS auto-zoom.
- **Enhance:** Use `100dvh` and full width for modals on phones so the keyboard doesn't push content off-screen.
- **Sec:** Add `worker-src 'self'` and `manifest-src 'self'` to CSP so the service worker and manifest are explicitly allowed.
- **Sec:** Pin `serialize-javascript ^7.0.5` in `overrides` to clear the high-severity Workbox-build advisory.
- **Build:** Bump direct `@excalidraw/mermaid-to-excalidraw` from `^1.1.2` to `^2.2.2`, dropping a duplicate copy of mermaid, uuid, and nanoid.
- **Build:** Mark `sw.js`, `workbox-*.js`, and `manifest.webmanifest` as no-cache in `.htaccess` so the PWA auto-update flow works.
- **CI:** Add `dependabot.yml` for weekly grouped npm and monthly grouped Actions updates against `develop`, ignoring deps already pinned via overrides.

## [0.1.2] - 2026-04-27

- **Fix:** Set FTP `server-dir: ./` and `protocol: ftps` so deploy lands in the chroot'd document root instead of nesting deeper.
- **Fix:** Bump `SamKirkland/FTP-Deploy-Action` to `v4.4.0` to match the known-good setup from a sibling project.
- **Chore:** Verify production responds with HTTP 200 and the CSP, robots, and HTML headers from `dist/.htaccess` reach clients.

## [0.1.1] - 2026-04-25

- **Sec:** Bump Vite `^5.4.8` to `^6.4.2` to clear GHSA-4w7w-66w2-5vf9 (path traversal in optimized-deps `.map` handling).
- **Sec:** Pin patched `dompurify`, `nanoid`, `uuid`, `esbuild`, and `lodash-es` via `overrides`; `npm audit` now reports zero vulnerabilities.
- **Sec:** Add `public/robots.txt` blocking common crawlers and AI bots, plus `<meta name="robots">` and an `X-Robots-Tag` header.

## [0.1.0] - 2026-04-25

- **Feat:** Initial release: Excalidraw whiteboard with sandboxed LaTeX (KaTeX), Mermaid, and Markdown inserts plus PNG, JPEG, SVG, PDF, `.excalidraw` exports.
- **Feat:** Lazy-load Insert modals via `React.lazy` so the Mermaid parser and KaTeX only ship to users who click Insert.
- **Feat:** Self-host Excalidraw fonts so CSP can stay locked to `'self'` with no third-party runtime fetches.
- **Sec:** Ship `dist/.htaccess` with a hard CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, and HSTS.
- **Style:** Hide the Excalidraw links submenu (GitHub, X, Discord) via a custom `<MainMenu>` so it stops shipping with the toolbar.
- **CI:** Add lint, build, test, and FTP deploy GitHub Actions workflows; lint is gated at `--max-warnings=0`.
