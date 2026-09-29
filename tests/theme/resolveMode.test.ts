import { expect, test } from "vitest";
import { nextAutoSwitch, resolveMode } from "../../kit/react/theme/resolveMode";

test("explicit modes are returned as is", () => {
  expect(resolveMode("light", new Date("2026-09-26T20:00:00Z"), true)).toBe("light");
  expect(resolveMode("dark", new Date("2026-09-26T09:00:00Z"), false)).toBe("dark");
});

test("auto follows the sun in Moscow", () => {
  expect(resolveMode("auto", new Date("2026-09-26T09:00:00Z"), true)).toBe("light"); // 12:00 MSK
  expect(resolveMode("auto", new Date("2026-09-26T20:00:00Z"), false)).toBe("dark"); // 23:00 MSK
});

test("next switch is today's sunset or tomorrow's sunrise", () => {
  const day = nextAutoSwitch(new Date("2026-09-26T09:00:00Z"))!;
  expect(Math.abs(day.getTime() - Date.parse("2026-09-26T15:19:00Z"))).toBeLessThan(3 * 60_000);
  const night = nextAutoSwitch(new Date("2026-09-26T20:00:00Z"))!;
  expect(night.toISOString().startsWith("2026-09-27T03:")).toBe(true);
});
