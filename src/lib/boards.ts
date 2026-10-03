import type {
  ExcalidrawElement,
  NonDeletedExcalidrawElement,
} from "@excalidraw/excalidraw/element/types";
import type { AppState, BinaryFiles } from "@excalidraw/excalidraw/types";
import { idbDelete, idbGet, idbGetAll, idbPut } from "./db";
import { clearSnapshot, loadSnapshot } from "./persist";

/** The slice of AppState a board keeps between visits. */
export type BoardAppState = Pick<AppState, "viewBackgroundColor">;

export type Board = {
  id: string;
  name: string;
  created: number;
  updated: number;
  elements: readonly NonDeletedExcalidrawElement[];
  appState: Partial<BoardAppState>;
  files: BinaryFiles;
};

export type BoardMeta = Pick<Board, "id" | "name" | "updated">;

export type SceneInput = {
  elements: readonly ExcalidrawElement[];
  appState: Partial<AppState>;
  files: BinaryFiles;
};

const CURRENT_KEY = "currentBoard";
export const DEFAULT_BOARD_NAME = "Untitled";

export function newBoardId(): string {
  return `b_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/** "Untitled", then "Untitled 2", "Untitled 3"... skipping names in use. */
export function untitledName(existing: readonly string[]): string {
  const taken = new Set(existing);
  if (!taken.has(DEFAULT_BOARD_NAME)) return DEFAULT_BOARD_NAME;
  for (let n = 2; ; n++) {
    const name = `${DEFAULT_BOARD_NAME} ${n}`;
    if (!taken.has(name)) return name;
  }
}

/** Drop deleted elements, files no live element references, and transient
    AppState, so a board stores only what it needs to reopen. */
export function boardContent(
  input: SceneInput,
): Pick<Board, "elements" | "appState" | "files"> {
  const elements = input.elements.filter(
    (el) => !el.isDeleted,
  ) as NonDeletedExcalidrawElement[];
  const used = new Set<string>(
    elements.flatMap((el) => ("fileId" in el && el.fileId ? [el.fileId] : [])),
  );
  const files: BinaryFiles = {};
  for (const [id, file] of Object.entries(input.files)) {
    if (used.has(id)) files[id] = file;
  }
  const appState: Partial<BoardAppState> = {};
  if (input.appState.viewBackgroundColor) {
    appState.viewBackgroundColor = input.appState.viewBackgroundColor;
  }
  return { elements, appState, files };
}

export function createBoard(name: string, content?: SceneInput): Board {
  const now = Date.now();
  return {
    id: newBoardId(),
    name,
    created: now,
    updated: now,
    ...(content ? boardContent(content) : { elements: [], appState: {}, files: {} }),
  };
}

export async function listBoards(): Promise<BoardMeta[]> {
  const all = await idbGetAll<Board>("boards");
  return all
    .map(({ id, name, updated }) => ({ id, name, updated }))
    .sort((a, b) => b.updated - a.updated);
}

export function loadBoard(id: string): Promise<Board | undefined> {
  return idbGet<Board>("boards", id);
}

/** Rejects when the write fails (quota, private mode), so callers can warn. */
export async function saveBoard(board: Board): Promise<void> {
  await idbPut("boards", board);
}

export async function renameBoard(id: string, name: string): Promise<void> {
  const board = await loadBoard(id);
  if (board) await saveBoard({ ...board, name });
}

export function deleteBoard(id: string): Promise<undefined> {
  return idbDelete("boards", id);
}

export function setCurrentBoardId(id: string): Promise<IDBValidKey> {
  return idbPut("meta", id, CURRENT_KEY);
}

let initialBoard: Promise<Board> | null = null;

/** Opens the board used last, migrating the pre-IndexedDB localStorage scene
    into a board on first run, and creates an empty board when there is none.
    Memoized: React StrictMode runs the mount effect twice, and two concurrent
    runs would each migrate or create a board. */
export function openInitialBoard(): Promise<Board> {
  initialBoard ??= resolveInitialBoard().catch((err: unknown) => {
    initialBoard = null;
    throw err;
  });
  return initialBoard;
}

async function resolveInitialBoard(): Promise<Board> {
  const legacy = loadSnapshot();
  if (legacy) {
    const board = createBoard(DEFAULT_BOARD_NAME, legacy);
    await saveBoard(board);
    await setCurrentBoardId(board.id);
    clearSnapshot();
    return board;
  }
  const currentId = await idbGet<string>("meta", CURRENT_KEY);
  const current = currentId ? await loadBoard(currentId) : undefined;
  if (current) return current;
  const [latest] = await listBoards();
  const fallback = latest ? await loadBoard(latest.id) : undefined;
  if (fallback) {
    await setCurrentBoardId(fallback.id);
    return fallback;
  }
  const board = createBoard(DEFAULT_BOARD_NAME);
  await saveBoard(board);
  await setCurrentBoardId(board.id);
  return board;
}

/** Ask the browser not to evict this origin's storage under pressure. */
export function requestPersistentStorage(): void {
  navigator.storage?.persist?.().catch(() => {});
}

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

/** "just now", "5 minutes ago", "yesterday", then a short date. */
export function formatUpdated(ts: number, now = Date.now()): string {
  const minutes = Math.round((ts - now) / 60000);
  if (minutes > -1) return "just now";
  if (minutes > -60) return rtf.format(minutes, "minute");
  const hours = Math.round(minutes / 60);
  if (hours > -24) return rtf.format(hours, "hour");
  const days = Math.round(hours / 24);
  if (days > -7) return rtf.format(days, "day");
  return new Date(ts).toLocaleDateString("en", { day: "numeric", month: "short", year: "numeric" });
}
