import { useState } from "react";
import {
  copyPngToClipboard,
  exportExcalidraw,
  exportPng,
  exportJpeg,
  exportSvg,
  exportPdf,
  type PdfOrientation,
  type SceneSnapshot,
} from "../lib/export";
import {
  ChevronDown,
  Clipboard,
  Download,
  FiletypeJpg,
  FiletypePdf,
  FiletypePng,
  FiletypeSvg,
  PencilSquare,
} from "./icons";

type Props = {
  getScene: () => SceneSnapshot;
  dark: boolean;
};

const clipboardSupported =
  typeof navigator !== "undefined" &&
  !!navigator.clipboard &&
  typeof navigator.clipboard.write === "function" &&
  typeof ClipboardItem !== "undefined";

export function ExportMenu({ getScene, dark }: Props) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orientation, setOrientation] = useState<PdfOrientation>("auto");

  async function run(fn: (s: SceneSnapshot) => Promise<void>) {
    setBusy(true);
    setError(null);
    try {
      await fn(getScene());
      setOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Export failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="menu-anchor">
      <button
        type="button"
        className={`app-btn${open ? " is-active" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Download size={18} className="app-btn-icon" />
        <span className="app-btn-label">Export</span>
        <ChevronDown size={16} className="app-chevron" />
      </button>
      {open ? (
        <div className={`menu-pop${dark ? " dark" : ""}`} role="menu">
          <button onClick={() => run(exportExcalidraw)} disabled={busy}>
            <PencilSquare size={20} />
            Excalidraw (.excalidraw)
          </button>
          <button onClick={() => run(exportPng)} disabled={busy}>
            <FiletypePng size={20} />
            PNG
          </button>
          <button
            onClick={() => run(copyPngToClipboard)}
            disabled={busy || !clipboardSupported}
            title={
              clipboardSupported
                ? "Copy a PNG of the canvas to the clipboard"
                : "Clipboard image copy not supported in this browser"
            }
          >
            <Clipboard size={20} />
            Copy PNG to clipboard
          </button>
          <button onClick={() => run(exportJpeg)} disabled={busy}>
            <FiletypeJpg size={20} />
            JPEG
          </button>
          <button onClick={() => run(exportSvg)} disabled={busy}>
            <FiletypeSvg size={20} />
            SVG
          </button>
          <button
            onClick={() => run((s) => exportPdf(s, orientation))}
            disabled={busy}
          >
            <FiletypePdf size={20} />
            PDF
          </button>
          <div className="menu-pop-row" role="group" aria-label="PDF orientation">
            <span className="menu-pop-label">PDF</span>
            {(["auto", "portrait", "landscape"] as PdfOrientation[]).map((o) => (
              <button
                key={o}
                type="button"
                className={`menu-pop-pill${orientation === o ? " is-active" : ""}`}
                onClick={() => setOrientation(o)}
                aria-pressed={orientation === o}
              >
                {o}
              </button>
            ))}
          </div>
          {error ? (
            <p className="app-error" style={{ padding: "6px 12px" }}>
              {error}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
