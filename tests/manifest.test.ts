import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "vitest";
import { buildManifest } from "../scripts/manifest";

const KIT = resolve(dirname(fileURLToPath(import.meta.url)), "../plugin/kit");

test("kit/MANIFEST lists the current hash of every text file (regenerate: node scripts/manifest.ts)", () => {
  const manifest = readFileSync(resolve(KIT, "MANIFEST"), "utf8").replace(/\r\n/g, "\n");
  expect(manifest).toBe(buildManifest(KIT));
});

test("the manifest covers the kit's text files and leaves out the binary fonts", () => {
  const paths = buildManifest(KIT).trim().split("\n").map((line) => line.split(/\s+/)[1]);
  expect(paths).toEqual(expect.arrayContaining(["VERSION", "css/tokens.css", "react/theme/store.ts", "js/boot.template.html"]));
  expect(paths.filter((path) => path.startsWith("fonts/") || path === "MANIFEST")).toEqual([]);
});
