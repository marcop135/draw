/**
 * Convert the latest Playwright test WebM under test-results/ to docs/readme-demo.gif.
 * Requires ffmpeg on PATH.
 */

import { execFileSync } from "node:child_process";
import { globSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(root, "..");

const relatives = globSync("test-results/**/*.webm", { cwd: repoRoot });
if (relatives.length === 0) {
  console.error("[webm-to-gif] No .webm under test-results/. Run capture:readme-gif first.");
  process.exit(1);
}

const abs = relatives.map((r) => join(repoRoot, r));
abs.sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs);
const input = abs[0];
const out = join(repoRoot, "docs", "readme-demo.gif");

const vf =
  "fps=10,scale=960:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=128[p];[s1][p]paletteuse=dither=bayer";

execFileSync("ffmpeg", ["-y", "-i", input, "-vf", vf, "-loop", "0", out], {
  stdio: "inherit",
  shell: process.platform === "win32",
});

console.log(`[webm-to-gif] ${input} → ${out}`);
