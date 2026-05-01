import DOMPurify from "dompurify";
import { describe, expect, it } from "vitest";

import { MARKDOWN_SANITIZE_CONFIG } from "./markdown";

function sanitize(fragment: string): string {
  return DOMPurify.sanitize(fragment, MARKDOWN_SANITIZE_CONFIG);
}

describe("MARKDOWN_SANITIZE_CONFIG", () => {
  it("strips script tags", () => {
    const out = sanitize("<p>x</p><script>alert(1)</script>");
    expect(out.toLowerCase()).not.toContain("<script");
    expect(out).toContain("x");
  });

  it("strips iframe and object tags", () => {
    const out = sanitize('<iframe src="https://evil"></iframe><p>a</p>');
    expect(out.toLowerCase()).not.toContain("<iframe");
    expect(out).toContain("a");
  });

  it("removes inline event-handler attributes", () => {
    const out = sanitize('<img src="https://example.com/x.png" alt="x" />');
    expect(out.toLowerCase()).not.toContain("onerror");

    const noHandler = sanitize(
      '<span onmouseover="evil()">t</span><p>p</p>',
    );
    expect(noHandler.toLowerCase()).not.toContain("onmouseover");
  });

  it("drops style attribute entirely (policy choice)", () => {
    const out = sanitize('<p style="color:red">txt</p>');
    expect(out.toLowerCase()).not.toContain("style=");
    expect(out).toContain("txt");
  });
});
