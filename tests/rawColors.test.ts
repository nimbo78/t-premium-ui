import { expect, test } from "vitest";
import { findRawColors } from "../kit/react/guards/rawColors";

const KIT_SOURCES = import.meta.glob<string>(
  ["../kit/react/**/*.{ts,tsx}", "!../kit/react/guards/**"],
  { query: "?raw", import: "default", eager: true },
);

test.each(["text-red-600", "bg-black/30", "border-gray-200", "text-white", 'style={{ color: "#fff" }}', "bg-[#ffdd2d]"])(
  "the guard flags %s",
  (sample) => {
    expect(findRawColors(`<div className="${sample}" />`)).not.toEqual([]);
  },
);

test.each(["bg-accent", "text-fg-muted", "text-pos", "bg-[var(--scrim)]", "whitespace-nowrap", "&#8212;"])(
  "the guard allows %s",
  (sample) => {
    expect(findRawColors(`<div className="${sample}" />`)).toEqual([]);
  },
);

test("the kit's own components use theme tokens only", () => {
  const offenders = Object.entries(KIT_SOURCES).flatMap(([path, source]) =>
    findRawColors(source).map((color) => `${path}: ${color}`));
  expect(offenders).toEqual([]);
});
