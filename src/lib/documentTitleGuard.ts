/**
 * Keeps document.title pinned: Excalidraw mutates `document.title`; we revert it
 * so the tab stays consistent with `index.html` and the README.
 */
export function installDocumentTitleGuard(expected: string): () => void {
  const sync = (): void => {
    if (document.title !== expected) {
      document.title = expected;
    }
  };

  sync();

  const titleEl = document.querySelector("title");
  if (!titleEl) return (): void => {};

  const observer = new MutationObserver(sync);
  observer.observe(titleEl, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  return (): void => {
    observer.disconnect();
  };
}
