import { describe, expect, it } from "vitest";
import {
  boardContent,
  createBoard,
  formatUpdated,
  untitledName,
  type SceneInput,
} from "./boards";

type El = SceneInput["elements"][number];
const el = (id: string, extra: Record<string, unknown> = {}) =>
  ({ id, type: "rectangle", isDeleted: false, ...extra }) as unknown as El;
const file = (id: string) =>
  ({ id, mimeType: "image/png", dataURL: "data:image/png;base64,", created: 0 }) as never;

describe("untitledName", () => {
  it("starts at Untitled and counts up past names in use", () => {
    expect(untitledName([])).toBe("Untitled");
    expect(untitledName(["Untitled"])).toBe("Untitled 2");
    expect(untitledName(["Untitled", "Untitled 2", "Notes"])).toBe("Untitled 3");
  });
});

describe("boardContent", () => {
  it("drops deleted elements and files no live element uses", () => {
    const out = boardContent({
      elements: [
        el("a", { type: "image", fileId: "f1" }),
        el("b", { type: "image", fileId: "f2", isDeleted: true }),
        el("c"),
      ],
      appState: {},
      files: { f1: file("f1"), f2: file("f2"), f3: file("f3") },
    });
    expect(out.elements.map((e) => e.id)).toEqual(["a", "c"]);
    expect(Object.keys(out.files)).toEqual(["f1"]);
  });

  it("keeps only the persistent AppState fields", () => {
    const out = boardContent({
      elements: [],
      appState: {
        viewBackgroundColor: "#fff",
        collaborators: new Map(),
        scrollX: 40,
      } as unknown as SceneInput["appState"],
      files: {},
    });
    expect(out.appState).toEqual({ viewBackgroundColor: "#fff" });
  });
});

describe("createBoard", () => {
  it("creates an empty named board with matching timestamps", () => {
    const b = createBoard("Notes");
    expect(b.name).toBe("Notes");
    expect(b.elements).toEqual([]);
    expect(b.created).toBe(b.updated);
    expect(b.id).toMatch(/^b_/);
  });
});

describe("formatUpdated", () => {
  const now = Date.UTC(2026, 9, 3, 12);
  it("reads relative for the last week, then as a date", () => {
    expect(formatUpdated(now - 10_000, now)).toBe("just now");
    expect(formatUpdated(now - 5 * 60_000, now)).toBe("5 minutes ago");
    expect(formatUpdated(now - 3 * 3_600_000, now)).toBe("3 hours ago");
    expect(formatUpdated(now - 24 * 3_600_000, now)).toBe("yesterday");
    expect(formatUpdated(now - 30 * 24 * 3_600_000, now)).toMatch(/2026/);
  });
});
