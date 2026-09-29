import { themeKeys } from "./keys";
import type { ResolvedMode, ThemeStyle } from "./types";

type ViewTransitionDocument = Document & { startViewTransition?: (update: () => void) => unknown };

export function applyTheme(style: ThemeStyle, resolved: ResolvedMode): void {
  const root = document.documentElement;
  if (root.dataset.style === style && root.dataset.mode === resolved) return;
  const update = () => {
    root.dataset.style = style;
    root.dataset.mode = resolved;
  };
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const doc = document as ViewTransitionDocument;
  if (reduceMotion || !root.dataset.mode) {
    update();
  } else if (typeof doc.startViewTransition === "function") {
    doc.startViewTransition(update);
  } else {
    root.classList.add("theme-transition");
    update();
    window.setTimeout(() => root.classList.remove("theme-transition"), 350);
  }
}

/** Remembers the resolved auto mode for the boot script ("<key>-theme-resolved"). */
export function cacheResolved(resolved: ResolvedMode, until: Date | null): void {
  const key = themeKeys().resolved;
  try {
    localStorage.setItem(key, JSON.stringify({ mode: resolved, until: until ? until.getTime() : 0 }));
  } catch {
    // storage unavailable: the boot script falls back to prefers-color-scheme
  }
}
