import { useState, type FormEvent, type KeyboardEvent } from "react";
import { Modal } from "./Modal";
import { PencilSquare, PlusSquare, Trash } from "./icons";
import { formatUpdated, type BoardMeta } from "../lib/boards";

type Props = {
  boards: BoardMeta[];
  currentId: string;
  onOpen: (id: string) => void;
  onCreate: () => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
};

export function BoardsModal({
  boards,
  currentId,
  onOpen,
  onCreate,
  onRename,
  onDelete,
  onClose,
}: Props) {
  const [renaming, setRenaming] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  function startRename(board: BoardMeta) {
    setConfirmDelete(null);
    setRenaming(board.id);
    setDraft(board.name);
  }

  function commitRename(e?: FormEvent) {
    e?.preventDefault();
    const name = draft.trim();
    if (renaming && name) onRename(renaming, name);
    setRenaming(null);
  }

  function onRenameKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Escape") return;
    // Cancel the rename without letting the Modal's Escape close the dialog.
    e.nativeEvent.stopPropagation();
    setRenaming(null);
  }

  return (
    <Modal title="Boards" onClose={onClose}>
      <button type="button" className="app-btn boards-new" onClick={onCreate}>
        <PlusSquare size={18} />
        New board
      </button>
      <ul className="boards-list" aria-label="Saved boards">
        {boards.map((board) => {
          const current = board.id === currentId;
          return (
            <li key={board.id} className={`boards-row${current ? " is-current" : ""}`}>
              {renaming === board.id ? (
                <form className="boards-rename" onSubmit={commitRename}>
                  <input
                    aria-label="Board name"
                    value={draft}
                    maxLength={80}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={onRenameKey}
                    onBlur={() => commitRename()}
                    autoFocus
                  />
                </form>
              ) : (
                <button
                  type="button"
                  className="boards-open"
                  onClick={() => onOpen(board.id)}
                  aria-current={current ? "true" : undefined}
                >
                  <span className="boards-name">{board.name}</span>
                  <span className="boards-meta">
                    {current ? "Open now · " : ""}
                    {formatUpdated(board.updated)}
                  </span>
                </button>
              )}
              {confirmDelete === board.id ? (
                <span className="boards-confirm">
                  <button
                    type="button"
                    className="app-btn boards-danger"
                    onClick={() => {
                      setConfirmDelete(null);
                      onDelete(board.id);
                    }}
                  >
                    Delete
                  </button>
                  <button type="button" className="app-btn" onClick={() => setConfirmDelete(null)}>
                    Keep
                  </button>
                </span>
              ) : (
                <span className="boards-actions">
                  <button
                    type="button"
                    className="app-btn"
                    aria-label={`Rename ${board.name}`}
                    title="Rename"
                    onClick={() => startRename(board)}
                  >
                    <PencilSquare size={16} />
                  </button>
                  <button
                    type="button"
                    className="app-btn"
                    aria-label={`Delete ${board.name}`}
                    title="Delete"
                    onClick={() => {
                      setRenaming(null);
                      setConfirmDelete(board.id);
                    }}
                  >
                    <Trash size={16} />
                  </button>
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </Modal>
  );
}
