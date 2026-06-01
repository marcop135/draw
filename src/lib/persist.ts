import type {
  ExcalidrawElement,
  NonDeletedExcalidrawElement,
} from "@excalidraw/excalidraw/element/types";
import type {
  AppState,
  BinaryFiles,
} from "@excalidraw/excalidraw/types";

const KEY = "draw:scene:v1";

export type PersistedSnapshot = {
  v: 1;
  elements: readonly NonDeletedExcalidrawElement[];
  appState: Partial<AppState>;
  files: BinaryFiles;
};

export type SaveInput = {
  elements: readonly ExcalidrawElement[];
  appState: Partial<AppState>;
  files: BinaryFiles;
};

function hasLiveContent(elements: readonly ExcalidrawElement[]): boolean {
  return elements.some((el) => !el.isDeleted);
}

export function loadSnapshot(): PersistedSnapshot | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PersistedSnapshot>;
    if (parsed?.v !== 1 || !Array.isArray(parsed.elements)) {
      window.localStorage.removeItem(KEY);
      return null;
    }
    if (!hasLiveContent(parsed.elements)) return null;
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

export function saveSnapshot(input: SaveInput): void {
  try {
    const live = input.elements.filter((el) => !el.isDeleted);
    if (live.length === 0) {
      window.localStorage.removeItem(KEY);
      return;
    }
    const payload: PersistedSnapshot = {
      v: 1,
      elements: live as NonDeletedExcalidrawElement[],
      // collaborators is a Map which doesn't JSON-serialize; strip it.
      appState: stripUnserializable(input.appState),
      files: input.files,
    };
    window.localStorage.setItem(KEY, JSON.stringify(payload));
  } catch {
    // Private mode, quota, or a non-serializable field. Silently drop;
    // the in-memory scene is unaffected.
  }
}

export function clearSnapshot(): void {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}

function stripUnserializable(s: Partial<AppState>): Partial<AppState> {
  const { collaborators: _drop, ...rest } = s as Partial<AppState> & {
    collaborators?: unknown;
  };
  return rest;
}
