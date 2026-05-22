import { useState } from "react";
import {
  exportExcalidraw,
  exportPng,
  exportJpeg,
  exportSvg,
  exportPdf,
  type SceneSnapshot,
} from "../lib/export";
import {
  ChevronDown,
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
        className={`app-btn${open ? " is-active" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        Export
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
          <button onClick={() => run(exportJpeg)} disabled={busy}>
            <FiletypeJpg size={20} />
            JPEG
          </button>
          <button onClick={() => run(exportSvg)} disabled={busy}>
            <FiletypeSvg size={20} />
            SVG
          </button>
          <button onClick={() => run(exportPdf)} disabled={busy}>
            <FiletypePdf size={20} />
            PDF
          </button>
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
