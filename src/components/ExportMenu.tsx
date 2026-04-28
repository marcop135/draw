import { useState } from "react";
import {
  Download,
  FileJson,
  Image as ImageIcon,
  FileImage,
  FileText,
} from "lucide-react";
import {
  exportExcalidraw,
  exportPng,
  exportJpeg,
  exportSvg,
  exportPdf,
  type SceneSnapshot,
} from "../lib/export";

type Props = {
  getScene: () => SceneSnapshot;
  dark: boolean;
};

export function ExportMenu({ getScene, dark }: Props) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        className="app-btn app-fab"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Export"
      >
        <Download size={18} aria-hidden="true" />
        <span className="btn-label">Export</span>
      </button>
      {open ? (
        <>
          <div
            className="menu-scrim"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className={`menu-pop${dark ? " dark" : ""}`} role="menu">
            <div className="sheet-handle" aria-hidden="true" />
            <button onClick={() => run(exportExcalidraw)} disabled={busy}>
              <FileJson size={20} aria-hidden="true" />
              <span>Excalidraw (.excalidraw)</span>
            </button>
            <button onClick={() => run(exportPng)} disabled={busy}>
              <ImageIcon size={20} aria-hidden="true" />
              <span>PNG</span>
            </button>
            <button onClick={() => run(exportJpeg)} disabled={busy}>
              <ImageIcon size={20} aria-hidden="true" />
              <span>JPEG</span>
            </button>
            <button onClick={() => run(exportSvg)} disabled={busy}>
              <FileImage size={20} aria-hidden="true" />
              <span>SVG</span>
            </button>
            <button onClick={() => run(exportPdf)} disabled={busy}>
              <FileText size={20} aria-hidden="true" />
              <span>PDF</span>
            </button>
            {error ? (
              <p className="app-error" style={{ padding: "6px 12px" }}>
                {error}
              </p>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
}
