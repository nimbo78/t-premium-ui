import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { Pill, type PillTone } from "../../kit/react/components/Pill";

test.each<PillTone>(["ok", "run", "q", "dry", "bad", "warn"])("tone %s gets pill and pill-%s", (tone) => {
  render(<Pill tone={tone}>метка</Pill>);
  expect(screen.getByText("метка")).toHaveClass("pill", `pill-${tone}`);
});

test("the spinner and the dot come before the label and are hidden from screen readers", () => {
  const { container } = render(<Pill tone="run" spinner dot>идёт</Pill>);
  const pill = container.firstElementChild!;
  expect(pill.children[0]).toHaveClass("spin");
  expect(pill.children[1]).toHaveClass("dot");
  expect(pill.children[0]).toHaveAttribute("aria-hidden", "true");
  expect(pill).toHaveTextContent("идёт");
});
