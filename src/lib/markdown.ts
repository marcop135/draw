import { marked } from "marked";
import DOMPurify from "dompurify";

export const MARKDOWN_SANITIZE_CONFIG: DOMPurify.Config = {
  USE_PROFILES: { html: true },
  FORBID_TAGS: ["script", "iframe", "object", "embed", "form", "input"],
  FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover", "style"],
  ALLOWED_URI_REGEXP:
    /^(?:(?:https?|mailto):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
};

/**
 * Render Markdown to a sanitized HTML string, then wrap inside an SVG
 * foreignObject and return as a data URL. The HTML is purified with DOMPurify
 * before it ever lands on the page or in the SVG, so user input cannot
 * execute or load anything.
 */
export async function renderMarkdown(
  source: string,
  options: { width?: number; fontSize?: number } = {},
): Promise<{ dataUrl: string; width: number; height: number }> {
  const width = options.width ?? 480;
  const fontSize = options.fontSize ?? 16;

  marked.setOptions({ gfm: true, breaks: true });
  const rawHtml = await marked.parse(source);

  const cleanHtml = DOMPurify.sanitize(rawHtml, MARKDOWN_SANITIZE_CONFIG);

  // Measure by mounting offscreen so the SVG is sized to fit the content.
  const probe = document.createElement("div");
  probe.style.cssText = `
    position: absolute;
    left: -10000px;
    top: 0;
    visibility: hidden;
    width: ${width}px;
    font-size: ${fontSize}px;
    line-height: 1.4;
    font-family: system-ui, sans-serif;
    color: #1a1a1a;
    background: transparent;
    box-sizing: border-box;
    padding: 8px;
  `;
  probe.innerHTML = cleanHtml;
  document.body.appendChild(probe);
  const rect = probe.getBoundingClientRect();
  const height = Math.max(1, Math.ceil(rect.height));
  document.body.removeChild(probe);

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xhtml="http://www.w3.org/1999/xhtml" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <foreignObject width="${width}" height="${height}">
    <div xmlns="http://www.w3.org/1999/xhtml" style="font-family:system-ui,sans-serif;font-size:${fontSize}px;line-height:1.4;color:#1a1a1a;padding:8px;box-sizing:border-box;">
      ${cleanHtml}
    </div>
  </foreignObject>
</svg>`;

  const dataUrl = `data:image/svg+xml;base64,${utf8ToBase64(svg)}`;
  return { dataUrl, width, height };
}

function utf8ToBase64(s: string): string {
  const bytes = new TextEncoder().encode(s);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
