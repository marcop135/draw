import { CircleHalf, Moon, Sun } from "./icons";
import type { ThemePreference } from "../lib/theme";

type Props = {
  preference: ThemePreference;
  onCycle: () => void;
};

const LABEL: Record<ThemePreference, string> = {
  light: "Theme: light (click for dark)",
  dark: "Theme: dark (click for system)",
  system: "Theme: system (click for light)",
};

export function ThemeToggle({ preference, onCycle }: Props) {
  const Icon =
    preference === "light" ? Sun : preference === "dark" ? Moon : CircleHalf;
  return (
    <button
      type="button"
      className="app-btn theme-toggle"
      onClick={onCycle}
      aria-label={LABEL[preference]}
      title={LABEL[preference]}
    >
      <Icon size={18} className="app-btn-icon" />
    </button>
  );
}
