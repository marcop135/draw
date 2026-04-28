import { useState } from "react";
import { Plus, Sigma, GitBranch, FileText } from "lucide-react";

type InsertKind = "latex" | "mermaid" | "markdown";

type Props = {
  onPick: (kind: InsertKind) => void;
  dark: boolean;
};

export function InsertMenu({ onPick, dark }: Props) {
  const [open, setOpen] = useState(false);

  function pick(kind: InsertKind) {
    onPick(kind);
    setOpen(false);
  }

  return (
    <div className="menu-anchor">
      <button
        type="button"
        className="app-btn app-fab app-fab-primary"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Insert"
      >
        <Plus size={18} aria-hidden="true" />
        <span className="btn-label">Insert</span>
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
            <button onClick={() => pick("latex")}>
              <Sigma size={20} aria-hidden="true" />
              <span>LaTeX</span>
            </button>
            <button onClick={() => pick("mermaid")}>
              <GitBranch size={20} aria-hidden="true" />
              <span>Mermaid</span>
            </button>
            <button onClick={() => pick("markdown")}>
              <FileText size={20} aria-hidden="true" />
              <span>Markdown</span>
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
