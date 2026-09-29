import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, expect, test } from "vitest";
import { useThemeStore } from "../../kit/react/theme/store";
import { AppearancePopover } from "../../kit/react/components/AppearancePopover";

beforeEach(() => {
  localStorage.clear();
  useThemeStore.setState({ style: "warm", mode: "auto" });
});

test("opens, switches style and mode, closes on Escape", () => {
  render(<AppearancePopover />);
  const trigger = screen.getByRole("button", { name: "Оформление" });
  fireEvent.click(trigger);
  expect(trigger).toHaveAttribute("aria-expanded", "true");
  fireEvent.click(screen.getByRole("button", { name: "Стиль Классика" }));
  fireEvent.click(screen.getByRole("button", { name: "Тёмная тема" }));
  expect(useThemeStore.getState()).toMatchObject({ style: "classic", mode: "dark" });
  expect(screen.getByRole("button", { name: "Тёмная тема" })).toHaveAttribute("aria-pressed", "true");
  fireEvent.keyDown(document, { key: "Escape" });
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

test("closes on a click outside", () => {
  render(
    <div>
      <AppearancePopover />
      <p>снаружи</p>
    </div>,
  );
  fireEvent.click(screen.getByRole("button", { name: "Оформление" }));
  expect(screen.getByRole("dialog")).toBeInTheDocument();
  fireEvent.mouseDown(screen.getByText("снаружи"));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});
