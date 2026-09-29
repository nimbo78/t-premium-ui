// Writes plugin/kit/MANIFEST: the hash of every text file the kit copies into projects. The guard
// react/guards/dsIntact.test.ts compares a project's src/ds against it to catch hand edits.
//   node scripts/manifest.ts        (Node 24 runs TypeScript directly)
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { fileHash } from "../plugin/kit/react/guards/localEdits.ts";

const KIT = resolve(dirname(fileURLToPath(import.meta.url)), "../plugin/kit");
// The manifest itself, and the binary fonts: the guard reads files as text.
const SKIP_AT_ROOT = new Set(["MANIFEST", "fonts"]);

function files(dir: string, root: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (dir === root && SKIP_AT_ROOT.has(entry.name)) return [];
    const path = join(dir, entry.name);
    return entry.isDirectory() ? files(path, root) : [path];
  });
}

export function buildManifest(kit: string = KIT): string {
  return files(kit, kit)
    .map((path) => [relative(kit, path).split("\\").join("/"), fileHash(readFileSync(path, "utf8"))])
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([path, hash]) => `${hash}  ${path}\n`)
    .join("");
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  writeFileSync(join(KIT, "MANIFEST"), buildManifest(), "utf8");
  console.log(`wrote ${join(KIT, "MANIFEST")}`);
}
