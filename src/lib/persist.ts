// Reader for the pre-IndexedDB autosave in localStorage. Boards (boards.ts)
// replaced it; openInitialBoard copies a stored scene once and leaves it in
// place so a rollback to a pre-boards release still finds it.
import type { NonDeletedExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import type { AppState, BinaryFiles } from "@excalidraw/excalidraw/types";

export const LEGACY_KEY = "draw:scene:v1";

export type PersistedSnapshot = {
  v: 1;
  elements: readonly NonDeletedExcalidrawElement[];
  appState: Partial<AppState>;
  files: BinaryFiles;
};

export function loadSnapshot(): PersistedSnapshot | null {
  try {
    const raw = window.localStorage.getItem(LEGACY_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PersistedSnapshot>;
    if (parsed?.v !== 1 || !Array.isArray(parsed.elements)) {
      window.localStorage.removeItem(LEGACY_KEY);
      return null;
    }
    if (!parsed.elements.some((el) => !el.isDeleted)) return null;
    return {
      v: 1,
      elements: parsed.elements as NonDeletedExcalidrawElement[],
      appState: parsed.appState ?? {},
      files: parsed.files ?? {},
    };
  } catch {
    return null;
  }
}
