/**
 * Chrome deprecates `unload` listeners (they block the back/forward cache and
 * are being removed). Excalidraw still registers one on `window`, so route
 * `unload` to `pagehide`, which fires whenever the page is being left.
 * Call before Excalidraw mounts.
 */
export function routeUnloadToPagehide(target: Window = window): void {
  const add = target.addEventListener.bind(target);
  const remove = target.removeEventListener.bind(target);
  const map = (type: string) => (type === "unload" ? "pagehide" : type);

  target.addEventListener = ((
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ) => add(map(type), listener, options)) as Window["addEventListener"];

  target.removeEventListener = ((
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ) => remove(map(type), listener, options)) as Window["removeEventListener"];
}
