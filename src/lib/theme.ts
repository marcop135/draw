const KEY = "draw:theme:v1";

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

function isPreference(v: unknown): v is ThemePreference {
  return v === "light" || v === "dark" || v === "system";
}

export function loadPreference(): ThemePreference {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (isPreference(raw)) return raw;
  } catch {
    // ignore
  }
  return "system";
}

export function savePreference(pref: ThemePreference): void {
  try {
    window.localStorage.setItem(KEY, pref);
  } catch {
    // ignore
  }
}

export function systemTheme(): ResolvedTheme {
  if (
    typeof window === "undefined" ||
    typeof window.matchMedia !== "function"
  ) {
    return "light";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function resolveTheme(pref: ThemePreference): ResolvedTheme {
  if (pref === "system") return systemTheme();
  return pref;
}

export function nextPreference(pref: ThemePreference): ThemePreference {
  if (pref === "system") return "light";
  if (pref === "light") return "dark";
  return "system";
}

/** Canvas background per theme, used for the browser's theme-color. */
export const THEME_COLOR: Record<ResolvedTheme, string> = {
  light: "#ffffff",
  dark: "#121212",
};

/** Point every theme-color meta at the resolved theme, so an in-app override
    wins over the media-query defaults in index.html. Also paint the root
    background: Safari 26 ignores theme-color and tints its bars from the page
    background instead. */
export function applyThemeColor(theme: ResolvedTheme): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.backgroundColor = THEME_COLOR[theme];
  root.style.colorScheme = theme;
  document
    .querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
    .forEach((meta) => {
      meta.content = THEME_COLOR[theme];
    });
}
