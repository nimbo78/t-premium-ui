import { sunTimes } from "./sun";
import type { ResolvedMode, ThemeMode } from "./types";

/** Light between sunrise and sunset in Moscow; the system preference only when there is no sunrise. */
export function autoMode(now: Date, prefersDark: boolean): ResolvedMode {
  const sun = sunTimes(now);
  if (!sun) return prefersDark ? "dark" : "light";
  return now >= sun.sunrise && now < sun.sunset ? "light" : "dark";
}

export function resolveMode(mode: ThemeMode, now: Date, prefersDark: boolean): ResolvedMode {
  return mode === "auto" ? autoMode(now, prefersDark) : mode;
}

/** When auto mode flips next: today's sunrise or sunset, else tomorrow's sunrise. */
export function nextAutoSwitch(now: Date): Date | null {
  const today = sunTimes(now);
  if (!today) return null;
  if (now < today.sunrise) return today.sunrise;
  if (now < today.sunset) return today.sunset;
  return sunTimes(new Date(now.getTime() + 86_400_000))?.sunrise ?? null;
}
