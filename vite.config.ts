import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import type { Plugin } from "vite";
import { copyFileSync, mkdirSync, readdirSync, statSync } from "node:fs";
import {
  SITE_DOCUMENT_TITLE,
  SITE_ORIGIN,
  SITE_SHORT_NAME,
} from "./src/siteMeta";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function copyDirSync(src: string, dest: string) {
  mkdirSync(dest, { recursive: true });
  for (const entry of readdirSync(src)) {
    const s = join(src, entry);
    const d = join(dest, entry);
    if (statSync(s).isDirectory()) copyDirSync(s, d);
    else copyFileSync(s, d);
  }
}

// Self-host Excalidraw fonts so the runtime never reaches a CDN.
// Excalidraw reads window.EXCALIDRAW_ASSET_PATH (set in main.tsx) and looks
// for fonts under <asset_path>fonts/. We mirror that layout into dist/fonts.
function excalidrawAssetsPlugin() {
  return {
    name: "copy-excalidraw-assets",
    apply: "build" as const,
    closeBundle() {
      const src = resolve(
        __dirname,
        "node_modules/@excalidraw/excalidraw/dist/prod/fonts",
      );
      const dest = resolve(__dirname, "dist/fonts");
      try {
        copyDirSync(src, dest);
      } catch (err) {
        console.warn("[excalidraw-assets] could not copy fonts:", err);
      }
    },
  };
}

function injectAbsoluteSocialPreview(): Plugin {
  const url = `${SITE_ORIGIN.replace(/\/$/, "")}/social-preview.png`;
  return {
    name: "inject-absolute-social-preview",
    transformIndexHtml(html) {
      return html
        .replaceAll(
          '<meta property="og:image" content="/social-preview.png" />',
          `<meta property="og:image" content="${url}" />`,
        )
        .replaceAll(
          '<meta name="twitter:image" content="/social-preview.png" />',
          `<meta name="twitter:image" content="${url}" />`,
        );
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    injectAbsoluteSocialPreview(),
    excalidrawAssetsPlugin(),
    VitePWA({
      registerType: "autoUpdate",
      // Don't try to precache the giant Mermaid + Excalidraw bundle; they're
      // big enough to push the SW manifest over the default 2 MB limit, and
      // we want them runtime-cached anyway so updates don't require a SW skip.
      workbox: {
        globPatterns: ["index.html", "assets/index-*.{js,css}", "favicon.svg"],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        navigateFallback: "/index.html",
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: /\/(assets|fonts)\//,
            handler: "CacheFirst",
            options: {
              cacheName: "static-assets",
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
      includeAssets: [
        "favicon.svg",
        "favicon.ico",
        "favicon-16x16.png",
        "favicon-32x32.png",
        "favicon-48x48.png",
        "apple-touch-icon.png",
        "android-chrome-192x192.png",
        "android-chrome-512x512.png",
        "social-preview.png",
        "robots.txt",
      ],
      manifest: {
        name: SITE_DOCUMENT_TITLE,
        short_name: SITE_SHORT_NAME,
        description:
          "A free, offline-capable whiteboard. Sketch, math (LaTeX), Mermaid diagrams, Markdown notes. No login, no tracking.",
        theme_color: "#1e1e1e",
        background_color: "#1e1e1e",
        display: "standalone",
        start_url: "/",
        scope: "/",
        icons: [
          {
            src: "/favicon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
  define: {
    "process.env.IS_PREACT": JSON.stringify("false"),
  },
  build: {
    target: "es2022",
    sourcemap: false,
    chunkSizeWarningLimit: 2000,
  },
  test: {
    environment: "jsdom",
    setupFiles: ["vitest.setup.ts"],
    include: ["src/**/*.test.ts"],
  },
});
