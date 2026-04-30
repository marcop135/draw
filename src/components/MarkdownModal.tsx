import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { marked } from "marked";
import { Modal } from "./Modal";
import { MARKDOWN_SANITIZE_CONFIG, renderMarkdown } from "../lib/markdown";
import { insertImageElement } from "../lib/insertImage";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";

type Props = {
  api: ExcalidrawImperativeAPI;
  onClose: () => void;
};

const SAMPLE = `# Heading

- bullet point
- **bold** and *italic*

\`inline code\` and a [link](https://example.com).

\`\`\`
some code block
\`\`\`
`;

export function MarkdownModal({ api, onClose }: Props) {
  const [src, setSrc] = useState(SAMPLE);
  const [previewHtml, setPreviewHtml] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        marked.setOptions({ gfm: true, breaks: true });
        const raw = await marked.parse(src);
        if (cancelled) return;
        setPreviewHtml(DOMPurify.sanitize(raw, MARKDOWN_SANITIZE_CONFIG));
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Markdown render failed.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [src]);

  async function insert() {
    setBusy(true);
    setError(null);
    try {
      const out = await renderMarkdown(src, { width: 480, fontSize: 16 });
      await insertImageElement(api, {
        dataUrl: out.dataUrl,
        width: out.width,
        height: out.height,
        mimeType: "image/svg+xml",
      });
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to render Markdown.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal
      title="Insert Markdown"
      onClose={onClose}
      footer={
        <>
          <button className="app-btn" onClick={onClose} disabled={busy}>
            Cancel
          </button>
          <button
            className="app-btn"
            onClick={insert}
            disabled={busy || !src.trim()}
          >
            Insert
          </button>
        </>
      }
    >
      <label htmlFor="md-input" style={{ fontSize: 13 }}>
        Markdown
      </label>
      <textarea
        id="md-input"
        value={src}
        onChange={(e) => setSrc(e.target.value)}
        spellCheck={false}
        autoFocus
      />
      <div>
        <div style={{ fontSize: 13, marginBottom: 6 }}>Preview</div>
        <div
          className="app-preview"
          dangerouslySetInnerHTML={{ __html: previewHtml }}
        />
      </div>
      {error ? <p className="app-error">{error}</p> : null}
    </Modal>
  );
}
