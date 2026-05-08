import { useState } from "react";
import {
  CaretDown,
  FunctionIcon,
  GraphIcon,
  MarkdownLogo,
} from "./icons";

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
        Insert
        <CaretDown size={18} weight="bold" className="app-chevron" aria-hidden />
      </button>
      {open ? (
        <div className={`menu-pop${dark ? " dark" : ""}`} role="menu">
          <button onClick={() => { onPick("latex"); setOpen(false); }}>
            <FunctionIcon size={22} weight="bold" aria-hidden />
            LaTeX
          </button>
          <button onClick={() => { onPick("mermaid"); setOpen(false); }}>
            <GraphIcon size={22} weight="bold" aria-hidden />
            Mermaid
          </button>
          <button onClick={() => { onPick("markdown"); setOpen(false); }}>
            <MarkdownLogo size={22} weight="bold" aria-hidden />
            Markdown
          </button>
        </div>
      ) : null}
    </div>
  );
}
