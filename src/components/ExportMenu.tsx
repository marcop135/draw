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
  CaretDown,
  FileImage,
  FilePdf,
  FileSvg,
  PencilSimpleLine,
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
        className="app-btn"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        Export
        <CaretDown size={18} weight="bold" className="app-chevron" aria-hidden />
      </button>
      {open ? (
        <div className={`menu-pop${dark ? " dark" : ""}`} role="menu">
          <button onClick={() => run(exportExcalidraw)} disabled={busy}>
            <PencilSimpleLine size={22} weight="fill" aria-hidden />
            Excalidraw (.excalidraw)
          </button>
          <button onClick={() => run(exportPng)} disabled={busy}>
            <FileImage size={22} weight="fill" aria-hidden />
            PNG
          </button>
          <button onClick={() => run(exportJpeg)} disabled={busy}>
            <FileImage size={22} weight="fill" aria-hidden />
            JPEG
          </button>
          <button onClick={() => run(exportSvg)} disabled={busy}>
            <FileSvg size={22} weight="fill" aria-hidden />
            SVG
          </button>
          <button onClick={() => run(exportPdf)} disabled={busy}>
            <FilePdf size={22} weight="fill" aria-hidden />
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
