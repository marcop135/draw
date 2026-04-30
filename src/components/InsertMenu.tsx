import { useState } from "react";

type InsertKind = "latex" | "mermaid" | "markdown";

type Props = {
  onPick: (kind: InsertKind) => void;
  dark: boolean;
};

export function InsertMenu({ onPick, dark }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <div className="menu-anchor">
      <button
        type="button"
        className="app-btn"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        Insert ▾
      </button>
      {open ? (
        <div className={`menu-pop${dark ? " dark" : ""}`} role="menu">
          <button onClick={() => { onPick("latex"); setOpen(false); }}>
            LaTeX
          </button>
          <button onClick={() => { onPick("mermaid"); setOpen(false); }}>
            Mermaid
          </button>
          <button onClick={() => { onPick("markdown"); setOpen(false); }}>
            Markdown
          </button>
        </div>
      ) : null}
    </div>
  );
}
