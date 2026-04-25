import {
  exportToBlob,
  exportToSvg,
} from "@excalidraw/excalidraw";
import type {
  ExcalidrawElement,
  NonDeletedExcalidrawElement,
} from "@excalidraw/excalidraw/element/types";
import type {
  AppState,
  BinaryFiles,
} from "@excalidraw/excalidraw/types";
import { jsPDF } from "jspdf";
import "jspdf/dist/polyfills.es.js";
import { downloadBlob, timestampedFilename } from "./download";

export type SceneSnapshot = {
  elements: readonly NonDeletedExcalidrawElement[];
  appState: Partial<AppState>;
  files: BinaryFiles;
};

function isExportable(elements: readonly ExcalidrawElement[]): boolean {
  return elements.some((el) => !el.isDeleted);
}

const baseAppState = (s: Partial<AppState>) => ({
  ...s,
  exportBackground: true,
  exportWithDarkMode: false,
  viewBackgroundColor: s.viewBackgroundColor ?? "#ffffff",
});

export async function exportPng(scene: SceneSnapshot): Promise<void> {
  if (!isExportable(scene.elements)) throw new Error("Canvas is empty.");
  const blob = await exportToBlob({
    elements: scene.elements,
    appState: baseAppState(scene.appState),
    files: scene.files,
    mimeType: "image/png",
  });
  downloadBlob(blob, timestampedFilename("png"));
}

export async function exportJpeg(scene: SceneSnapshot): Promise<void> {
  if (!isExportable(scene.elements)) throw new Error("Canvas is empty.");
  const blob = await exportToBlob({
    elements: scene.elements,
    appState: baseAppState(scene.appState),
    files: scene.files,
    mimeType: "image/jpeg",
    quality: 0.92,
  });
  downloadBlob(blob, timestampedFilename("jpg"));
}

async function getSvg(scene: SceneSnapshot): Promise<SVGSVGElement> {
  return exportToSvg({
    elements: scene.elements,
    appState: baseAppState(scene.appState),
    files: scene.files,
    exportPadding: 16,
  });
}

export async function exportSvg(scene: SceneSnapshot): Promise<void> {
  if (!isExportable(scene.elements)) throw new Error("Canvas is empty.");
  const svg = await getSvg(scene);
  const xml = new XMLSerializer().serializeToString(svg);
  const blob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
  downloadBlob(blob, timestampedFilename("svg"));
}

export async function exportPdf(scene: SceneSnapshot): Promise<void> {
  if (!isExportable(scene.elements)) throw new Error("Canvas is empty.");
  const svg = await getSvg(scene);
  const widthAttr = parseFloat(svg.getAttribute("width") ?? "0");
  const heightAttr = parseFloat(svg.getAttribute("height") ?? "0");
  // Fall back to a viewBox parse if width/height missing.
  let width = widthAttr;
  let height = heightAttr;
  if (!width || !height) {
    const vb = (svg.getAttribute("viewBox") ?? "").split(/\s+/).map(Number);
    if (vb.length === 4) {
      width = vb[2];
      height = vb[3];
    }
  }
  if (!width || !height) {
    width = 800;
    height = 600;
  }

  const orientation = width >= height ? "landscape" : "portrait";
  const doc = new jsPDF({
    orientation,
    unit: "px",
    format: [width, height],
    hotfixes: ["px_scaling"],
  });

  // Render via raster to avoid jsPDF's incomplete SVG support for hand-drawn strokes.
  const png = await exportToBlob({
    elements: scene.elements,
    appState: baseAppState(scene.appState),
    files: scene.files,
    mimeType: "image/png",
    exportPadding: 16,
  });
  const dataUrl = await blobToDataUrl(png);
  // Match scaling so the PNG fills the page at the SVG's intrinsic size.
  doc.addImage(dataUrl, "PNG", 0, 0, width, height, undefined, "FAST");
  doc.save(timestampedFilename("pdf"));
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result as string);
    fr.onerror = () => reject(fr.error ?? new Error("FileReader failed"));
    fr.readAsDataURL(blob);
  });
}
