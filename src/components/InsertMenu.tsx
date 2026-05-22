import { useState } from "react";
import { BracesAsterisk, ChevronDown, Diagram3, Markdown } from "./icons";

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
        className={`app-btn${open ? " is-active" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        Insert
        <ChevronDown size={16} className="app-chevron" />
      </button>
      {open ? (
        <div className={`menu-pop${dark ? " dark" : ""}`} role="menu">
          <button onClick={() => { onPick("latex"); setOpen(false); }}>
            <BracesAsterisk size={20} />
            LaTeX
          </button>
          <button onClick={() => { onPick("mermaid"); setOpen(false); }}>
            <Diagram3 size={20} />
            Mermaid
          </button>
          <button onClick={() => { onPick("markdown"); setOpen(false); }}>
            <Markdown size={20} />
            Markdown
          </button>
        </div>
      ) : null}
    </div>
  );
}
