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

  // Render to MathML with KaTeX (synchronous, throws on parse error). The
  // result becomes an <img>-loaded SVG, which cannot reach KaTeX's stylesheet
  // or fonts; KaTeX's HTML output needs both for superscripts, fractions and
  // roots, while MathML is laid out by the browser itself.
  const rendered = katex.renderToString(tex, {
    displayMode: options.displayMode ?? true,
    throwOnError: true,
    output: "mathml",
    trust: false,
    strict: "error",
  });
  // Keep only the <math> element: the page's `.katex` rules would otherwise
  // size the probe differently from the stylesheet-less image.
  const html = rendered.slice(
    rendered.indexOf("<math"),
    rendered.lastIndexOf("</math>") + "</math>".length,
  );
  const boxStyle =
    `display:inline-block;padding:0.15em 0.25em;font-size:${fontSize}px;` +
    `font-family:math,'Cambria Math','STIX Two Math','Latin Modern Math',serif;` +
    `line-height:1.2;color:#000;background:transparent;`;

  // Measure by mounting offscreen.
  const probe = document.createElement("div");
  probe.style.cssText = `position:absolute;left:-10000px;top:0;visibility:hidden;${boxStyle}`;
  probe.innerHTML = html;
  document.body.appendChild(probe);
  // Force layout.
  const rect = probe.getBoundingClientRect();
  const width = Math.max(1, Math.ceil(rect.width));
  const height = Math.max(1, Math.ceil(rect.height));
  document.body.removeChild(probe);

  // Wrap the MathML inside an SVG foreignObject so it stays crisp at any
  // zoom level.
  const svgMarkup = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xhtml="http://www.w3.org/1999/xhtml" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <foreignObject width="${width}" height="${height}">
    <div xmlns="http://www.w3.org/1999/xhtml" style="${boxStyle}">
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
