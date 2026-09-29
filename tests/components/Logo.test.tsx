import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { Logo } from "../../kit/react/components/Logo";

test("shows the name and draws the glyph on a gradient tile", () => {
  const { container } = render(<Logo name="Продукт" glyph={<circle data-testid="glyph" cx="24" cy="24" r="8" />} />);
  expect(screen.getByText("Продукт")).toBeInTheDocument();
  const svg = container.querySelector("svg")!;
  const gradient = svg.querySelector("linearGradient")!;
  expect(svg.querySelector("rect")!.getAttribute("fill")).toBe(`url(#${gradient.id})`);
  expect(screen.getByTestId("glyph").closest("svg")).toBe(svg);
});
