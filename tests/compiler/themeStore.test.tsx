import { act, render, screen } from "@testing-library/react";
import { beforeEach, expect, test } from "vitest";
import { AppearancePopover } from "../../plugin/kit/react/components/AppearancePopover";
import { ThemeController } from "../../plugin/kit/react/theme/ThemeController";
import { useThemeStore } from "../../plugin/kit/react/theme/store";

beforeEach(() => {
  localStorage.clear();
  useThemeStore.setState({ style: "warm", mode: "light" });
});

test("under React Compiler the theme follows the store across re-renders", () => {
  render(<><ThemeController /><AppearancePopover /></>);
  expect(document.documentElement.dataset).toMatchObject({ style: "warm", mode: "light" });
  act(() => useThemeStore.getState().setStyle("classic"));
  act(() => useThemeStore.getState().setMode("dark"));
  expect(document.documentElement.dataset).toMatchObject({ style: "classic", mode: "dark" });
  expect(screen.getByRole("button", { name: "Оформление" })).toBeInTheDocument();
});
