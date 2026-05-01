import katex from "katex";
import { describe, expect, it } from "vitest";

describe("KaTeX options (match renderLatex)", () => {
  it("renders simple math with trust disabled and strict error mode", () => {
    const html = katex.renderToString("x^2 + y^2 = r^2", {
      displayMode: true,
      throwOnError: true,
      output: "html",
      trust: false,
      strict: "error",
    });
    expect(html).toMatch(/katex/i);
    expect(html).toContain("x");
  });

  it("throws on invalid TeX with throwOnError", () => {
    expect(() =>
      katex.renderToString("\\nope{", {
        displayMode: true,
        throwOnError: true,
        output: "html",
        trust: false,
        strict: "error",
      }),
    ).toThrow();
  });
});
