import { fireEvent, render, screen } from "@testing-library/react";
import postcss from "postcss";
import tailwindcss from "tailwindcss";
import { beforeAll, expect, test } from "vitest";
import baseCss from "../plugin/kit/css/base.css?raw";
import componentsCss from "../plugin/kit/css/components.css?raw";
import tokensCss from "../plugin/kit/css/tokens.css?raw";
import {
  AppShell, AppearancePopover, Banner, ConfirmDialog, Disclosure, Logo, NavList, PageHeader, Pill, Segmented, Toggle, UserRow,
} from "../plugin/kit/react/components";
import preset from "../plugin/kit/tailwind/preset.js";

// Tailwind keeps a component class only if it finds the whole class name in the sources, so a
// name glued together at runtime silently loses its styles in a real build.
let compiled = "";

beforeAll(async () => {
  const input = [tokensCss, "@tailwind base;", baseCss, "@tailwind components;", componentsCss, "@tailwind utilities;"].join("\n");
  compiled = (await postcss([tailwindcss({ presets: [preset], content: ["./plugin/kit/react/**/*.tsx"] })]).process(input, { from: undefined })).css;
}, 30_000);

// Icons carry lucide's own class names, which the kit does not style.
function missingFromCss(container: HTMLElement): string[] {
  const elements = [...container.querySelectorAll("[class]")].filter((el) => !el.closest("svg"));
  const names = new Set(elements.flatMap((el) => [...el.classList]));
  return [...names].filter((name) => /^[a-z][\w-]*$/.test(name) && !new RegExp(`\\.${name}(?![\\w-])`).test(compiled));
}

test("every class of every component survives the build", () => {
  const { container } = render(
    <div>
      <AppShell logo={<Logo name="П" glyph={null} />} nav={<NavList label="Разделы"><a className="nav-item" href="/">Раздел</a></NavList>}
        footer={<UserRow user="a.smirnova" onLogout={() => {}} />}>
        <PageHeader title="Заголовок" crumb={<a href="/">Назад</a>} />
        {(["ok", "run", "q", "dry", "bad", "warn"] as const).map((tone) => <Pill key={tone} tone={tone} spinner dot>{tone}</Pill>)}
        {(["info", "warn", "neg"] as const).map((tone) => <Banner key={tone} tone={tone}>{tone}</Banner>)}
        <Toggle label="Флажок" checked onChange={() => {}} note="пояснение" />
        <Segmented label="Режим" value="a" options={[{ value: "a", label: "А" }, { value: "b", label: "Б" }]} onChange={() => {}} />
        <Disclosure title="Ещё" summary="нет" open onToggle={() => {}}>внутри</Disclosure>
        <ConfirmDialog open title="Точно?" confirmLabel="Да" onConfirm={() => {}} onCancel={() => {}}>текст</ConfirmDialog>
      </AppShell>
    </div>,
  );
  fireEvent.click(screen.getByRole("button", { name: "Оформление" }));
  expect(missingFromCss(container)).toEqual([]);
});

test("the popover swatches and the appearance panel keep their styles", () => {
  const { container } = render(<AppearancePopover />);
  fireEvent.click(screen.getByRole("button", { name: "Оформление" }));
  expect(missingFromCss(container)).toEqual([]);
});
