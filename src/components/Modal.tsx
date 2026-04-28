import { useEffect, type ReactNode } from "react";
import { ArrowLeft, X } from "lucide-react";

type Props = {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
};

export function Modal({ title, onClose, children, footer }: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="app-modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="app-modal" role="dialog" aria-modal="true" aria-label={title}>
        <div className="app-modal-header">
          <button
            type="button"
            className="app-modal-back"
            onClick={onClose}
            aria-label="Close"
          >
            <ArrowLeft size={20} aria-hidden="true" />
          </button>
          <span className="app-modal-title">{title}</span>
          <button
            className="app-btn app-modal-close"
            type="button"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={16} aria-hidden="true" />
            <span className="btn-label">Close</span>
          </button>
        </div>
        <div className="app-modal-body">{children}</div>
        {footer ? <div className="app-modal-footer">{footer}</div> : null}
      </div>
    </div>
  );
}
