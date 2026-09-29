import { useEffect, useState } from "react";
import { applyTheme, cacheResolved } from "./applyTheme";
import { nextAutoSwitch, resolveMode } from "./resolveMode";
import { useThemeStore } from "./store";

/** Applies the chosen style/mode to <html> and re-applies at sunrise/sunset in auto mode. */
export function ThemeController() {
  const style = useThemeStore((s) => s.style);
  const mode = useThemeStore((s) => s.mode);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const media = window.matchMedia?.("(prefers-color-scheme: dark)");
    const now = new Date();
    const resolved = resolveMode(mode, now, media?.matches ?? false);
    applyTheme(style, resolved);
    const next = mode === "auto" ? nextAutoSwitch(now) : null;
    if (mode === "auto") cacheResolved(resolved, next);
    const timer = next
      ? window.setTimeout(() => setTick((t) => t + 1), Math.max(next.getTime() - now.getTime(), 1000))
      : undefined;
    const onChange = () => setTick((t) => t + 1);
    media?.addEventListener?.("change", onChange);
    return () => {
      if (timer !== undefined) window.clearTimeout(timer);
      media?.removeEventListener?.("change", onChange);
    };
  }, [style, mode, tick]);

  return null;
}
