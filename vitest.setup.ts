/* Mermaid layout calls SVGTextElement.getBBox — jsdom does not implement it. */
if (typeof SVGElement !== "undefined" && !SVGElement.prototype.getBBox) {
  SVGElement.prototype.getBBox = function getBBoxStub(this: SVGElement) {
    const text = this.textContent ?? "";
    const w = Math.max(24, Math.min(400, 8 + text.length * 7));
    return new DOMRect(0, 0, w, 20);
  };
}
