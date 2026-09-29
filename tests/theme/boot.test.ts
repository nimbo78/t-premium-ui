import { beforeEach, expect, test } from "vitest";
import template from "../../kit/js/boot.template.html?raw";
import { cacheResolved } from "../../kit/react/theme/applyTheme";
import { configureTheme, useThemeStore } from "../../kit/react/theme/store";

function runBoot(storageKey: string) {
  const code = template.replaceAll("__STORAGE_KEY__", storageKey).replace(/^\s*<script>/, "").replace(/<\/script>\s*$/, "");
  new Function(code)();
  const root = document.documentElement;
  return { style: root.getAttribute("data-style"), mode: root.getAttribute("data-mode") };
}

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute("data-style");
  document.documentElement.removeAttribute("data-mode");
  configureTheme({ storageKey: "boot" });
});

test("reads the choice the store saved", () => {
  useThemeStore.getState().setStyle("classic");
  useThemeStore.getState().setMode("dark");
  expect(runBoot("boot")).toEqual({ style: "classic", mode: "dark" });
});

test("in auto mode uses the cached resolved mode", () => {
  cacheResolved("dark", new Date(Date.now() + 60_000));
  expect(runBoot("boot")).toEqual({ style: "warm", mode: "dark" });
});

test("an expired cache falls back to the system preference", () => {
  cacheResolved("dark", new Date(Date.now() - 1));
  expect(runBoot("boot")).toEqual({ style: "warm", mode: "light" });
});

test("does not read another project's key", () => {
  useThemeStore.getState().setStyle("classic");
  expect(runBoot("other")).toEqual({ style: "warm", mode: "light" });
});
