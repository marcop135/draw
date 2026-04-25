import { useCallback, useRef, useState } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import type { SceneSnapshot } from "./lib/export";
import { ExportMenu } from "./components/ExportMenu";
import { InsertMenu } from "./components/InsertMenu";
import { LatexModal } from "./components/LatexModal";
import { MermaidModal } from "./components/MermaidModal";
import { MarkdownModal } from "./components/MarkdownModal";

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
      />

      <div className={`app-toolbar${theme === "dark" ? " dark" : ""}`}>
        <InsertMenu
          dark={theme === "dark"}
          onPick={(k) => setModal(k)}
        />
        <ExportMenu getScene={getScene} dark={theme === "dark"} />
      </div>

      {modal === "latex" && apiRef.current ? (
        <LatexModal api={apiRef.current} onClose={() => setModal(null)} />
      ) : null}
      {modal === "mermaid" && apiRef.current ? (
        <MermaidModal api={apiRef.current} onClose={() => setModal(null)} />
      ) : null}
      {modal === "markdown" && apiRef.current ? (
        <MarkdownModal api={apiRef.current} onClose={() => setModal(null)} />
      ) : null}
    </>
  );
}
