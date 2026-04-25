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
  mimeType: "image/svg+xml" | "image/png";
};

// Generate a stable-looking but unique-enough id without pulling in nanoid.
function randomId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 11);
  const time = Date.now().toString(36);
  return `${prefix}_${time}_${rand}`;
}

/** Adds a raster/svg image at the centre of the current viewport. */
export async function insertImageElement(
  api: ExcalidrawImperativeAPI,
  input: InsertImageInput,
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

  const x = cx - input.width / 2;
  const y = cy - input.height / 2;

  const element = {
    id: randomId("img"),
    type: "image" as const,
    x,
    y,
    width: input.width,
    height: input.height,
    angle: 0,
    strokeColor: "transparent",
    backgroundColor: "transparent",
    fillStyle: "solid" as const,
    strokeWidth: 1,
    strokeStyle: "solid" as const,
    roughness: 0,
    opacity: 100,
    groupIds: [],
    frameId: null,
    roundness: null,
    seed: Math.floor(Math.random() * 2 ** 31),
    version: 1,
    versionNonce: Math.floor(Math.random() * 2 ** 31),
    isDeleted: false,
    boundElements: null,
    updated: Date.now(),
    link: null,
    locked: false,
    fileId,
    status: "saved" as const,
    scale: [1, 1] as [number, number],
    index: null,
    customData: undefined,
  };

  const current = api.getSceneElements();
  api.updateScene({
    elements: [...current, element as unknown as ExcalidrawElement],
  });
  api.scrollToContent(element as unknown as ExcalidrawElement, {
    fitToContent: false,
    animate: true,
    duration: 300,
  });
}
