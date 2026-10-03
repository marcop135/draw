import { beforeEach, describe, expect, it } from "vitest";
import { LEGACY_KEY, loadSnapshot } from "./persist";

const liveElement = { id: "el-1", type: "rectangle", isDeleted: false };
const deletedElement = { id: "el-2", type: "rectangle", isDeleted: true };

const store = (value: unknown) =>
  window.localStorage.setItem(LEGACY_KEY, JSON.stringify(value));

describe("legacy localStorage snapshot", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("reads a live snapshot", () => {
    store({
      v: 1,
      elements: [liveElement],
      appState: { viewBackgroundColor: "#ffffff" },
      files: {},
    });
    const loaded = loadSnapshot();
    expect(loaded?.elements).toHaveLength(1);
    expect(loaded?.appState.viewBackgroundColor).toBe("#ffffff");
  });

  it("returns null when storage is empty", () => {
    expect(loadSnapshot()).toBeNull();
  });

  it("ignores snapshots that have only deleted elements", () => {
    store({ v: 1, elements: [deletedElement], appState: {}, files: {} });
    expect(loadSnapshot()).toBeNull();
  });

  it("discards and returns null on version mismatch", () => {
    store({ v: 99, elements: [liveElement] });
    expect(loadSnapshot()).toBeNull();
    expect(window.localStorage.getItem(LEGACY_KEY)).toBeNull();
  });

  it("returns null on corrupted JSON", () => {
    window.localStorage.setItem(LEGACY_KEY, "{not json");
    expect(loadSnapshot()).toBeNull();
  });
});
