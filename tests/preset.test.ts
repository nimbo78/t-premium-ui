import { expect, test } from "vitest";
import tokensCss from "../kit/css/tokens.css?raw";
import preset from "../kit/tailwind/preset.js";

function tokenNames(value: unknown): string[] {
  if (typeof value === "string") return [...value.matchAll(/var\(--([\w-]+)\)/g)].map((m) => m[1]);
  if (value && typeof value === "object") return Object.values(value).flatMap(tokenNames);
  return [];
}

test("the preset maps Tailwind colours to the theme tokens", () => {
  expect(preset.theme.extend.colors.page).toBe("var(--page)");
  expect(preset.theme.extend.colors.fg.muted).toBe("var(--muted)");
});

test("every token the preset uses is defined in all four themes", () => {
  const blocks = tokensCss.split(/:root\[data-style=/).slice(1);
  expect(blocks).toHaveLength(4);
  const missing = tokenNames(preset.theme.extend.colors).flatMap((name) =>
    blocks.filter((block) => !block.includes(`--${name}:`)).map(() => name));
  expect(missing).toEqual([]);
});

test("headings use T-Sans (TinkoffSans), text uses Haas", () => {
  expect(preset.theme.extend.fontFamily.heading[0]).toBe("TinkoffSans");
  expect(preset.theme.extend.fontFamily.sans[0]).toBe("Haas");
});
