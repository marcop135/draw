import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Excalidraw, MainMenu, WelcomeScreen } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import type { SceneSnapshot } from "./lib/export";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ExportMenu } from "./components/ExportMenu";
import { GitHubCornerLink } from "./components/GitHubCornerLink";
import { InsertMenu } from "./components/InsertMenu";
import { RestoreChip } from "./components/RestoreChip";
import { ThemeToggle } from "./components/ThemeToggle";
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
const MermaidModal = lazy(() =>
  import("./components/MermaidModal").then((m) => ({ default: m.MermaidModal })),
);
const MarkdownModal = lazy(() =>
  import("./components/MarkdownModal").then((m) => ({
    default: m.MarkdownModal,
  })),
);
const AboutModal = lazy(() =>
  import("./components/AboutModal").then((m) => ({ default: m.AboutModal })),
);

type ModalKind = null | "latex" | "mermaid" | "markdown";

const AUTOSAVE_DEBOUNCE_MS = 800;

export default function App() {
  const apiRef = useRef<ExcalidrawImperativeAPI | null>(null);
  const [modal, setModal] = useState<ModalKind>(null);
  const [aboutOpen, setAboutOpen] = useState(false);

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
    api.updateScene({
      elements: snap.elements,
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
          if (saveTimer.current !== null) {
            window.clearTimeout(saveTimer.current);
          }
          saveTimer.current = window.setTimeout(() => {
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
        </MainMenu>
      </Excalidraw>
      <div className="app-toolbar">
        <button
          type="button"
          className="version-chip"
          title={`About draw v${APP_VERSION}`}
          onClick={() => setAboutOpen(true)}
        >
          v{APP_VERSION}
        </button>
        <InsertMenu
          dark={theme === "dark"}
          onPick={(k) => setModal(k)}
        />
        <ExportMenu getScene={getScene} dark={theme === "dark"} />
        <ThemeToggle preference={preference} onCycle={onCycleTheme} />
        <GitHubCornerLink dark={theme === "dark"} />
      </div>

      {pendingRestore ? (
        <RestoreChip onRestore={onRestore} onDiscard={onDiscard} />
      ) : null}

      <ErrorBoundary
        onReset={() => {
          setModal(null);
          setAboutOpen(false);
        }}
      >
        <Suspense fallback={null}>
          {modal === "latex" && apiRef.current ? (
            <LatexModal api={apiRef.current} onClose={() => setModal(null)} />
          ) : null}
          {modal === "mermaid" && apiRef.current ? (
            <MermaidModal api={apiRef.current} onClose={() => setModal(null)} />
          ) : null}
          {modal === "markdown" && apiRef.current ? (
            <MarkdownModal api={apiRef.current} onClose={() => setModal(null)} />
          ) : null}
          {aboutOpen ? (
            <AboutModal onClose={() => setAboutOpen(false)} />
          ) : null}
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
