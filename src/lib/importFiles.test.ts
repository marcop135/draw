import { describe, expect, it } from "vitest";
import { boardNameFromFile, fitImage, isImageFile, isSceneFile } from "./importFiles";

describe("importFiles helpers", () => {
  it("recognises scene files by extension or type", () => {
    expect(isSceneFile({ name: "plan.excalidraw", type: "" })).toBe(true);
    expect(isSceneFile({ name: "x", type: "application/vnd.excalidraw+json" })).toBe(true);
    expect(isSceneFile({ name: "photo.png", type: "image/png" })).toBe(false);
  });

  it("accepts only image types Excalidraw can place", () => {
    expect(isImageFile({ type: "image/jpeg" })).toBe(true);
    expect(isImageFile({ type: "image/svg+xml" })).toBe(true);
    expect(isImageFile({ type: "image/tiff" })).toBe(false);
  });

  it("names boards after the file", () => {
    expect(boardNameFromFile("Q3 plan.excalidraw")).toBe("Q3 plan");
    expect(boardNameFromFile(".excalidraw")).toBe("Imported");
  });

  it("fits large images in 800px and leaves small ones alone", () => {
    expect(fitImage(1600, 1200)).toEqual({ width: 800, height: 600 });
    expect(fitImage(300, 200)).toEqual({ width: 300, height: 200 });
  });
});
