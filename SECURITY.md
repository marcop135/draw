# Security policy

This project is a **static single-page app** (no backend, no accounts). There are no secrets in the deployed bundle besides what is already public in this repository.

## Supported versions

Only the **`main`** branch and the deployment built from it are considered supported. Older tags may not receive backports unless noted in the changelog.

## Reporting an issue

If you find a **security vulnerability** (e.g. XSS via LaTeX, Markdown, Mermaid, or the drawing export path), please report it **privately**:

1. Open the repository **Security** tab → **Report a vulnerability** (GitHub security advisory), **or**
2. Open a regular issue if you are unsure and we can triage (use private advisory for anything exploitable in production).

Include steps to reproduce, affected URLs or build steps, and impact (e.g. session theft is N/A here; focus on data exfiltration from the page, unwanted script execution, or bypass of sanitization).

## What we care about most

- Sanitization and safe defaults for **user-supplied** LaTeX, Markdown, and Mermaid before anything reaches the DOM or SVG.
- **Content-Security-Policy** and related headers on the live site (see `public/.htaccess` and the README **Security model** section).

Out of scope: issues in upstream [Excalidraw](https://github.com/excalidraw/excalidraw) itself — report those to the Excalidraw project unless the bug is specific to this repo’s integration code.

## Repository hygiene

Before making this repository **public**, scan git history for accidentally committed secrets (e.g. with [Gitleaks](https://github.com/gitleaks/gitleaks): `gitleaks detect`). Re-run after any large history rewrite (rebase/filter-repo) before flipping visibility. GitHub also enables [secret scanning](https://docs.github.com/en/code-security/secret-scanning/about-secret-scanning) on public repositories.

`npm ci` runs a **`postinstall`** that downloads Playwright Chromium on **local** machines only; set `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1` (or `true`) if you must skip it (offline CI mirrors, constrained sandboxes).
