/**
 * Excalidraw appends an esm.sh CDN copy to every font's `src` as a fallback.
 * The fonts are self-hosted under /fonts/ and the CSP allows `font-src 'self'`
 * only, so Chrome reports a CSP violation per font face (hundreds for the CJK
 * family) the moment the FontFace is created. Strip the CDN sources so only
 * the local copies are declared. Call before Excalidraw mounts.
 */
const CDN_SOURCE = /^url\(\s*["']?https:\/\/esm\.sh\//;

/** Splits a `src` list on top-level commas (data: URLs contain commas too). */
function splitSources(source: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < source.length; i++) {
    const ch = source[i];
    if (ch === "(") depth++;
    else if (ch === ")") depth--;
    else if (ch === "," && depth === 0) {
      parts.push(source.slice(start, i));
      start = i + 1;
    }
  }
  parts.push(source.slice(start));
  return parts.map((part) => part.trim()).filter(Boolean);
}

export function stripCdnFontSources(source: string): string {
  const kept = splitSources(source).filter((part) => !CDN_SOURCE.test(part));
  return kept.length > 0 ? kept.join(", ") : source;
}

type FontFaceHost = { FontFace?: typeof FontFace };

export function installLocalFontFace(
  target: FontFaceHost = window as FontFaceHost,
): void {
  const NativeFontFace = target.FontFace;
  if (!NativeFontFace) return;
  class LocalFontFace extends NativeFontFace {
    constructor(
      family: string,
      source: string | BufferSource,
      descriptors?: FontFaceDescriptors,
    ) {
      super(
        family,
        typeof source === "string" ? stripCdnFontSources(source) : source,
        descriptors,
      );
    }
  }
  target.FontFace = LocalFontFace;
}
