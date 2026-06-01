import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { clearSnapshot, loadSnapshot, saveSnapshot } from "./persist";

const liveElement = {
  id: "el-1",
  type: "rectangle",
  isDeleted: false,
} as unknown as Parameters<typeof saveSnapshot>[0]["elements"][number];

const deletedElement = {
  id: "el-2",
  type: "rectangle",
  isDeleted: true,
} as unknown as Parameters<typeof saveSnapshot>[0]["elements"][number];

describe("persist", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("round-trips a live snapshot", () => {
    saveSnapshot({
      elements: [liveElement],
      appState: { viewBackgroundColor: "#ffffff" },
      files: {},
    });
    const loaded = loadSnapshot();
    expect(loaded).not.toBeNull();
    expect(loaded?.elements).toHaveLength(1);
    expect(loaded?.appState.viewBackgroundColor).toBe("#ffffff");
  });

  it("returns null when storage is empty", () => {
    expect(loadSnapshot()).toBeNull();
  });

  it("skips persistence when no live elements", () => {
    saveSnapshot({ elements: [deletedElement], appState: {}, files: {} });
    expect(window.localStorage.getItem("draw:scene:v1")).toBeNull();
  });

  it("discards stored snapshots that have only deleted elements", () => {
    window.localStorage.setItem(
      "draw:scene:v1",
      JSON.stringify({ v: 1, elements: [deletedElement], appState: {}, files: {} }),
    );
    expect(loadSnapshot()).toBeNull();
  });

  it("discards and returns null on version mismatch", () => {
    window.localStorage.setItem(
      "draw:scene:v1",
      JSON.stringify({ v: 99, elements: [liveElement] }),
    );
    expect(loadSnapshot()).toBeNull();
    expect(window.localStorage.getItem("draw:scene:v1")).toBeNull();
  });

  it("strips non-serializable AppState fields like collaborators", () => {
    const collaborators = new Map();
    collaborators.set("a", { username: "x" });
    saveSnapshot({
      elements: [liveElement],
      appState: { collaborators } as unknown as Parameters<typeof saveSnapshot>[0]["appState"],
      files: {},
    });
    const raw = window.localStorage.getItem("draw:scene:v1");
    expect(raw).not.toBeNull();
    expect(raw).not.toContain("collaborators");
  });

  it("loadSnapshot returns null on corrupted JSON", () => {
    window.localStorage.setItem("draw:scene:v1", "{not json");
    expect(loadSnapshot()).toBeNull();
  });

  it("clearSnapshot removes the entry", () => {
    saveSnapshot({ elements: [liveElement], appState: {}, files: {} });
    clearSnapshot();
    expect(window.localStorage.getItem("draw:scene:v1")).toBeNull();
  });

  it("swallows setItem errors (quota / private mode)", () => {
    const spy = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("QuotaExceededError");
      });
    expect(() =>
      saveSnapshot({ elements: [liveElement], appState: {}, files: {} }),
    ).not.toThrow();
    expect(spy).toHaveBeenCalled();
  });
});
