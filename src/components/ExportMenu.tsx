import { useEffect, useRef, useState } from "react";
import {
  copyPngToClipboard,
  exportExcalidraw,
  exportPng,
  exportJpeg,
  exportSvg,
  exportPdf,
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
  const anchorRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    function onPointer(e: PointerEvent) {
      if (!anchorRef.current?.contains(e.target as Node)) setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

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
    <div className="menu-anchor" ref={anchorRef}>
      <button
        ref={triggerRef}
        type="button"
        className={`app-btn${open ? " is-active" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Export"
      >
        <Download size={18} className="app-btn-icon" />
        <span className="app-btn-label">Export</span>
        <ChevronDown size={16} className="app-chevron" />
      </button>
      {open ? (
        <div className={`menu-pop${dark ? " dark" : ""}`} role="menu">
          <button role="menuitem" onClick={() => run(exportExcalidraw)} disabled={busy}>
            <PencilSquare size={20} />
            Excalidraw (.excalidraw)
          </button>
          <button role="menuitem" onClick={() => run(exportPng)} disabled={busy}>
            <FiletypePng size={20} />
            PNG
          </button>
          <button
            role="menuitem"
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
          <button role="menuitem" onClick={() => run(exportJpeg)} disabled={busy}>
            <FiletypeJpg size={20} />
            JPEG
          </button>
          <button role="menuitem" onClick={() => run(exportSvg)} disabled={busy}>
            <FiletypeSvg size={20} />
            SVG
          </button>
          <div className="menu-pop-pdf" role="group" aria-label="Export PDF">
            <FiletypePdf size={20} />
            <span className="menu-pop-pdf-label">PDF</span>
            <button
              type="button"
              role="menuitem"
              className="menu-pop-pill"
              onClick={() => run((s) => exportPdf(s, "auto"))}
              disabled={busy}
              aria-label="Export PDF, automatic orientation"
              title="Export PDF, orientation derived from canvas ratio"
            >
              auto
            </button>
            <button
              type="button"
              role="menuitem"
              className="menu-pop-pill"
              onClick={() => run((s) => exportPdf(s, "portrait"))}
              disabled={busy}
              aria-label="Export PDF, portrait orientation"
              title="Export PDF in portrait orientation"
            >
              portrait
            </button>
            <button
              type="button"
              role="menuitem"
              className="menu-pop-pill"
              onClick={() => run((s) => exportPdf(s, "landscape"))}
              disabled={busy}
              aria-label="Export PDF, landscape orientation"
              title="Export PDF in landscape orientation"
            >
              landscape
            </button>
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
