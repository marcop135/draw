type Props = {
  onRestore: () => void;
  onDiscard: () => void;
};

export function RestoreChip({ onRestore, onDiscard }: Props) {
  return (
    <div className="restore-chip" role="status" aria-live="polite">
      <span className="restore-chip-text">Restore last session?</span>
      <button
        type="button"
        className="app-btn restore-chip-primary"
        onClick={onRestore}
      >
        Restore
      </button>
      <button
        type="button"
        className="app-btn restore-chip-secondary"
        onClick={onDiscard}
        aria-label="Discard saved session"
      >
        Discard
      </button>
    </div>
  );
}
