import { expect, test } from "vitest";
import { findRawColors } from "./rawColors";

// Every non-test source file of the project's src/, except the design system itself (src/ds/).
// This file sits in src/ds/react/guards/, so the project's src/ is three levels up.
const SOURCES = import.meta.glob<string>(
  ["../../../**/*.{ts,tsx}", "!../../../**/*.test.{ts,tsx}", "!../../../**/*.d.ts", "!../../../ds/**", "!../../../test/**"],
  { query: "?raw", import: "default", eager: true },
);

test("project sources use theme tokens, not palette classes or hex colours", () => {
  const offenders = Object.entries(SOURCES).flatMap(([path, source]) =>
    findRawColors(source).map((color) => `${path}: ${color}`));
  expect(offenders).toEqual([]);
});
