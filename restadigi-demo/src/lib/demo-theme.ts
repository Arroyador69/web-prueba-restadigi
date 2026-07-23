/** Live demo theme bridge (accent colour, etc.) — works even when DB writes are blocked. */

export const DEMO_THEME_EVENT = "restadigi:demo-theme";
const STORAGE_KEY = "restadigi-demo-theme-v1";

export type DemoTheme = {
  accentColor: string;
  restaurantName?: string;
};

function isHex(value: string) {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}

export function readDemoTheme(): DemoTheme | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DemoTheme;
    if (!parsed?.accentColor || !isHex(parsed.accentColor)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeDemoTheme(patch: Partial<DemoTheme>) {
  if (typeof window === "undefined") return;
  const prev = readDemoTheme() ?? { accentColor: "#c46a32" };
  const next: DemoTheme = {
    accentColor: patch.accentColor && isHex(patch.accentColor) ? patch.accentColor : prev.accentColor,
    restaurantName: patch.restaurantName?.trim() || prev.restaurantName,
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(DEMO_THEME_EVENT, { detail: next }));
}

export function subscribeDemoTheme(onChange: (theme: DemoTheme) => void) {
  if (typeof window === "undefined") return () => undefined;

  const handler = (event: Event) => {
    const detail = (event as CustomEvent<DemoTheme>).detail;
    if (detail?.accentColor) onChange(detail);
    else {
      const stored = readDemoTheme();
      if (stored) onChange(stored);
    }
  };

  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    const stored = readDemoTheme();
    if (stored) onChange(stored);
  };

  window.addEventListener(DEMO_THEME_EVENT, handler);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(DEMO_THEME_EVENT, handler);
    window.removeEventListener("storage", onStorage);
  };
}

/** Soft dark panel tinted by accent (pro Resta-AI look). */
export function accentPanelBackground(accent: string) {
  return `color-mix(in srgb, ${accent} 24%, #14100e)`;
}

export function accentSoftBorder(accent: string) {
  return `color-mix(in srgb, ${accent} 45%, transparent)`;
}

export function accentChipText(accent: string) {
  return `color-mix(in srgb, ${accent} 55%, white)`;
}

export function accentHintBackground(accent: string) {
  return `color-mix(in srgb, ${accent} 18%, #1a1512)`;
}
