import { useState } from "react";
import { Modal } from "./Modal";
import { insertMermaid } from "../lib/mermaid";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";

type Props = {
  api: ExcalidrawImperativeAPI;
  onClose: () => void;
};

const SAMPLE = `flowchart TD
  A[Start] --> B{Decision}
  B -- yes --> C[Do this]
  B -- no  --> D[Do that]
  C --> E[Done]
  D --> E[Done]`;

export function MermaidModal({ api, onClose }: Props) {
  const [src, setSrc] = useState(SAMPLE);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function insert() {
    setBusy(true);
    setError(null);
    try {
      await insertMermaid(api, src);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Mermaid parse failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal
      title="Insert Mermaid diagram"
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
            {busy ? "Rendering…" : "Insert"}
          </button>
        </>
      }
    >
      <label htmlFor="mermaid-input">Mermaid source (flowcharts work best)</label>
      <textarea
        id="mermaid-input"
        value={src}
        onChange={(e) => setSrc(e.target.value)}
        spellCheck={false}
        autoFocus
        style={{ minHeight: 220 }}
      />
      {error ? <p className="app-error">{error}</p> : null}
    </Modal>
  );
}
