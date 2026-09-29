import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "vitest";
import tokensCss from "../plugin/kit/css/tokens.css?raw";
import componentsIndex from "../plugin/kit/react/components/index.ts?raw";

// Paths from the repository root. Not new URL(…, import.meta.url): Vite rewrites that into an asset URL.
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (path: string) => readFileSync(resolve(ROOT, path), "utf8");
const exists = (path: string) => existsSync(resolve(ROOT, path));

test("one version in VERSION, plugin.json and the top of CHANGELOG", () => {
  const version = read("plugin/kit/VERSION").trim();
  expect(version).toMatch(/^\d+\.\d+\.\d+$/);
  expect(JSON.parse(read("plugin/.claude-plugin/plugin.json")).version).toBe(version);
  expect(read("plugin/CHANGELOG.md").match(/^## (\d+\.\d+\.\d+)/m)?.[1]).toBe(version);
});

test("the marketplace lists plugin/ as the t-premium-ui plugin", () => {
  const plugin = JSON.parse(read("plugin/.claude-plugin/plugin.json"));
  const market = JSON.parse(read(".claude-plugin/marketplace.json"));
  expect(plugin.name).toBe("t-premium-ui");
  expect(market.plugins).toEqual([expect.objectContaining({ name: "t-premium-ui", source: "./plugin" })]);
});

test("SKILL.md is named after its folder and every kit path it mentions exists", () => {
  const skill = read("plugin/skills/t-premium-ui/SKILL.md");
  expect(skill).toMatch(/^---\r?\nname: t-premium-ui\r?\ndescription: .+\r?\n---\r?\n/);
  const paths = [...skill.matchAll(/`(kit\/[\w./-]+)`/g)].map((m) => m[1].replace(/\/$/, ""));
  expect(paths.length).toBeGreaterThan(5);
  expect(paths.filter((path) => !exists(`plugin/${path}`))).toEqual([]);
});

test("every component the kit exports has a section in reference/components.md", () => {
  const doc = read("plugin/skills/t-premium-ui/reference/components.md");
  const headings = [...doc.matchAll(/^## (.+)$/gm)].map((m) => m[1]);
  const exported = [...componentsIndex.matchAll(/export \{ ([^}]+) \}/g)]
    .flatMap((m) => m[1].split(","))
    .map((name) => name.trim())
    .filter((name) => /^[A-Z]/.test(name));
  expect(exported.filter((name) => !headings.some((heading) => heading.split(/[ ,]+/).includes(name)))).toEqual([]);
});

test("every token is described in reference/tokens.md", () => {
  const doc = read("plugin/skills/t-premium-ui/reference/tokens.md");
  const tokens = [...new Set([...tokensCss.matchAll(/--([\w-]+)\s*:/g)].map((m) => m[1]))];
  expect(tokens.filter((name) => !doc.includes(`\`--${name}\``))).toEqual([]);
});
