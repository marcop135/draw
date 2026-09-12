/** Browser `<title>` and PWA manifest `name` (full hostname). README uses `# draw` as the short product heading. */
export const SITE_DOCUMENT_TITLE = "draw.marcopontili.com";

/** HTTPS origin derived from the document title hostname (no trailing slash). */
export const SITE_ORIGIN = `https://${SITE_DOCUMENT_TITLE}`;

/** Origin with trailing slash. Kept for vite/PWA consumers; do not re-add public SEO/social tags. */
export const SITE_CANONICAL_URL = `${SITE_ORIGIN}/`;

/** PWA `short_name` (launcher / installs). */
export const SITE_SHORT_NAME = "draw";
