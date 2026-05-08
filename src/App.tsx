import { lazy, Suspense, useCallback, useRef, useState } from "react";
import { Excalidraw, MainMenu } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import type { SceneSnapshot } from "./lib/export";
import { ExportMenu } from "./components/ExportMenu";
import { GitHubCornerLink } from "./components/GitHubCornerLink";
import { InsertMenu } from "./components/InsertMenu";
import { version as APP_VERSION } from "../package.json";

// Heavy modals: split out so the Mermaid parser, KaTeX, and marked/DOMPurify
// only ship to clients who actually click "Insert".
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

type ModalKind = null | "latex" | "mermaid" | "markdown";

export default function App() {
  const apiRef = useRef<ExcalidrawImperativeAPI | null>(null);
  const [modal, setModal] = useState<ModalKind>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");

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

  return (
    <>
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
        onChange={(_els, appState) => {
          if (appState.theme && appState.theme !== theme) {
            setTheme(appState.theme);
          }
        }}
      >
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
      <div className={`app-toolbar${theme === "dark" ? " dark" : ""}`}>
        <small className="version-chip" title={`draw v${APP_VERSION}`}>
          v{APP_VERSION}
        </small>
        <InsertMenu
          dark={theme === "dark"}
          onPick={(k) => setModal(k)}
        />
        <ExportMenu getScene={getScene} dark={theme === "dark"} />
        <GitHubCornerLink dark={theme === "dark"} />
      </div>

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
      </Suspense>
    </>
  );
}
