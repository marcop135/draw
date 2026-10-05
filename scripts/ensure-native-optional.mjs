/**
 * Shared WSL + Windows checkouts on /mnt/c need both platforms' esbuild and
 * rollup optional binaries. npm only installs the current OS and refuses the
 * other with EBADPLATFORM, so missing packages are fetched as tarballs.
 * Runs from package.json postinstall after ensure-playwright.
 */

import { createWriteStream, existsSync, mkdirSync, readFileSync, chmodSync } from "node:fs";
import { execFileSync } from "node:child_process";
import https from "node:https";
import { tmpdir } from "node:os";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const root = path.resolve(import.meta.dirname, "..");

function pkgVersion(name) {
  try {
    return require(path.join(root, "node_modules", name, "package.json")).version;
  } catch {
    return null;
  }
}

function tarballUrl(name, version) {
  const base = name.startsWith("@") ? name.split("/")[1] : name;
  return `https://registry.npmjs.org/${name}/-/${base}-${version}.tgz`;
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(dest);
    https
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`${url} -> ${res.statusCode}`));
          return;
        }
        res.pipe(file);
        file.on("finish", () => file.close(resolve));
      })
      .on("error", reject);
  });
}

async function ensure(name, version) {
  const dest = path.join(root, "node_modules", name);
  const pkgJson = path.join(dest, "package.json");
  if (existsSync(pkgJson)) {
    const current = JSON.parse(readFileSync(pkgJson, "utf8")).version;
    if (current === version) return;
  }
  const tgz = path.join(tmpdir(), `${name.replace("/", "-")}-${version}.tgz`);
  const url = tarballUrl(name, version);
  console.log(`[ensure-native-optional] ${name}@${version}`);
  await download(url, tgz);
  mkdirSync(dest, { recursive: true });
  execFileSync("tar", ["-xzf", tgz, "-C", dest, "--strip-components=1"]);
  const bin = path.join(dest, "bin", "esbuild");
  if (existsSync(bin)) {
    try {
      chmodSync(bin, 0o755);
    } catch {
      /* Windows */
    }
  }
}

const esbuildVer = pkgVersion("esbuild");
const rollupVer = pkgVersion("rollup");
if (!esbuildVer || !rollupVer) process.exit(0);

await ensure(`@esbuild/linux-x64`, esbuildVer);
await ensure(`@esbuild/win32-x64`, esbuildVer);
await ensure(`@rollup/rollup-linux-x64-gnu`, rollupVer);
await ensure(`@rollup/rollup-win32-x64-msvc`, rollupVer);
await ensure(`@rollup/rollup-win32-x64-gnu`, rollupVer);
