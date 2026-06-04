import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import App from "./App";
import { installDocumentTitleGuard } from "./lib/documentTitleGuard";
import { SITE_DOCUMENT_TITLE } from "./siteMeta";
// Self-hosted Roboto (woff2 served from our own bundle, no Google CDN at runtime).
// Latin-only entrypoints: this is an English-only tool, so we skip the cyrillic,
// greek, math, symbols, vietnamese, and latin-ext subsets the bare per-weight
// CSS would otherwise pull in (each as its own woff2). One woff2 per weight.
import "@fontsource/roboto/latin-400.css";
import "@fontsource/roboto/latin-500.css";
import "@fontsource/roboto/latin-700.css";
import "./styles.css";

// Register the service worker for offline support and asset caching.
// `autoUpdate` mode means the SW silently swaps to a fresh version on the
// next page load. Fine for a personal tool; if we ever ship a stable user
// base, we'd switch to a prompt-the-user-to-reload pattern.
registerSW({ immediate: true });

// A new deploy renames hashed chunks; an open tab (or stale SW cache) can hold
// references to chunk URLs the server no longer has, so a lazy import() 404s.
// Vite fires `vite:preloadError` in that case — reload once to pull the fresh
// index.html and matching hashes. The sessionStorage guard prevents a loop if
// the failure is genuinely persistent (e.g. truly offline).
window.addEventListener("vite:preloadError", () => {
  if (sessionStorage.getItem("preload-reloaded")) return;
  sessionStorage.setItem("preload-reloaded", "1");
  window.location.reload();
});

// Self-host Excalidraw fonts: copied to /fonts/ at build time by vite.config.ts.
// Must be set BEFORE Excalidraw is imported/rendered.
declare global {
  interface Window {
    EXCALIDRAW_ASSET_PATH: string;
  }
}
window.EXCALIDRAW_ASSET_PATH = "/";

installDocumentTitleGuard(SITE_DOCUMENT_TITLE);

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
