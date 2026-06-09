import { useEffect, useRef, useState } from "react";
import { BracesAsterisk, ChevronDown, Markdown, PlusSquare } from "./icons";

type InsertKind = "latex" | "markdown";

type Props = {
  onPick: (kind: InsertKind) => void;
  dark: boolean;
};

export function InsertMenu({ onPick, dark }: Props) {
  const [open, setOpen] = useState(false);
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

  return (
    <div className="menu-anchor" ref={anchorRef}>
      <button
        ref={triggerRef}
        type="button"
        className={`app-btn${open ? " is-active" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Insert"
      >
        <PlusSquare size={18} className="app-btn-icon" />
        <span className="app-btn-label">Insert</span>
        <ChevronDown size={16} className="app-chevron" />
      </button>
      {open ? (
        <div className={`menu-pop${dark ? " dark" : ""}`} role="menu">
          <button role="menuitem" onClick={() => { onPick("latex"); setOpen(false); }}>
            <BracesAsterisk size={20} />
            LaTeX
          </button>
          <button role="menuitem" onClick={() => { onPick("markdown"); setOpen(false); }}>
            <Markdown size={20} />
            Markdown
          </button>
        </div>
      ) : null}
    </div>
  );
}
