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
  if (pref === "light") return "dark";
  if (pref === "dark") return "system";
  return "light";
}
