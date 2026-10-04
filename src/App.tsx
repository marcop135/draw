import {
  lazy,
  Suspense,
  type MouseEvent as ReactMouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Excalidraw,
  MainMenu,
  WelcomeScreen,
  getSceneVersion,
  loadFromBlob,
  restoreElements,
  serializeAsJSON,
} from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import type {
  AppState,
  BinaryFiles,
  ExcalidrawImperativeAPI,
  ExcalidrawInitialDataState,
} from "@excalidraw/excalidraw/types";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import {
  exportExcalidraw,
  renderPngDataUrl,
  renderSvgString,
  type SceneSnapshot,
} from "./lib/export";
import { registerAgentHandlers, unregisterAgentHandlers } from "./lib/agentBridge";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ExportMenu } from "./components/ExportMenu";
import { InsertMenu } from "./components/InsertMenu";
import { ThemeToggle } from "./components/ThemeToggle";
import {
  Diagram3,
  ExclamationTriangle,
  Journals,
  QuestionCircle,
  Robot,
} from "./components/icons";
import { SITE_SHORT_NAME } from "./siteMeta";
import {
  DEFAULT_BOARD_NAME,
  boardContent,
  createBoard,
  deleteBoard,
  listBoards,
  loadBoard,
  openInitialBoard,
  renameBoard,
  requestPersistentStorage,
  saveBoard,
  setCurrentBoardId,
  untitledName,
  type Board,
  type BoardMeta,
  type SceneInput,
} from "./lib/boards";
import {
  insertImageElement,
  insertSourceOf,
  type InsertKind,
  type InsertSource,
} from "./lib/insertImage";
import {
  boardNameFromFile,
  imageInputFromFile,
  isImageFile,
  isSceneFile,
  onLaunchFiles,
  takeSharedFiles,
} from "./lib/importFiles";
import {
  applyThemeColor,
  loadPreference,
  nextPreference,
  resolveTheme,
  savePreference,
  systemTheme,
  type ResolvedTheme,
  type ThemePreference,
} from "./lib/theme";
import { version as APP_VERSION } from "../package.json";

const LatexModal = lazy(() =>
  import("./components/LatexModal").then((m) => ({ default: m.LatexModal })),
);
const MarkdownModal = lazy(() =>
  import("./components/MarkdownModal").then((m) => ({
    default: m.MarkdownModal,
  })),
);
const BoardsModal = lazy(() =>
  import("./components/BoardsModal").then((m) => ({ default: m.BoardsModal })),
);
type ModalState =
  | null
  | { kind: InsertKind; edit?: { id: string; source: string } }
  | { kind: "boards"; boards: BoardMeta[] };

type SelectedInsert = { id: string; source: InsertSource };

const AUTOSAVE_DEBOUNCE_MS = 800;

const EXCALIDRAW_REPO_URL = "https://github.com/excalidraw/excalidraw";
const DRAW_REPO_URL = "https://github.com/marcop135/draw";
const FOR_AGENTS_HREF = "/for-agents.html";


/** Scene-level change detector: element versions, background and file set. */
function sceneKey(input: SceneInput): string {
  return [
    getSceneVersion(input.elements),
    input.appState.viewBackgroundColor ?? "",
    Object.keys(input.files).length,
  ].join("|");
}

export default function App() {
  const apiRef = useRef<ExcalidrawImperativeAPI | null>(null);
  // Also kept in state so OS file imports can wait for the canvas.
  const [api, setApi] = useState<ExcalidrawImperativeAPI | null>(null);
  const [modal, setModal] = useState<ModalState>(null);
  // On phones the custom bar overlays Excalidraw's bottom bar. That bar is only
  // empty in selection mode with nothing selected; any other state fills it with
  // edit/duplicate/delete buttons, so we hide our overlay then to avoid collisions.
  const [barEditing, setBarEditing] = useState(false);
  // Excalidraw renders its welcome hint arrows only in the desktop layout, so on
  // phones (where the scene is still empty) we surface our own orientation hint.
  const [sceneEmpty, setSceneEmpty] = useState(true);
  const [selectedInsert, setSelectedInsert] = useState<SelectedInsert | null>(null);
  const selectedInsertRef = useRef<SelectedInsert | null>(null);
  const [saveFailed, setSaveFailed] = useState(false);

  const openHelp = useCallback(() => {
    apiRef.current?.updateScene({ appState: { openDialog: { name: "help" } } });
  }, []);

  const [preference, setPreference] = useState<ThemePreference>(() =>
    loadPreference(),
  );
  const [resolvedSystem, setResolvedSystem] = useState<ResolvedTheme>(() =>
    systemTheme(),
  );

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      setResolvedSystem(e.matches ? "dark" : "light");
    };
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const theme: ResolvedTheme = useMemo(
    () => (preference === "system" ? resolvedSystem : resolveTheme(preference)),
    [preference, resolvedSystem],
  );

  useEffect(() => {
    applyThemeColor(theme);
  }, [theme]);

  // ---- Boards and autosave -------------------------------------------------

  const [board, setBoard] = useState<Board | null>(null);
  const boardRef = useRef<Board | null>(null);
  // Latest unsaved scene, and the change key of what was last stored.
  const pendingRef = useRef<SceneInput | null>(null);
  const savedKeyRef = useRef<string | null>(null);
  const saveTimer = useRef<number | null>(null);
  const persistAsked = useRef(false);

  const showBoard = useCallback((next: Board) => {
    boardRef.current = next;
    pendingRef.current = null;
    savedKeyRef.current = null;
    selectedInsertRef.current = null;
    setSelectedInsert(null);
    setBoard(next);
  }, []);

  /** Write the pending scene now. Resolves either way; a failed write raises
      the storage warning instead of throwing. */
  const flush = useCallback(async () => {
    if (saveTimer.current !== null) {
      window.clearTimeout(saveTimer.current);
      saveTimer.current = null;
    }
    const pending = pendingRef.current;
    const current = boardRef.current;
    if (!pending || !current) return;
    pendingRef.current = null;
    const next: Board = { ...current, ...boardContent(pending), updated: Date.now() };
    boardRef.current = next;
    try {
      await saveBoard(next);
      savedKeyRef.current = sceneKey(pending);
      setSaveFailed(false);
      if (!persistAsked.current) {
        persistAsked.current = true;
        requestPersistentStorage();
      }
    } catch {
      setSaveFailed(true);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    openInitialBoard()
      .then((b) => {
        if (!cancelled) showBoard(b);
      })
      .catch(() => {
        // IndexedDB blocked: still draw, but warn that nothing is kept.
        if (cancelled) return;
        showBoard(createBoard(DEFAULT_BOARD_NAME));
        setSaveFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [showBoard]);

  useEffect(() => {
    const onHide = () => void flush();
    window.addEventListener("pagehide", onHide);
    document.addEventListener("visibilitychange", onHide);
    return () => {
      window.removeEventListener("pagehide", onHide);
      document.removeEventListener("visibilitychange", onHide);
      if (saveTimer.current !== null) window.clearTimeout(saveTimer.current);
    };
  }, [flush]);

  const switchTo = useCallback(
    async (next: Board) => {
      await flush();
      await saveBoard(next).catch(() => setSaveFailed(true));
      await setCurrentBoardId(next.id).catch(() => {});
      showBoard(next);
      setModal(null);
    },
    [flush, showBoard],
  );

  const openBoards = useCallback(async () => {
    await flush();
    const boards = await listBoards().catch(() => [] as BoardMeta[]);
    setModal({ kind: "boards", boards });
  }, [flush]);

  const refreshBoards = useCallback(async () => {
    const boards = await listBoards().catch(() => [] as BoardMeta[]);
    setModal((m) => (m?.kind === "boards" ? { kind: "boards", boards } : m));
  }, []);

  const onOpenBoard = useCallback(
    async (id: string) => {
      if (id === boardRef.current?.id) {
        setModal(null);
        return;
      }
      const next = await loadBoard(id).catch(() => undefined);
      if (next) await switchTo(next);
    },
    [switchTo],
  );

  const onCreateBoard = useCallback(async () => {
    const names = (await listBoards().catch(() => [] as BoardMeta[])).map((b) => b.name);
    await switchTo(createBoard(untitledName(names)));
  }, [switchTo]);

  const onRenameBoard = useCallback(
    async (id: string, name: string) => {
      await flush();
      const current = boardRef.current;
      if (current && id === current.id) {
        const next = { ...current, name };
        boardRef.current = next;
        setBoard(next);
        await saveBoard(next).catch(() => setSaveFailed(true));
      } else {
        await renameBoard(id, name).catch(() => {});
      }
      await refreshBoards();
    },
    [flush, refreshBoards],
  );

  const onDeleteBoard = useCallback(
    async (id: string) => {
      const wasCurrent = id === boardRef.current?.id;
      if (wasCurrent) pendingRef.current = null;
      await deleteBoard(id).catch(() => {});
      if (!wasCurrent) {
        await refreshBoards();
        return;
      }
      const [latest] = await listBoards().catch(() => [] as BoardMeta[]);
      const next = latest ? await loadBoard(latest.id).catch(() => undefined) : undefined;
      await switchTo(next ?? createBoard(DEFAULT_BOARD_NAME));
      await openBoards();
    },
    [openBoards, refreshBoards, switchTo],
  );

  // Excalidraw remounts per board (key), so each board opens with its own undo
  // history. Stored content is untrusted input: run it through Excalidraw's
  // own validation, as file import does.
  const boardId = board?.id;
  const initialData = useMemo<ExcalidrawInitialDataState | null>(() => {
    const current = boardRef.current;
    if (!boardId || !current) return null;
    return {
      elements: restoreElements(current.elements, null, { repairBindings: true }),
      appState: {
        ...current.appState,
        activeTool: {
          type: "freedraw",
          customType: null,
          locked: false,
          lastActiveTool: null,
        },
      },
      files: current.files,
      scrollToContent: true,
    };
  }, [boardId]);

  const onSceneChange = useCallback(
    (elements: readonly ExcalidrawElement[], appState: AppState, files: BinaryFiles) => {
      const selectedIds = Object.keys(appState.selectedElementIds);
      const editing = appState.activeTool.type !== "selection" || selectedIds.length > 0;
      setBarEditing((prev) => (prev === editing ? prev : editing));
      const empty = elements.every((el) => el.isDeleted);
      setSceneEmpty((prev) => (prev === empty ? prev : empty));

      const one =
        selectedIds.length === 1 ? elements.find((el) => el.id === selectedIds[0]) : undefined;
      const source = insertSourceOf(one);
      const sel = one && source ? { id: one.id, source } : null;
      const prev = selectedInsertRef.current;
      if (sel?.id !== prev?.id || sel?.source.source !== prev?.source.source) {
        selectedInsertRef.current = sel;
        setSelectedInsert(sel);
      }

      const input: SceneInput = { elements, appState, files };
      const key = sceneKey(input);
      // The first change after a board opens is the loaded scene itself.
      if (savedKeyRef.current === null) {
        savedKeyRef.current = key;
        return;
      }
      if (key === savedKeyRef.current) return;
      pendingRef.current = input;
      if (saveTimer.current !== null) window.clearTimeout(saveTimer.current);
      saveTimer.current = window.setTimeout(() => void flush(), AUTOSAVE_DEBOUNCE_MS);
    },
    [flush],
  );

  // ---- Files from the OS: launch queue and share target --------------------

  const importFiles = useCallback(
    async (files: File[]) => {
      const scene = files.find(isSceneFile);
      if (scene) {
        try {
          const data = await loadFromBlob(scene, null, null);
          await switchTo(
            createBoard(boardNameFromFile(scene.name), {
              elements: data.elements,
              appState: data.appState,
              files: data.files,
            }),
          );
        } catch {
          // Not a valid scene; ignore it.
        }
        return;
      }
      for (const file of files.filter(isImageFile)) {
        const target = apiRef.current;
        if (!target) return;
        try {
          await insertImageElement(target, await imageInputFromFile(file));
        } catch {
          // Undecodable image; skip it.
        }
      }
    },
    [switchTo],
  );

  // Wait for the canvas so shared images have somewhere to land.
  const filesHandled = useRef(false);
  useEffect(() => {
    if (!api || filesHandled.current) return;
    filesHandled.current = true;
    onLaunchFiles((files) => void importFiles(files));
    takeSharedFiles()
      .then((files) => (files.length ? importFiles(files) : undefined))
      .catch(() => {});
  }, [api, importFiles]);

  // ---- Editing LaTeX / Markdown inserts ------------------------------------

  const editSelectedInsert = useCallback(() => {
    const sel = selectedInsertRef.current;
    if (!sel) return;
    setModal({ kind: sel.source.kind, edit: { id: sel.id, source: sel.source.source } });
  }, []);

  /** Double-clicking a selected insert reopens its editor instead of
      Excalidraw's image crop mode. */
  const onDoubleClickCapture = useCallback(
    (e: ReactMouseEvent) => {
      const sel = selectedInsertRef.current;
      const target = apiRef.current;
      if (!sel || !target || !(e.target instanceof HTMLCanvasElement)) return;
      const el = target.getSceneElements().find((x) => x.id === sel.id);
      if (!el) return;
      const { scrollX, scrollY, zoom, offsetLeft, offsetTop } = target.getAppState();
      const x = (e.clientX - offsetLeft) / zoom.value - scrollX;
      const y = (e.clientY - offsetTop) / zoom.value - scrollY;
      if (x < el.x || x > el.x + el.width || y < el.y || y > el.y + el.height) return;
      e.stopPropagation();
      e.preventDefault();
      editSelectedInsert();
    },
    [editSelectedInsert],
  );

  // ---- Agent bridge ----------------------------------------------------------

  const getScene = useCallback((): SceneSnapshot => {
    const current = apiRef.current;
    if (!current) {
      return { elements: [], appState: {}, files: {} };
    }
    return {
      elements: current.getSceneElements(),
      appState: current.getAppState(),
      files: current.getFiles(),
    };
  }, []);

  // window.draw for coding agents (src/lib/agentBridge.ts). Handlers read
  // apiRef lazily, so they work as soon as Excalidraw hands over its API.
  useEffect(() => {
    const requireApi = (): ExcalidrawImperativeAPI => {
      const current = apiRef.current;
      if (!current) throw new Error("draw agent bridge is not ready");
      return current;
    };
    registerAgentHandlers({
      getScene: () => {
        const current = requireApi();
        return serializeAsJSON(
          current.getSceneElements(),
          current.getAppState(),
          current.getFiles(),
          "local",
        );
      },
      setScene: async (json) => {
        const current = requireApi();
        const blob = new Blob([json], { type: "application/vnd.excalidraw+json" });
        const data = await loadFromBlob(blob, null, null);
        current.updateScene({ elements: data.elements });
        const files = Object.values(data.files ?? {});
        if (files.length > 0) current.addFiles(files);
        current.scrollToContent(undefined, { fitToContent: true });
      },
      exportImage: (format) =>
        format === "png" ? renderPngDataUrl(getScene()) : renderSvgString(getScene()),
    });
    return unregisterAgentHandlers;
  }, [getScene]);

  const onCycleTheme = useCallback(() => {
    setPreference((prev) => {
      const next = nextPreference(prev);
      savePreference(next);
      return next;
    });
  }, []);

  const closeModal = useCallback(() => setModal(null), []);

  return (
    <div
      className={`app-shell${theme === "dark" ? " dark" : ""}`}
      onDoubleClickCapture={onDoubleClickCapture}
    >
      {board && initialData ? (
        <Excalidraw
          key={board.id}
          initialData={initialData}
          excalidrawAPI={(next) => {
            apiRef.current = next;
            setApi(next);
          }}
          theme={theme}
          UIOptions={{
            canvasActions: {
              saveToActiveFile: false,
              loadScene: true,
              export: false,
              saveAsImage: false,
            },
          }}
          onChange={onSceneChange}
        >
          <WelcomeScreen />
          <MainMenu>
            <MainMenu.Item icon={<Journals />} onSelect={() => void openBoards()}>
              Boards
            </MainMenu.Item>
            <MainMenu.DefaultItems.LoadScene />
            <MainMenu.DefaultItems.CommandPalette />
            <MainMenu.DefaultItems.SearchMenu />
            <MainMenu.DefaultItems.Help />
            <MainMenu.DefaultItems.ClearCanvas />
            <MainMenu.Separator />
            <MainMenu.DefaultItems.ToggleTheme />
            <MainMenu.DefaultItems.ChangeCanvasBackground />
            <MainMenu.Separator />
            <MainMenu.ItemLink
              href={FOR_AGENTS_HREF}
              icon={<Robot />}
              className="app-menu-small"
            >
              For agents
            </MainMenu.ItemLink>
            <MainMenu.ItemCustom className="app-menu-credit">
              <Diagram3 aria-hidden="true" />
              <span>
                Built on{" "}
                <a href={EXCALIDRAW_REPO_URL} target="_blank" rel="noopener noreferrer">
                  Excalidraw
                </a>{" "}
                by{" "}
                <a href={DRAW_REPO_URL} target="_blank" rel="noopener noreferrer">
                  marcop135
                </a>
              </span>
            </MainMenu.ItemCustom>
            <MainMenu.ItemCustom>
              <span className="app-menu-about">{SITE_SHORT_NAME} v{APP_VERSION}</span>
            </MainMenu.ItemCustom>
          </MainMenu>
        </Excalidraw>
      ) : null}
      <div className={`app-toolbar${barEditing ? " app-toolbar--editing" : ""}`}>
        <InsertMenu
          dark={theme === "dark"}
          onPick={(kind) => setModal({ kind })}
          editKind={selectedInsert?.source.kind ?? null}
          onEdit={editSelectedInsert}
        />
        <ExportMenu getScene={getScene} dark={theme === "dark"} />
        <ThemeToggle preference={preference} onCycle={onCycleTheme} />
        <button
          type="button"
          className="app-btn app-help-btn"
          aria-label="Help"
          title="Help"
          onClick={openHelp}
        >
          <QuestionCircle size={18} />
        </button>
      </div>

      {sceneEmpty && !barEditing ? (
        <div className="app-mobile-hint" aria-hidden="true">
          Pick a tool above to start drawing
        </div>
      ) : null}

      {saveFailed ? (
        <div className="app-chip app-chip--warn" role="alert">
          <ExclamationTriangle size={16} />
          <span>This board is not being saved: browser storage is full or blocked.</span>
          <button
            type="button"
            className="app-btn app-chip-primary"
            onClick={() => void exportExcalidraw(getScene()).catch(() => {})}
          >
            Download a copy
          </button>
          <button
            type="button"
            className="app-btn"
            onClick={() => setSaveFailed(false)}
            aria-label="Dismiss storage warning"
          >
            Dismiss
          </button>
        </div>
      ) : null}

      <ErrorBoundary onReset={closeModal}>
        <Suspense fallback={null}>
          {modal?.kind === "latex" && apiRef.current ? (
            <LatexModal api={apiRef.current} edit={modal.edit} onClose={closeModal} />
          ) : null}
          {modal?.kind === "markdown" && apiRef.current ? (
            <MarkdownModal api={apiRef.current} edit={modal.edit} onClose={closeModal} />
          ) : null}
          {modal?.kind === "boards" && board ? (
            <BoardsModal
              boards={modal.boards}
              currentId={board.id}
              onOpen={(id) => void onOpenBoard(id)}
              onCreate={() => void onCreateBoard()}
              onRename={(id, name) => void onRenameBoard(id, name)}
              onDelete={(id) => void onDeleteBoard(id)}
              onClose={closeModal}
            />
          ) : null}
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
