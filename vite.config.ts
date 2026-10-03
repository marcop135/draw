import { defineConfig } from "vitest/config";
import type { Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import {
  copyFileSync,
  createReadStream,
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
} from "node:fs";
import { SITE_DOCUMENT_TITLE, SITE_SHORT_NAME } from "./src/siteMeta";
import { dirname, join, resolve, sep } from "node:path";
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
// The dev server serves the same directory at /fonts/, so dev never falls back
// to index.html for a font request (which fails to decode as woff2).
const EXCALIDRAW_FONTS_DIR = resolve(
  __dirname,
  "node_modules/@excalidraw/excalidraw/dist/prod/fonts",
);

function excalidrawAssetsPlugin(): Plugin {
  let isBuild = false;
  return {
    name: "copy-excalidraw-assets",
    configResolved(config) {
      isBuild = config.command === "build";
    },
    configureServer(server) {
      server.middlewares.use("/fonts", (req, res, next) => {
        const path = decodeURIComponent((req.url ?? "").split("?")[0]);
        const file = resolve(EXCALIDRAW_FONTS_DIR, `.${path}`);
        if (
          !file.startsWith(EXCALIDRAW_FONTS_DIR + sep) ||
          !existsSync(file) ||
          !statSync(file).isFile()
        ) {
          next();
          return;
        }
        res.setHeader("Content-Type", "font/woff2");
        createReadStream(file).pipe(res);
      });
    },
    closeBundle() {
      // Vite also calls closeBundle when the dev server stops; copy on build only.
      if (!isBuild) return;
      const src = EXCALIDRAW_FONTS_DIR;
      const dest = resolve(__dirname, "dist/fonts");
      try {
        copyDirSync(src, dest);
      } catch (err) {
        console.warn("[excalidraw-assets] could not copy fonts:", err);
      }
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
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
        // Agent discovery files are static documents, not app routes: never
        // answer them with the cached app shell.
        navigateFallbackDenylist: [
          /^\/for-agents\.html$/,
          /^\/(?:llms\.txt|auth\.md|openapi\.json)$/,
          /^\/\.well-known\//,
        ],
        cleanupOutdatedCaches: true,
        // Web Share Target: stashes shared files and redirects to the app.
        importScripts: ["share-target-sw.js"],
        runtimeCaching: [
          {
            // Fonts are content-addressed and never change: cache them hard.
            urlPattern: /\/fonts\//,
            handler: "CacheFirst",
            options: {
              cacheName: "static-fonts",
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          {
            // JS/CSS chunks carry hashed names; revalidate so a new deploy's
            // chunks land on the next load instead of being pinned for 30 days.
            // This is what lets the `vite:preloadError` reload recover cleanly
            // instead of white-screening on a stale, deleted chunk.
            urlPattern: /\/assets\/.*\.(?:js|css)$/,
            handler: "StaleWhileRevalidate",
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
        "maskable-512x512.png",
        "robots.txt",
        "share-target-sw.js",
      ],
      manifest: {
        name: SITE_DOCUMENT_TITLE,
        short_name: SITE_SHORT_NAME,
        description:
          "A free, offline-capable whiteboard. Sketch, math (LaTeX), Mermaid diagrams, Markdown notes. No login, no tracking.",
        // Matches the dark canvas and index.html's dark theme-color; the
        // manifest takes one value, so the light scheme relies on the meta.
        theme_color: "#121212",
        background_color: "#121212",
        display: "standalone",
        start_url: "/",
        scope: "/",
        // Installed app: open .excalidraw files from the OS (read through
        // window.launchQueue in src/lib/importFiles.ts) in the existing window.
        file_handlers: [
          {
            action: "/",
            accept: { "application/vnd.excalidraw+json": [".excalidraw"] },
          },
        ],
        launch_handler: { client_mode: "focus-existing" },
        // System share sheet: images go onto the current board, .excalidraw
        // files open as new boards (public/share-target-sw.js).
        share_target: {
          action: "/share-target",
          method: "POST",
          enctype: "multipart/form-data",
          params: {
            files: [
              {
                name: "files",
                accept: [
                  "image/png",
                  "image/jpeg",
                  "image/webp",
                  "image/gif",
                  "image/svg+xml",
                  "application/vnd.excalidraw+json",
                  "application/json",
                  ".excalidraw",
                ],
              },
            ],
          },
        },
        icons: [
          {
            src: "/favicon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any",
          },
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            // Full bleed, glyph inside the 80% safe zone (public/favicon-maskable.svg).
            src: "/maskable-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
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
    // es2022 natively supports <link rel="modulepreload">, so drop Vite's
    // ~1KB preload polyfill from every entry chunk. Safe for modern-only targets.
    modulePreload: { polyfill: false },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["vitest.setup.ts"],
    include: ["src/**/*.test.ts"],
  },
});
