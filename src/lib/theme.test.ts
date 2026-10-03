import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  applyThemeColor,
  loadPreference,
  nextPreference,
  resolveTheme,
  savePreference,
  systemTheme,
} from "./theme";

function stubMatchMedia(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: vi.fn().mockImplementation(() => ({
      matches,
      media: "(prefers-color-scheme: dark)",
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe("theme", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("defaults to system when storage is empty", () => {
    expect(loadPreference()).toBe("system");
  });

  it("round-trips a preference", () => {
    savePreference("dark");
    expect(loadPreference()).toBe("dark");
  });

  it("falls back to system on invalid stored value", () => {
    window.localStorage.setItem("draw:theme:v1", "weird");
    expect(loadPreference()).toBe("system");
  });

  it("systemTheme reflects matchMedia dark", () => {
    stubMatchMedia(true);
    expect(systemTheme()).toBe("dark");
  });

  it("systemTheme reflects matchMedia light", () => {
    stubMatchMedia(false);
    expect(systemTheme()).toBe("light");
  });

  it("resolveTheme passes through light/dark, derives system", () => {
    stubMatchMedia(true);
    expect(resolveTheme("light")).toBe("light");
    expect(resolveTheme("dark")).toBe("dark");
    expect(resolveTheme("system")).toBe("dark");
  });

  it("nextPreference cycles system -> light -> dark -> system", () => {
    expect(nextPreference("system")).toBe("light");
    expect(nextPreference("light")).toBe("dark");
    expect(nextPreference("dark")).toBe("system");
  });
});

describe("applyThemeColor", () => {
  it("retints every theme-color meta and the root background", () => {
    document.head.innerHTML =
      '<meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff">' +
      '<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#121212">';
    applyThemeColor("dark");
    const metas = [...document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')];
    expect(metas.map((m) => m.content)).toEqual(["#121212", "#121212"]);
    expect(document.documentElement.style.colorScheme).toBe("dark");
    applyThemeColor("light");
    expect(metas.map((m) => m.content)).toEqual(["#ffffff", "#ffffff"]);
  });
});
