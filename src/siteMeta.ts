/** PWA manifest `name` and the hostname `SITE_ORIGIN` derives from. Not the tab title: see `SITE_PAGE_TITLE`. */
export const SITE_DOCUMENT_TITLE = "draw.marcopontili.com";

/** HTTPS origin derived from the document title hostname (no trailing slash). */
export const SITE_ORIGIN = `https://${SITE_DOCUMENT_TITLE}`;

/** Origin with trailing slash, used for `og:url`. No canonical tag: the page is `noindex`. */
export const SITE_CANONICAL_URL = `${SITE_ORIGIN}/`;

/** PWA `short_name` (launcher / installs). */
export const SITE_SHORT_NAME = "draw";

/** Browser `<title>` and `og:title`. Keep in sync with `index.html`. */
export const SITE_PAGE_TITLE = "draw · Whiteboard with LaTeX, Mermaid and Markdown";

/** Absolute `og:image` URL; rendered from `.github/brand/og.svg`. Bump `?v=` when the image changes. */
export const SITE_OG_IMAGE = `${SITE_ORIGIN}/og.png?v=2`;
