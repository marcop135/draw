import { describe, expect, it } from "vitest";
import { installLocalFontFace, stripCdnFontSources } from "./localFontFace";

const LOCAL =
  "url(https://draw.marcopontili.com/fonts/Excalifont/Excalifont-Regular-a1.woff2) format('woff2')";
const CDN =
  "url(https://esm.sh/@excalidraw/excalidraw@0.18.1/dist/prod/fonts/Excalifont/Excalifont-Regular-a1.woff2) format('woff2')";

describe("stripCdnFontSources", () => {
  it("drops the esm.sh fallback and keeps the local source", () => {
    expect(stripCdnFontSources(`${LOCAL}, ${CDN}`)).toBe(LOCAL);
  });

  it("leaves sources without a CDN entry unchanged", () => {
    expect(stripCdnFontSources(LOCAL)).toBe(LOCAL);
    expect(stripCdnFontSources("url(data:font/woff2;base64,AAAA)")).toBe(
      "url(data:font/woff2;base64,AAAA)",
    );
  });
});

describe("installLocalFontFace", () => {
  it("passes stripped sources to the native FontFace", () => {
    const calls: unknown[] = [];
    class FakeFontFace {
      constructor(family: string, source: unknown) {
        calls.push([family, source]);
      }
    }
    const target = { FontFace: FakeFontFace as unknown as typeof FontFace };
    installLocalFontFace(target);
    new target.FontFace!("Excalifont", `${LOCAL}, ${CDN}`);
    expect(calls).toEqual([["Excalifont", LOCAL]]);
  });
});
