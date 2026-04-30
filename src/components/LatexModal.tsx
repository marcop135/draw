import { useEffect, useMemo, useState } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import { Modal } from "./Modal";
import { renderLatex } from "../lib/latex";
import { insertImageElement } from "../lib/insertImage";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";

type Props = {
  api: ExcalidrawImperativeAPI;
  onClose: () => void;
};

const SAMPLE = "\\int_{0}^{\\infty} e^{-x^{2}}\\,dx = \\frac{\\sqrt{\\pi}}{2}";

export function LatexModal({ api, onClose }: Props) {
  const [tex, setTex] = useState(SAMPLE);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Live preview HTML.
  const previewHtml = useMemo(() => {
    try {
      const html = katex.renderToString(tex, {
        displayMode: true,
        throwOnError: true,
        output: "html",
        trust: false,
        strict: "error",
      });
      return { html, error: null as string | null };
    } catch (e) {
      return {
        html: "",
        error: e instanceof Error ? e.message : "Invalid LaTeX",
      };
    }
  }, [tex]);

  useEffect(() => {
    setError(previewHtml.error);
  }, [previewHtml.error]);

  async function insert() {
    setBusy(true);
    setError(null);
    try {
      const out = await renderLatex(tex, { displayMode: true, fontSize: 24 });
      await insertImageElement(api, {
        dataUrl: out.dataUrl,
        width: out.width,
        height: out.height,
        mimeType: "image/svg+xml",
      });
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to render LaTeX.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal
      title="Insert LaTeX"
      onClose={onClose}
      footer={
        <>
          <button className="app-btn" onClick={onClose} disabled={busy}>
            Cancel
          </button>
          <button
            className="app-btn"
            onClick={insert}
            disabled={busy || !!previewHtml.error || !tex.trim()}
          >
            Insert
          </button>
        </>
      }
    >
      <label htmlFor="latex-input" style={{ fontSize: 13 }}>
        LaTeX (math mode)
      </label>
      <textarea
        id="latex-input"
        value={tex}
        onChange={(e) => setTex(e.target.value)}
        spellCheck={false}
        autoFocus
      />
      <div>
        <div style={{ fontSize: 13, marginBottom: 6 }}>Preview</div>
        <div className="app-preview">
          {previewHtml.error ? (
            <p className="app-error">{previewHtml.error}</p>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: previewHtml.html }} />
          )}
        </div>
      </div>
      {error && error !== previewHtml.error ? (
        <p className="app-error">{error}</p>
      ) : null}
    </Modal>
  );
}
