import { parseMermaidToExcalidraw } from "@excalidraw/mermaid-to-excalidraw";
import { convertToExcalidrawElements } from "@excalidraw/excalidraw";
import type {
  BinaryFileData,
  BinaryFiles,
  ExcalidrawImperativeAPI,
} from "@excalidraw/excalidraw/types";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";

/** Parse a Mermaid block and append the resulting elements to the scene. */
export async function insertMermaid(
  api: ExcalidrawImperativeAPI,
  source: string,
): Promise<void> {
  const trimmed = source.trim();
  if (!trimmed) throw new Error("Mermaid input is empty.");

  const { elements: skeletons, files } = await parseMermaidToExcalidraw(
    trimmed,
    {
      themeVariables: { fontSize: "16px" },
    },
  );

  const elements = convertToExcalidrawElements(skeletons);
  if (!elements.length) {
    throw new Error("Mermaid produced no elements.");
  }

  const current = api.getSceneElements();
  api.updateScene({
    elements: [...current, ...elements] as unknown as ExcalidrawElement[],
  });

  if (files) {
    const fileEntries = Object.values(files as BinaryFiles) as BinaryFileData[];
    if (fileEntries.length) {
      api.addFiles(fileEntries);
    }
  }

  // Centre the new elements in the viewport.
  api.scrollToContent(elements as unknown as ExcalidrawElement[], {
    fitToContent: true,
    animate: true,
    duration: 300,
  });
}
