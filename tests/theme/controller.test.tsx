import { render } from "@testing-library/react";
import { beforeEach, expect, test } from "vitest";
import { ThemeController } from "../../kit/react/theme/ThemeController";
import { useThemeStore } from "../../kit/react/theme/store";

beforeEach(() => {
  localStorage.clear();
  useThemeStore.setState({ style: "warm", mode: "auto" });
});

test("applies the chosen style and mode to <html>", () => {
  useThemeStore.getState().setStyle("classic");
  useThemeStore.getState().setMode("dark");
  render(<ThemeController />);
  expect(document.documentElement.dataset).toMatchObject({ style: "classic", mode: "dark" });
});
