import { parseMermaidToExcalidraw } from "@excalidraw/mermaid-to-excalidraw";
import { describe, expect, it } from "vitest";

describe("parseMermaidToExcalidraw", () => {
  it("returns elements for a minimal flowchart", async () => {
    const { elements } = await parseMermaidToExcalidraw(
      `flowchart TD
  A[Start] --> B[End]`,
      { themeVariables: { fontSize: "16px" } },
    );
    expect(elements.length).toBeGreaterThan(0);
  });

  it("throws on empty string source", async () => {
    await expect(parseMermaidToExcalidraw("", {})).rejects.toThrow();
  });
});
