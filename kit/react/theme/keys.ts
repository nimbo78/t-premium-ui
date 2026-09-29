/** Storage keys of one project: "<key>-theme" (the user's choice) and "<key>-theme-resolved"
 * (the auto mode cache for the boot script). Each project has its own key. */
export interface ThemeKeys {
  choice: string;
  resolved: string;
}

let current: ThemeKeys | null = null;

export function setThemeKeys(storageKey: string): ThemeKeys {
  current = { choice: `${storageKey}-theme`, resolved: `${storageKey}-theme-resolved` };
  return current;
}

export function themeKeys(): ThemeKeys {
  if (!current) throw new Error("T-Premium UI: call configureTheme({ storageKey }) before using the theme");
  return current;
}
