const PALETTE =
  "(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\\d{2,3}|white|black";
const UTILITY = "(?:bg|text|border|ring|outline|divide|fill|stroke|from|via|to|placeholder|decoration|shadow|caret|accent)";
const PALETTE_CLASS = new RegExp(`(?<![\\w-])${UTILITY}(?:-[trblxy])?-(?:${PALETTE})(?:\\/\\d+)?(?![\\w-])`, "g");
const HEX_COLOR = /(?<=["'`[(\s:])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![0-9a-zA-Z])/g;

/** Tailwind palette classes and hex colours in a source file: only theme tokens are allowed. */
export function findRawColors(source: string): string[] {
  return [...source.matchAll(PALETTE_CLASS), ...source.matchAll(HEX_COLOR)].map((m) => m[0]);
}
