import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { Toggle } from "../../plugin/kit/react/components/Toggle";

test("is a labelled checkbox", () => {
  const onChange = vi.fn();
  render(<Toggle label="Dry-run" checked onChange={onChange} />);
  const box = screen.getByRole("checkbox", { name: "Dry-run" });
  expect(box).toBeChecked();
  fireEvent.click(box);
  expect(onChange).toHaveBeenCalledWith(false);
});

test("shows a note and can be locked", () => {
  render(<Toggle label="Обновить location" checked disabled note="включено данными размещения" onChange={() => {}} />);
  expect(screen.getByRole("checkbox")).toBeDisabled();
  expect(screen.getByText(/включено данными размещения/)).toBeInTheDocument();
});
