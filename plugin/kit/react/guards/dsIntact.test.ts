import { expect, test } from "vitest";
import manifest from "../../MANIFEST?raw";
import self from "./dsIntact.test.ts?raw";
import { findLocalEdits } from "./localEdits";

// Every text file of src/ds/ (this file sits in src/ds/react/guards/). src/ds is a released copy of
// T-Premium UI: change the design system itself and bring it in with «обнови дизайн-систему».
const FILES = import.meta.glob<string>(["../../**/*", "!../../MANIFEST", "!../../fonts/**"], {
  query: "?raw",
  import: "default",
  eager: true,
});

// Glob keys are relative to this file ("../components/Pill.tsx", "../../css/tokens.css"): resolve
// them against react/guards/ to get paths from the root of src/ds, as the manifest has them.
const fromDsRoot = (key: string) => new URL(key, "file:///ds/react/guards/").pathname.slice("/ds/".length);

test("src/ds has no local edits", () => {
  const files = Object.fromEntries(Object.entries(FILES).map(([key, text]) => [fromDsRoot(key), text]));
  files["react/guards/dsIntact.test.ts"] = self; // a glob never lists the file it is in
  expect(Object.keys(files).length).toBeGreaterThan(0);
  expect(findLocalEdits(files, manifest)).toEqual([]);
});
