import { expect, test } from "vitest";
import { fileHash, findLocalEdits } from "../plugin/kit/react/guards/localEdits";

const manifestFor = (files: Record<string, string>) =>
  Object.entries(files).map(([path, text]) => `${fileHash(text)}  ${path}`).join("\n") + "\n";

const RELEASED: Record<string, string> = {
  "css/tokens.css": ":root { --page: #ffffff; }\n",
  "react/index.ts": 'export * from "./theme";\n',
  VERSION: "0.1.1\n",
};

test("an untouched copy has no local edits", () => {
  expect(findLocalEdits({ ...RELEASED }, manifestFor(RELEASED))).toEqual([]);
});

test("line endings are not edits (a Windows checkout turns LF into CRLF)", () => {
  const crlf = Object.fromEntries(Object.entries(RELEASED).map(([path, text]) => [path, text.replace(/\n/g, "\r\n")]));
  expect(findLocalEdits(crlf, manifestFor(RELEASED))).toEqual([]);
});

test("a changed, a missing and an added file are all reported", () => {
  const files: Record<string, string> = { ...RELEASED, "css/tokens.css": ":root { --page: #000000; }\n", "react/extra.ts": "x" };
  delete files["react/index.ts"];
  expect(findLocalEdits(files, manifestFor(RELEASED))).toEqual([
    "added: react/extra.ts",
    "changed: css/tokens.css",
    "missing: react/index.ts",
  ]);
});

test("fonts.css may be left out: the project serves its fonts itself", () => {
  const released = { ...RELEASED, "css/fonts.css": "@font-face {}\n" };
  expect(findLocalEdits({ ...RELEASED }, manifestFor(released))).toEqual([]);
});

test("CSS that Vitest stubbed to an empty string says how to fix the test config", () => {
  const files = { ...RELEASED, "css/tokens.css": "" };
  expect(findLocalEdits(files, manifestFor(RELEASED))).toEqual([
    "unreadable: css/tokens.css (add /ds\\/css\\// to test.css.include)",
  ]);
});
