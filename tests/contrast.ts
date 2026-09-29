type Rgba = [number, number, number, number];

export function parseColor(value: string): Rgba {
  const v = value.trim().toLowerCase();
  const hex = v.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/);
  if (hex) {
    const h = hex[1].length === 3 ? [...hex[1]].map((c) => c + c).join("") : hex[1];
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), 1];
  }
  const rgb = v.match(/^rgba?\(([^)]+)\)$/);
  if (rgb) {
    const parts = rgb[1].split(",").map((p) => parseFloat(p));
    return [parts[0], parts[1], parts[2], parts.length > 3 ? parts[3] : 1];
  }
  throw new Error(`unsupported color: ${value}`);
}

function channel(c: number): number {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function luminance([r, g, b]: Rgba): number {
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** WCAG contrast of fg drawn over bg (a translucent fg is composited first). */
export function contrastRatio(fg: string, bg: string): number {
  const back = parseColor(bg);
  const front = parseColor(fg);
  const a = front[3];
  const mixed: Rgba = [0, 1, 2].map((i) => front[i] * a + back[i] * (1 - a)).concat(1) as Rgba;
  const [hi, lo] = [luminance(mixed), luminance(back)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
