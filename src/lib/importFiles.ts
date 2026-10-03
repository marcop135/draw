// Files that reach the app from outside: the installed app opening a
// `.excalidraw` file (manifest file_handlers + launchQueue) and the system
// share sheet (manifest share_target, stashed by public/share-target-sw.js).
import type { InsertImageInput } from "./insertImage";

export const SHARE_CACHE = "draw-share-target";
export const SHARE_PARAM = "share-target";
const MAX_IMAGE_SIDE = 800;

const IMAGE_TYPES = new Set<InsertImageInput["mimeType"]>([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

export function isSceneFile(file: { name: string; type: string }): boolean {
  return (
    /\.(excalidraw|json)$/i.test(file.name) ||
    file.type === "application/vnd.excalidraw+json" ||
    file.type === "application/json"
  );
}

export function isImageFile(file: { type: string }): boolean {
  return IMAGE_TYPES.has(file.type as InsertImageInput["mimeType"]);
}

/** Board name from a file name: "plan.excalidraw" -> "plan". */
export function boardNameFromFile(name: string): string {
  return name.replace(/\.(excalidraw|json)$/i, "").trim() || "Imported";
}

/** Fit an image's natural size inside MAX_IMAGE_SIDE, keeping its ratio. */
export function fitImage(width: number, height: number): { width: number; height: number } {
  const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(width, height, 1));
  return { width: Math.round(width * scale), height: Math.round(height * scale) };
}

function readDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

export async function imageInputFromFile(file: File): Promise<InsertImageInput> {
  const dataUrl = await readDataUrl(file);
  const img = new Image();
  img.src = dataUrl;
  await img.decode();
  return {
    dataUrl,
    mimeType: file.type as InsertImageInput["mimeType"],
    ...fitImage(img.naturalWidth || MAX_IMAGE_SIDE, img.naturalHeight || MAX_IMAGE_SIDE),
  };
}

/** Files the share target stashed before redirecting here; empty otherwise.
    Clears the stash and the URL flag so a reload does not import twice. */
export async function takeSharedFiles(): Promise<File[]> {
  const url = new URL(window.location.href);
  if (!url.searchParams.has(SHARE_PARAM) || !("caches" in window)) return [];
  url.searchParams.delete(SHARE_PARAM);
  window.history.replaceState(null, "", url.pathname + url.search + url.hash);
  const cache = await caches.open(SHARE_CACHE);
  const files: File[] = [];
  for (const req of await cache.keys()) {
    const res = await cache.match(req);
    if (!res) continue;
    const name = decodeURIComponent(res.headers.get("x-file-name") ?? "shared");
    const type = res.headers.get("content-type") ?? "";
    files.push(new File([await res.blob()], name, { type }));
  }
  await caches.delete(SHARE_CACHE);
  return files;
}

type LaunchParams = { files: readonly FileSystemFileHandle[] };
type LaunchQueue = { setConsumer: (cb: (params: LaunchParams) => void) => void };

/** Calls back with the files the OS opened the installed app with. */
export function onLaunchFiles(cb: (files: File[]) => void): void {
  const queue = (window as unknown as { launchQueue?: LaunchQueue }).launchQueue;
  queue?.setConsumer(async ({ files }) => {
    if (!files.length) return;
    cb(await Promise.all(files.map((handle) => handle.getFile())));
  });
}
