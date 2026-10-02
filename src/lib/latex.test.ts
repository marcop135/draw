import { describe, expect, it } from "vitest";

import { renderLatex } from "./latex";

function decodeSvg(dataUrl: string): string {
  const b64 = dataUrl.replace(/^data:image\/svg\+xml;base64,/, "");
  const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

describe("renderLatex", () => {
  it("embeds MathML so superscripts keep their layout without KaTeX CSS", async () => {
    const { dataUrl } = await renderLatex("a^2 + b^2 = c^2");
    const svg = decodeSvg(dataUrl);
    expect(svg).toContain('<math xmlns="http://www.w3.org/1998/Math/MathML"');
    expect(svg.match(/<msup>/g)).toHaveLength(3);
    expect(svg).not.toContain("katex-html");
    expect(svg).not.toContain('class="katex"');
  });

  it("produces well-formed SVG markup", async () => {
    const { dataUrl } = await renderLatex(String.raw`\frac{\sqrt{x}}{2} < 1 \;\&\; y`);
    const doc = new DOMParser().parseFromString(decodeSvg(dataUrl), "image/svg+xml");
    expect(doc.getElementsByTagName("parsererror")).toHaveLength(0);
    expect(doc.getElementsByTagName("mfrac")).toHaveLength(1);
  });

  it("throws on invalid TeX", async () => {
    await expect(renderLatex("\\nope{")).rejects.toThrow();
  });
});
