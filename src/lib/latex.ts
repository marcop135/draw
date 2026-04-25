import katex from "katex";

/**
 * Render a LaTeX expression to an SVG data URL plus its measured size.
 * KaTeX is configured with `trust: false` and `strict: "error"` so untrusted
 * input cannot smuggle HTML or commands that escape the math sandbox.
 */
export async function renderLatex(
  tex: string,
  options: { displayMode?: boolean; fontSize?: number } = {},
): Promise<{ dataUrl: string; width: number; height: number }> {
  const fontSize = options.fontSize ?? 24;

  // Render to plain HTML with KaTeX (synchronous, throws on parse error).
  const html = katex.renderToString(tex, {
    displayMode: options.displayMode ?? true,
    throwOnError: true,
    output: "html",
    trust: false,
    strict: "error",
  });

  // Measure by mounting offscreen.
  const probe = document.createElement("div");
  probe.style.cssText = `
    position: absolute;
    left: -10000px;
    top: 0;
    visibility: hidden;
    font-size: ${fontSize}px;
    color: #000;
    background: transparent;
  `;
  probe.innerHTML = html;
  document.body.appendChild(probe);
  // Force layout.
  const rect = probe.getBoundingClientRect();
  const width = Math.max(1, Math.ceil(rect.width));
  const height = Math.max(1, Math.ceil(rect.height));
  document.body.removeChild(probe);

  // Wrap the rendered KaTeX HTML inside an SVG foreignObject so it stays
  // crisp at any zoom level. We embed the KaTeX stylesheet (already in the
  // bundle via `import "katex/dist/katex.min.css"` from the modal) by inlining
  // its computed styles. To keep things simple and avoid CSS scraping, we
  // embed only the minimum needed font-size / colour and rely on KaTeX's
  // inline styles which it emits per-glyph in `output: "html"` mode.
  const svgMarkup = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xhtml="http://www.w3.org/1999/xhtml" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <foreignObject width="${width}" height="${height}">
    <div xmlns="http://www.w3.org/1999/xhtml" style="font-size:${fontSize}px;color:#000;background:transparent;line-height:1.2;">
      ${html}
    </div>
  </foreignObject>
</svg>`;

  const dataUrl = `data:image/svg+xml;base64,${utf8ToBase64(svgMarkup)}`;
  return { dataUrl, width, height };
}

function utf8ToBase64(s: string): string {
  // Encode UTF-8 first so multi-byte characters survive btoa().
  const bytes = new TextEncoder().encode(s);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
