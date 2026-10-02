import { describe, expect, it, vi } from "vitest";
import { routeUnloadToPagehide } from "./unloadToPagehide";

describe("routeUnloadToPagehide", () => {
  it("runs unload listeners on pagehide and removes them again", () => {
    const target = new EventTarget() as unknown as Window;
    routeUnloadToPagehide(target);
    const listener = vi.fn();

    target.addEventListener("unload", listener);
    target.dispatchEvent(new Event("unload"));
    expect(listener).not.toHaveBeenCalled();
    target.dispatchEvent(new Event("pagehide"));
    expect(listener).toHaveBeenCalledTimes(1);

    target.removeEventListener("unload", listener);
    target.dispatchEvent(new Event("pagehide"));
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("leaves other event types alone", () => {
    const target = new EventTarget() as unknown as Window;
    routeUnloadToPagehide(target);
    const listener = vi.fn();
    target.addEventListener("resize", listener);
    target.dispatchEvent(new Event("resize"));
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
