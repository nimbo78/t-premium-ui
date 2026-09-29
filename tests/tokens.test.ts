import { expect, test } from "vitest";
import tokensCss from "../kit/css/tokens.css?raw";
import { contrastRatio } from "./contrast";

const THEMES = [
  ["warm", "light"],
  ["warm", "dark"],
  ["classic", "light"],
  ["classic", "dark"],
] as const;

function tokensFor(style: string, mode: string): Record<string, string> {
  const block = new RegExp(`:root\\[data-style="${style}"\\]\\[data-mode="${mode}"\\][^{]*\\{([^}]*)\\}`);
  const body = tokensCss.match(block)?.[1] ?? "";
  return Object.fromEntries([...body.matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));
}

// Text on its background: WCAG AA for normal text.
const PAIRS: [string, string][] = [
  ["text", "page"], ["text", "card-solid"], ["text", "card-end"], ["text", "panel"],
  ["muted", "page"], ["muted", "card-solid"], ["muted", "card-end"], ["muted", "panel"], ["muted", "field"],
  ["seg-on-text", "seg-on"], ["seg-text", "seg"], ["on-cta", "cta-solid"], ["on-danger", "danger"],
  ["accent-text", "accent-soft"], ["pos-text", "pos-bg"], ["neg-text", "neg-bg"], ["warn-text", "warn-bg"],
  ["log-text", "log"], ["log-muted", "log"],
];

test.each(THEMES)("%s/%s text pairs meet WCAG AA 4.5:1", (style, mode) => {
  const tokens = tokensFor(style, mode);
  const failures = PAIRS.filter(([fg, bg]) => contrastRatio(tokens[fg], tokens[bg]) < 4.5).map(
    ([fg, bg]) => `${fg} on ${bg}: ${contrastRatio(tokens[fg], tokens[bg]).toFixed(2)}`,
  );
  expect(failures).toEqual([]);
});

test("every theme defines the same tokens", () => {
  const reference = Object.keys(tokensFor("warm", "light")).sort();
  expect(reference.length).toBeGreaterThan(40);
  for (const [style, mode] of THEMES) {
    expect(Object.keys(tokensFor(style, mode)).sort()).toEqual(reference);
  }
});
