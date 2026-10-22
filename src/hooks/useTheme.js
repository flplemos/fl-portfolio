import { useSyncExternalStore } from "react";

// The initial theme is set by the inline script in index.html (before first paint, so
// there is no flash); this hook only reads and updates <html data-theme>.
const root = () => document.documentElement;

const subscribe = (onChange) => {
  const mo = new MutationObserver(onChange);
  mo.observe(root(), { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
};

export function setTheme(theme) {
  root().dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "light" ? "#f8fafc" : "#020617");
  try {
    localStorage.setItem("theme", theme);
  } catch {
    // storage blocked (private mode): the choice just isn't remembered
  }
}

export function useTheme() {
  return useSyncExternalStore(subscribe, () => root().dataset.theme || "dark", () => "dark");
}
