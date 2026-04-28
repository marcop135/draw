import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import App from "./App";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "./styles.css";

// Register the service worker for offline support and asset caching.
// `autoUpdate` mode means the SW silently swaps to a fresh version on the
// next page load — fine for a personal tool; if we ever ship a stable user
// base, we'd switch to a prompt-the-user-to-reload pattern.
registerSW({ immediate: true });

// Self-host Excalidraw fonts: copied to /fonts/ at build time by vite.config.ts.
// Must be set BEFORE Excalidraw is imported/rendered.
declare global {
  interface Window {
    EXCALIDRAW_ASSET_PATH: string;
  }
}
window.EXCALIDRAW_ASSET_PATH = "/";

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
