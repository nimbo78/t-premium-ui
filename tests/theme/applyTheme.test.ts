import { beforeEach, expect, test } from "vitest";
import { applyTheme, cacheResolved } from "../../kit/react/theme/applyTheme";
import { setThemeKeys } from "../../kit/react/theme/keys";

beforeEach(() => {
  localStorage.clear();
  setThemeKeys("apply-test");
});

test("sets data attributes on <html>", () => {
  applyTheme("classic", "dark");
  expect(document.documentElement.dataset.style).toBe("classic");
  expect(document.documentElement.dataset.mode).toBe("dark");
});

test("caches the resolved auto mode until the next switch, under the project's key", () => {
  cacheResolved("light", new Date(5000));
  expect(JSON.parse(localStorage.getItem("apply-test-theme-resolved")!)).toEqual({ mode: "light", until: 5000 });
});
