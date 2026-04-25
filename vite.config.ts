import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { copyFileSync, mkdirSync, readdirSync, statSync } from "node:fs";
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

export default defineConfig({
  plugins: [react(), excalidrawAssetsPlugin()],
  define: {
    "process.env.IS_PREACT": JSON.stringify("false"),
  },
  build: {
    target: "es2022",
    sourcemap: false,
    chunkSizeWarningLimit: 2000,
  },
});
