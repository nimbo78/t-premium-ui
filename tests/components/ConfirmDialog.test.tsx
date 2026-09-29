import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { ConfirmDialog } from "../../kit/react/components/ConfirmDialog";

test("opens as a modal and reports the choice", () => {
  const onConfirm = vi.fn();
  const onCancel = vi.fn();
  const dialog = (open: boolean) => (
    <ConfirmDialog open={open} title="Применить изменения?" confirmLabel="Применить" onConfirm={onConfirm} onCancel={onCancel}>
      <p>тело</p>
    </ConfirmDialog>
  );
  const { rerender } = render(dialog(false));
  rerender(dialog(true));
  expect(screen.getByRole("dialog")).toHaveAttribute("open");
  fireEvent.click(screen.getByRole("button", { name: "Применить" }));
  fireEvent.click(screen.getByRole("button", { name: "Отмена" }));
  expect(onConfirm).toHaveBeenCalledOnce();
  expect(onCancel).toHaveBeenCalledOnce();
});
