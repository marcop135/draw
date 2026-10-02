import {
  lazy,
  Suspense,
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
  loadFromBlob,
  restoreElements,
  serializeAsJSON,
} from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import { renderPngDataUrl, renderSvgString, type SceneSnapshot } from "./lib/export";
import { registerAgentHandlers, unregisterAgentHandlers } from "./lib/agentBridge";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ExportMenu } from "./components/ExportMenu";
import { InsertMenu } from "./components/InsertMenu";
import { RestoreChip } from "./components/RestoreChip";
import { ThemeToggle } from "./components/ThemeToggle";
import { Diagram3, QuestionCircle, Robot } from "./components/icons";
import { SITE_SHORT_NAME } from "./siteMeta";
import {
  clearSnapshot,
  loadSnapshot,
  saveSnapshot,
  type PersistedSnapshot,
} from "./lib/persist";
import {
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
type ModalKind = null | "latex" | "markdown";

const AUTOSAVE_DEBOUNCE_MS = 800;

const EXCALIDRAW_URL = "https://excalidraw.com";
const FOR_AGENTS_HREF = "/for-agents.html";

export default function App() {
  const apiRef = useRef<ExcalidrawImperativeAPI | null>(null);
  const [modal, setModal] = useState<ModalKind>(null);
  // On phones the custom bar overlays Excalidraw's bottom bar. That bar is only
  // empty in selection mode with nothing selected; any other state fills it with
  // edit/duplicate/delete buttons, so we hide our overlay then to avoid collisions.
  const [barEditing, setBarEditing] = useState(false);
  // Excalidraw renders its welcome hint arrows only in the desktop layout, so on
  // phones (where the scene is still empty) we surface our own orientation hint.
  const [sceneEmpty, setSceneEmpty] = useState(true);

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

  const restored = useRef(false);
  const [pendingRestore, setPendingRestore] = useState<PersistedSnapshot | null>(
    () => loadSnapshot(),
  );

  const getScene = useCallback((): SceneSnapshot => {
    const api = apiRef.current;
    if (!api) {
      return { elements: [], appState: {}, files: {} };
    }
    return {
      elements: api.getSceneElements(),
      appState: api.getAppState(),
      files: api.getFiles(),
    };
  }, []);

  // window.draw for coding agents (src/lib/agentBridge.ts). Handlers read
  // apiRef lazily, so they work as soon as Excalidraw hands over its API.
  useEffect(() => {
    const requireApi = (): ExcalidrawImperativeAPI => {
      const api = apiRef.current;
      if (!api) throw new Error("draw agent bridge is not ready");
      return api;
    };
    registerAgentHandlers({
      getScene: () => {
        const api = requireApi();
        return serializeAsJSON(
          api.getSceneElements(),
          api.getAppState(),
          api.getFiles(),
          "local",
        );
      },
      setScene: async (json) => {
        const api = requireApi();
        const blob = new Blob([json], { type: "application/vnd.excalidraw+json" });
        const data = await loadFromBlob(blob, null, null);
        api.updateScene({ elements: data.elements });
        const files = Object.values(data.files ?? {});
        if (files.length > 0) api.addFiles(files);
        api.scrollToContent(undefined, { fitToContent: true });
      },
      exportImage: (format) =>
        format === "png" ? renderPngDataUrl(getScene()) : renderSvgString(getScene()),
    });
    return unregisterAgentHandlers;
  }, [getScene]);

  const saveTimer = useRef<number | null>(null);
  useEffect(() => {
    return () => {
      if (saveTimer.current !== null) {
        window.clearTimeout(saveTimer.current);
      }
    };
  }, []);

  const onCycleTheme = useCallback(() => {
    setPreference((prev) => {
      const next = nextPreference(prev);
      savePreference(next);
      return next;
    });
  }, []);

  const onRestore = useCallback(() => {
    const api = apiRef.current;
    const snap = pendingRestore;
    if (!api || !snap) {
      setPendingRestore(null);
      return;
    }
    // localStorage is untrusted input: run it through Excalidraw's own
    // validation, as file import does, before it reaches the scene.
    api.updateScene({
      elements: restoreElements(snap.elements, null, { repairBindings: true }),
    });
    if (snap.files && Object.keys(snap.files).length > 0) {
      api.addFiles(Object.values(snap.files));
    }
    restored.current = true;
    setPendingRestore(null);
  }, [pendingRestore]);

  const onDiscard = useCallback(() => {
    clearSnapshot();
    setPendingRestore(null);
  }, []);

  return (
    <div className={`app-shell${theme === "dark" ? " dark" : ""}`}>
      <Excalidraw
        excalidrawAPI={(api) => {
          apiRef.current = api;
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
        onChange={(elements, appState, files) => {
          const editing =
            appState.activeTool.type !== "selection" ||
            Object.keys(appState.selectedElementIds).length > 0;
          setBarEditing((prev) => (prev === editing ? prev : editing));
          const empty = elements.every((el) => el.isDeleted);
          setSceneEmpty((prev) => (prev === empty ? prev : empty));
          if (saveTimer.current !== null) {
            window.clearTimeout(saveTimer.current);
          }
          saveTimer.current = window.setTimeout(() => {
            // While a restore is pending the canvas mounts empty; an empty
            // save would call removeItem and wipe the snapshot the user can
            // still restore. Skip only that destructive empty-save case.
            if (pendingRestore && empty) return;
            saveSnapshot({ elements, appState, files });
          }, AUTOSAVE_DEBOUNCE_MS);
        }}
      >
        <WelcomeScreen />
        <MainMenu>
          <MainMenu.DefaultItems.LoadScene />
          <MainMenu.DefaultItems.CommandPalette />
          <MainMenu.DefaultItems.SearchMenu />
          <MainMenu.DefaultItems.Help />
          <MainMenu.DefaultItems.ClearCanvas />
          <MainMenu.Separator />
          <MainMenu.DefaultItems.ToggleTheme />
          <MainMenu.DefaultItems.ChangeCanvasBackground />
          <MainMenu.Separator />
          <MainMenu.ItemLink href={EXCALIDRAW_URL} icon={<Diagram3 />}>
            Built on Excalidraw
          </MainMenu.ItemLink>
          <MainMenu.ItemLink href={FOR_AGENTS_HREF} icon={<Robot />}>
            For agents
          </MainMenu.ItemLink>
          <MainMenu.ItemCustom>
            <span className="app-menu-about">{SITE_SHORT_NAME} v{APP_VERSION}</span>
          </MainMenu.ItemCustom>
        </MainMenu>
      </Excalidraw>
      <div className={`app-toolbar${barEditing ? " app-toolbar--editing" : ""}`}>
        <InsertMenu
          dark={theme === "dark"}
          onPick={(k) => setModal(k)}
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

      {pendingRestore ? (
        <RestoreChip onRestore={onRestore} onDiscard={onDiscard} />
      ) : null}

      <ErrorBoundary onReset={() => setModal(null)}>
        <Suspense fallback={null}>
          {modal === "latex" && apiRef.current ? (
            <LatexModal api={apiRef.current} onClose={() => setModal(null)} />
          ) : null}
          {modal === "markdown" && apiRef.current ? (
            <MarkdownModal api={apiRef.current} onClose={() => setModal(null)} />
          ) : null}
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
