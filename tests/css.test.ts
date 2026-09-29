import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "vitest";
import baseCss from "../plugin/kit/css/base.css?raw";
import componentsCss from "../plugin/kit/css/components.css?raw";
import fontsCss from "../plugin/kit/css/fonts.css?raw";

// Classes a rule starts with: ".btn {", ".run-list li .run-row {" -> btn, run-list.
const ruleClasses = (css: string) => new Set([...css.matchAll(/^\s*\.([a-z][\w-]*)/gm)].map((m) => m[1]));

const SHARED = [
  "app-shell", "side", "logo", "nav-item", "nav-count", "user-row", "avatar", "icon-plain", "main",
  "page-header", "crumb", "page-title", "ap-wrap", "icon-btn", "pop-panel", "pop-title", "ap", "ap-btn",
  "swatch", "swatch-warm", "swatch-classic", "card", "panel", "panel-title", "grid-2",
  "label", "req", "field", "field-mono", "field-icon", "hint", "field-error", "chip", "toggle", "seg",
  "seg-item", "disclosure", "disclosure-btn", "btn", "btn-cta", "btn-danger", "btn-ghost", "btn-sec",
  "link", "pill", "pill-ok", "pill-run", "pill-q", "pill-dry", "pill-bad", "pill-warn", "dot", "spin",
  "banner", "banner-info", "banner-warn", "banner-neg", "table", "sub", "stats", "stat", "stat-n",
  "stat-l", "meta", "tag", "filters", "empty", "log", "log-bar", "log-btn", "log-follow", "log-body",
  "log-line", "log-muted", "auth-page", "auth-corner", "auth-card", "auth-title", "auth-foot", "modal",
  "modal-body",
];
const SWITCH_SYNC_ONLY = ["run-list", "run-row", "run-id", "recog", "recog-ok", "preview", "preview-more", "issues", "or-divider"];

test("component classes cover the shared UI", () => {
  const classes = ruleClasses(componentsCss);
  expect(SHARED.filter((name) => !classes.has(name))).toEqual([]);
});

test("classes specific to Switch Sync stay out of the kit", () => {
  const classes = ruleClasses(componentsCss);
  expect(SWITCH_SYNC_ONLY.filter((name) => classes.has(name))).toEqual([]);
});

test("base and component styles sit in cascade layers", () => {
  expect(baseCss).toMatch(/^@layer base \{/m);
  expect(componentsCss).toMatch(/^@layer components \{/m);
});

test("fonts.css points at WOFF2 files next to it", () => {
  const urls = [...fontsCss.matchAll(/url\("(\.\.\/fonts\/[^"]+)"\)/g)].map((m) => m[1]);
  expect(urls).toHaveLength(5);
  // Not new URL(…, import.meta.url): Vite rewrites that into an asset URL.
  const cssDir = resolve(dirname(fileURLToPath(import.meta.url)), "../plugin/kit/css");
  for (const url of urls) {
    const file = resolve(cssDir, url);
    expect(existsSync(file), url).toBe(true);
    expect(readFileSync(file).subarray(0, 4).toString("latin1"), url).toBe("wOF2");
  }
});
