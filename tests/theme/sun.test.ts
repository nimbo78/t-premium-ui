import { expect, test } from "vitest";
import { sunTimes } from "../../plugin/kit/react/theme/sun";

const near = (actual: Date, iso: string) => Math.abs(actual.getTime() - Date.parse(iso)) <= 3 * 60_000;

test("Moscow at midsummer", () => {
  const times = sunTimes(new Date("2026-06-21T12:00:00Z"))!;
  expect(near(times.sunrise, "2026-06-21T00:44:00Z")).toBe(true);
  expect(near(times.sunset, "2026-06-21T18:18:00Z")).toBe(true);
});

test("Moscow at midwinter", () => {
  const times = sunTimes(new Date("2026-12-21T12:00:00Z"))!;
  expect(near(times.sunrise, "2026-12-21T05:57:00Z")).toBe(true);
  expect(near(times.sunset, "2026-12-21T12:58:00Z")).toBe(true);
});

test("polar night has no sunrise", () => {
  expect(sunTimes(new Date("2026-12-21T12:00:00Z"), { lat: 78.2, lng: 15.6 })).toBeNull();
});
