import { copyFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const from = join(root, "docs", "readme-banner.png");
const to = join(root, "public", "social-preview.png");

copyFileSync(from, to);
console.log("[sync-banner] docs/readme-banner.png → public/social-preview.png");
