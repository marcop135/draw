import { describe, expect, it, vi } from "vitest";

vi.mock("@excalidraw/excalidraw", () => ({
  exportToBlob: vi.fn(async () => new Blob([new Uint8Array([1, 2, 3])], { type: "image/png" })),
  exportToSvg: vi.fn(),
  serializeAsJSON: vi.fn(() => "{}"),
}));

vi.mock("jspdf", () => ({
  jsPDF: vi.fn().mockImplementation(function (
    this: { addImage: () => void; save: () => void; opts: unknown },
    opts: unknown,
  ) {
    this.opts = opts;
    this.addImage = vi.fn();
    this.save = vi.fn();
    return this;
  }),
}));

vi.mock("./download", () => ({
  downloadBlob: vi.fn(),
  timestampedFilename: vi.fn(() => "draw-test.pdf"),
}));

import { copyPngToClipboard, exportPdf } from "./export";
import { exportToSvg } from "@excalidraw/excalidraw";
import { jsPDF } from "jspdf";

const liveElement = { id: "1", type: "rectangle", isDeleted: false } as unknown as
  Parameters<typeof exportPdf>[0]["elements"][number];

function svgWithSize(w: number, h: number): SVGSVGElement {
  const svg = {
    getAttribute: (name: string) => {
      if (name === "width") return String(w);
      if (name === "height") return String(h);
      if (name === "viewBox") return `0 0 ${w} ${h}`;
      return null;
    },
  } as unknown as SVGSVGElement;
  return svg;
}

describe("exportPdf orientation", () => {
  it("auto: picks landscape for a wide canvas", async () => {
    vi.mocked(exportToSvg).mockResolvedValueOnce(svgWithSize(1000, 500));
    await exportPdf(
      { elements: [liveElement], appState: {}, files: {} },
      "auto",
    );
    const ctor = vi.mocked(jsPDF);
    const opts = ctor.mock.calls.at(-1)?.[0] as unknown as { orientation: string; format: number[] };
    expect(opts.orientation).toBe("landscape");
    expect(opts.format).toEqual([1000, 500]);
  });

  it("forced portrait swaps the page format for a wide canvas", async () => {
    vi.mocked(exportToSvg).mockResolvedValueOnce(svgWithSize(1000, 500));
    await exportPdf(
      { elements: [liveElement], appState: {}, files: {} },
      "portrait",
    );
    const ctor = vi.mocked(jsPDF);
    const opts = ctor.mock.calls.at(-1)?.[0] as unknown as { orientation: string; format: number[] };
    expect(opts.orientation).toBe("portrait");
    expect(opts.format).toEqual([500, 1000]);
  });

  it("forced landscape keeps a wide canvas as landscape without swap", async () => {
    vi.mocked(exportToSvg).mockResolvedValueOnce(svgWithSize(1000, 500));
    await exportPdf(
      { elements: [liveElement], appState: {}, files: {} },
      "landscape",
    );
    const ctor = vi.mocked(jsPDF);
    const opts = ctor.mock.calls.at(-1)?.[0] as unknown as { orientation: string; format: number[] };
    expect(opts.orientation).toBe("landscape");
    expect(opts.format).toEqual([1000, 500]);
  });

  it("throws when the canvas has no live elements", async () => {
    await expect(
      exportPdf({ elements: [], appState: {}, files: {} }),
    ).rejects.toThrow("empty");
  });
});

describe("copyPngToClipboard", () => {
  it("throws a typed error when ClipboardItem is missing", async () => {
    const original = (globalThis as { ClipboardItem?: unknown }).ClipboardItem;
    delete (globalThis as { ClipboardItem?: unknown }).ClipboardItem;
    await expect(
      copyPngToClipboard({ elements: [liveElement], appState: {}, files: {} }),
    ).rejects.toThrow(/not supported/i);
    (globalThis as { ClipboardItem?: unknown }).ClipboardItem = original;
  });

  it("writes a PNG ClipboardItem when the API is available", async () => {
    const write = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { write },
    });
    class FakeClipboardItem {
      constructor(public items: Record<string, Blob>) {}
    }
    (globalThis as { ClipboardItem?: unknown }).ClipboardItem = FakeClipboardItem;
    await copyPngToClipboard({ elements: [liveElement], appState: {}, files: {} });
    expect(write).toHaveBeenCalledTimes(1);
    const arg = write.mock.calls[0][0];
    expect(Array.isArray(arg)).toBe(true);
    expect(arg[0]).toBeInstanceOf(FakeClipboardItem);
    expect(arg[0].items["image/png"]).toBeInstanceOf(Blob);
  });
});
