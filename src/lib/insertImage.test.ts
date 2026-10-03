import { describe, expect, it } from "vitest";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import { insertImageElement, insertSourceOf } from "./insertImage";

function fakeApi(initial: ExcalidrawElement[] = []) {
  let elements = initial;
  const api = {
    addFiles: () => {},
    getAppState: () => ({ scrollX: 0, scrollY: 0, width: 1000, height: 800, zoom: { value: 1 } }),
    getSceneElements: () => elements,
    updateScene: ({ elements: next }: { elements: ExcalidrawElement[] }) => {
      elements = next;
    },
    scrollToContent: () => {},
  };
  return { api: api as unknown as ExcalidrawImperativeAPI, elements: () => elements };
}

const svg = (width: number, height: number) => ({
  dataUrl: "data:image/svg+xml;base64,",
  width,
  height,
  mimeType: "image/svg+xml" as const,
});

describe("insertImageElement", () => {
  it("stores the LaTeX source and rendered width on the image", async () => {
    const { api, elements } = fakeApi();
    await insertImageElement(api, svg(100, 40), { source: { kind: "latex", source: "x^2" } });
    const [el] = elements();
    expect(insertSourceOf(el)).toEqual({ kind: "latex", source: "x^2", baseWidth: 100 });
    expect(el.x).toBe(450);
  });

  it("replaces in place, keeping id, corner and the user's scale", async () => {
    const { api, elements } = fakeApi();
    await insertImageElement(api, svg(100, 40), { source: { kind: "latex", source: "x" } });
    const [first] = elements();
    // The user doubled its size and moved it.
    const resized = { ...first, x: 10, y: 20, width: 200, height: 80 } as ExcalidrawElement;
    const { api: api2, elements: elements2 } = fakeApi([resized]);
    await insertImageElement(api2, svg(150, 40), {
      source: { kind: "latex", source: "x + y" },
      replaceId: first.id,
    });
    const after = elements2();
    expect(after).toHaveLength(1);
    expect(after[0].id).toBe(first.id);
    expect([after[0].x, after[0].y, after[0].width, after[0].height]).toEqual([10, 20, 300, 80]);
    expect(after[0].version).toBe(first.version + 1);
    expect(insertSourceOf(after[0])?.source).toBe("x + y");
  });
});

describe("insertSourceOf", () => {
  it("ignores images without a valid source", () => {
    const base = { type: "image", isDeleted: false } as unknown as ExcalidrawElement;
    expect(insertSourceOf(undefined)).toBeNull();
    expect(insertSourceOf(base)).toBeNull();
    expect(
      insertSourceOf({ ...base, customData: { drawInsert: { kind: "html", source: "x", baseWidth: 1 } } } as ExcalidrawElement),
    ).toBeNull();
    expect(
      insertSourceOf({ ...base, type: "rectangle", customData: { drawInsert: { kind: "latex", source: "x", baseWidth: 1 } } } as unknown as ExcalidrawElement),
    ).toBeNull();
  });
});
