import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import type {
  ExcalidrawElement,
  FileId,
} from "@excalidraw/excalidraw/element/types";
import type { DataURL } from "@excalidraw/excalidraw/types";

export type InsertImageInput = {
  dataUrl: string;
  width: number;
  height: number;
  mimeType: "image/svg+xml" | "image/png" | "image/jpeg" | "image/webp" | "image/gif";
};

export type InsertKind = "latex" | "markdown";

/** Source kept on a LaTeX/Markdown image so it can be reopened and edited.
    baseWidth is the rendered width, so a resized image keeps its scale. */
export type InsertSource = { kind: InsertKind; source: string; baseWidth: number };

const SOURCE_KEY = "drawInsert";

export function insertSourceOf(el: ExcalidrawElement | undefined): InsertSource | null {
  if (!el || el.type !== "image" || el.isDeleted) return null;
  const data = el.customData?.[SOURCE_KEY] as Partial<InsertSource> | undefined;
  if (
    !data ||
    (data.kind !== "latex" && data.kind !== "markdown") ||
    typeof data.source !== "string" ||
    typeof data.baseWidth !== "number" ||
    data.baseWidth <= 0
  ) {
    return null;
  }
  return data as InsertSource;
}

export type InsertOptions = {
  /** Kept on the element so it can be edited later. */
  source?: { kind: InsertKind; source: string };
  /** Replace this element in place (same id and position) instead of adding. */
  replaceId?: string;
};

// Generate a stable-looking but unique-enough id without pulling in nanoid.
function randomId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 11);
  const time = Date.now().toString(36);
  return `${prefix}_${time}_${rand}`;
}

/** Adds a raster/svg image at the centre of the current viewport, or swaps
    it in for an existing element when `replaceId` is set. */
export async function insertImageElement(
  api: ExcalidrawImperativeAPI,
  input: InsertImageInput,
  options: InsertOptions = {},
): Promise<void> {
  const fileId = randomId("file") as FileId;

  api.addFiles([
    {
      id: fileId,
      mimeType: input.mimeType,
      dataURL: input.dataUrl as DataURL,
      created: Date.now(),
    },
  ]);

  const appState = api.getAppState();
  const { scrollX, scrollY, width: vpW, height: vpH, zoom } = appState;
  const cx = -scrollX + vpW / 2 / zoom.value;
  const cy = -scrollY + vpH / 2 / zoom.value;

  const current = api.getSceneElements();
  const replaced = options.replaceId
    ? current.find((el) => el.id === options.replaceId)
    : undefined;
  // An edited insert keeps its top-left corner and the scale the user gave it.
  const scale = replaced
    ? replaced.width / (insertSourceOf(replaced)?.baseWidth ?? replaced.width)
    : 1;
  const width = input.width * scale;
  const height = input.height * scale;
  const x = replaced ? replaced.x : cx - width / 2;
  const y = replaced ? replaced.y : cy - height / 2;

  const element = {
    id: replaced?.id ?? randomId("img"),
    type: "image" as const,
    x,
    y,
    width,
    height,
    angle: replaced?.angle ?? 0,
    strokeColor: "transparent",
    backgroundColor: "transparent",
    fillStyle: "solid" as const,
    strokeWidth: 1,
    strokeStyle: "solid" as const,
    roughness: 0,
    opacity: 100,
    groupIds: replaced?.groupIds ?? [],
    frameId: replaced?.frameId ?? null,
    roundness: null,
    seed: Math.floor(Math.random() * 2 ** 31),
    version: (replaced?.version ?? 0) + 1,
    versionNonce: Math.floor(Math.random() * 2 ** 31),
    isDeleted: false,
    boundElements: replaced?.boundElements ?? null,
    updated: Date.now(),
    link: null,
    locked: replaced?.locked ?? false,
    fileId,
    status: "saved" as const,
    scale: [1, 1] as [number, number],
    index: replaced?.index ?? null,
    customData: options.source
      ? { [SOURCE_KEY]: { ...options.source, baseWidth: input.width } }
      : undefined,
  } as unknown as ExcalidrawElement;

  if (replaced) {
    api.updateScene({
      elements: current.map((el) => (el.id === replaced.id ? element : el)),
    });
    return;
  }
  api.updateScene({ elements: [...current, element] });
  api.scrollToContent(element, {
    fitToContent: false,
    animate: true,
    duration: 300,
  });
}
