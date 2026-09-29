/** Local edits inside a project's src/ds/: the design system is a released copy, replaced only by
 * «обнови дизайн-систему» and never edited by hand. kit/MANIFEST lists the hash of every text file. */

/** FNV-1a (32 bit) of the text with LF line endings: tells a hand edit from the released file. */
export function fileHash(text: string): string {
  const normalized = text.replace(/\r\n/g, "\n");
  let hash = 0x811c9dc5;
  for (let i = 0; i < normalized.length; i++) {
    hash ^= normalized.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
}

// Files a project may leave out when it installs the kit (it serves its fonts itself).
const OPTIONAL = new Set(["css/fonts.css"]);

/** Differences between the files of src/ds (path relative to src/ds -> text) and the manifest,
 * sorted: "added: …", "changed: …", "missing: …", "unreadable: …". Empty means untouched. */
export function findLocalEdits(files: Record<string, string>, manifest: string): string[] {
  const released = new Map(
    manifest.split(/\r?\n/).filter(Boolean).map((line) => {
      const [hash, path] = line.split(/\s+/, 2);
      return [path, hash] as const;
    }),
  );
  const problems: string[] = [];
  for (const [path, hash] of released) {
    const text = files[path];
    if (text === undefined) {
      if (!OPTIONAL.has(path)) problems.push(`missing: ${path}`);
    } else if (text === "" && path.endsWith(".css")) {
      problems.push(`unreadable: ${path} (add /ds\\/css\\// to test.css.include)`);
    } else if (fileHash(text) !== hash) {
      problems.push(`changed: ${path}`);
    }
  }
  for (const path of Object.keys(files)) {
    if (!released.has(path)) problems.push(`added: ${path}`);
  }
  return problems.sort();
}
