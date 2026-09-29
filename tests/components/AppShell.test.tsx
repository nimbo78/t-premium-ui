import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { AppShell, NavList, UserRow, initials } from "../../kit/react/components/AppShell";

test.each([["a.smirnova", "AS"], ["igor", "I"], ["", "?"], [null, "?"], [undefined, "?"]])("initials(%s) = %s", (user, expected) => {
  expect(initials(user)).toBe(expected);
});

test("sidebar with navigation and the user, main area with the content", () => {
  const onLogout = vi.fn();
  render(
    <AppShell logo={<span>Лого</span>} nav={<NavList label="Разделы"><a className="nav-item" href="/">Главная</a></NavList>}
      footer={<UserRow user="a.smirnova" onLogout={onLogout} />}>
      <p>Содержимое</p>
    </AppShell>,
  );
  expect(screen.getByRole("navigation", { name: "Разделы" })).toBeInTheDocument();
  expect(screen.getByRole("main")).toHaveTextContent("Содержимое");
  expect(screen.getByText("AS")).toHaveClass("avatar");
  fireEvent.click(screen.getByRole("button", { name: "Выйти" }));
  expect(onLogout).toHaveBeenCalledOnce();
});
