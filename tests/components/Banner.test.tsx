import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { Banner } from "../../kit/react/components/Banner";

test("an error banner is announced", () => {
  render(<Banner tone="neg">Сломалось</Banner>);
  expect(screen.getByRole("alert")).toHaveClass("banner", "banner-neg");
});

test("info and warning banners are not alerts", () => {
  render(<><Banner tone="info">Справка</Banner><Banner tone="warn">Осторожно</Banner></>);
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  expect(screen.getByText("Справка").parentElement).toHaveClass("banner-info");
  expect(screen.getByText("Осторожно").parentElement).toHaveClass("banner-warn");
});
