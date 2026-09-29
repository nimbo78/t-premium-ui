import { create, useStore } from "zustand";
import { persist } from "zustand/middleware";
import { setThemeKeys } from "./keys";
import type { ThemeMode, ThemeStyle } from "./types";

export interface ThemeState {
  style: ThemeStyle;
  mode: ThemeMode;
  setStyle: (style: ThemeStyle) => void;
  setMode: (mode: ThemeMode) => void;
}

function createThemeStore(name: string) {
  return create<ThemeState>()(
    persist(
      (set) => ({
        style: "warm",
        mode: "auto",
        setStyle: (style) => set({ style }),
        setMode: (mode) => set({ mode }),
      }),
      { name, version: 1, partialize: ({ style, mode }) => ({ style, mode }) },
    ),
  );
}

let store: ReturnType<typeof createThemeStore> | null = null;

/** Call once at startup, before the first render (and in the test setup): the key is the
 * project's own, e.g. "switch-sync" -> localStorage "switch-sync-theme". */
export function configureTheme({ storageKey }: { storageKey: string }): void {
  store = createThemeStore(setThemeKeys(storageKey).choice);
}

function current() {
  if (!store) throw new Error("T-Premium UI: call configureTheme({ storageKey }) before using the theme");
  return store;
}

interface UseThemeStore {
  (): ThemeState;
  <T>(selector: (state: ThemeState) => T): T;
  getState: () => ThemeState;
  setState: (partial: Partial<Pick<ThemeState, "style" | "mode">>) => void;
}

const wholeState = (state: ThemeState) => state;

// zustand's useStore on the store configureTheme created: one hook call with a selector, never a
// hook passed around as a value (the Rules of React; React Compiler relies on them).
function useTheme<T>(selector?: (state: ThemeState) => T): ThemeState | T {
  const select: (state: ThemeState) => ThemeState | T = selector ?? wholeState;
  return useStore(current(), select);
}

export const useThemeStore: UseThemeStore = Object.assign(useTheme as UseThemeStore, {
  getState: () => current().getState(),
  setState: (partial: Partial<Pick<ThemeState, "style" | "mode">>) => current().setState(partial),
});
