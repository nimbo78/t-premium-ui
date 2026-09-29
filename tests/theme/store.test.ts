import { beforeEach, expect, test, vi } from "vitest";
import { configureTheme, useThemeStore } from "../../plugin/kit/react/theme/store";

beforeEach(() => {
  localStorage.clear();
  configureTheme({ storageKey: "store-test" });
});

test("defaults: T-Premium style, auto mode", () => {
  expect(useThemeStore.getState()).toMatchObject({ style: "warm", mode: "auto" });
});

test("the choice persists under <storageKey>-theme in the zustand persist format", () => {
  useThemeStore.getState().setStyle("classic");
  useThemeStore.getState().setMode("dark");
  expect(JSON.parse(localStorage.getItem("store-test-theme")!)).toEqual({ state: { style: "classic", mode: "dark" }, version: 1 });
});

test("a saved choice is restored when the theme is configured again (page reload)", () => {
  localStorage.setItem("store-test-theme", JSON.stringify({ state: { style: "classic", mode: "light" }, version: 1 }));
  configureTheme({ storageKey: "store-test" });
  expect(useThemeStore.getState()).toMatchObject({ style: "classic", mode: "light" });
});

test("using the theme before configureTheme is an explicit error", async () => {
  vi.resetModules();
  const fresh = await import("../../plugin/kit/react/theme/store");
  expect(() => fresh.useThemeStore.getState()).toThrow(/configureTheme/);
});
