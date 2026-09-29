import { useId, type ReactNode } from "react";

/** The square tile of a product mark: the theme's gradient (--mark-a -> --mark-b). The glyph is
 * drawn by the product on a 48x48 grid in var(--mark-ink). */
export function LogoTile({ size = 28, children }: { size?: number; children?: ReactNode }) {
  const gradientId = `logo-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: "var(--mark-a)" }} />
          <stop offset="1" style={{ stopColor: "var(--mark-b)" }} />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="44" height="44" rx="13" fill={`url(#${gradientId})`} />
      {children}
    </svg>
  );
}

/** Product logo: the tile with the product's glyph, then its name. */
export function Logo({ name, glyph }: { name: string; glyph: ReactNode }) {
  return (
    <span className="logo">
      <LogoTile>{glyph}</LogoTile>
      <span>{name}</span>
    </span>
  );
}
