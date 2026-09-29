import type { ReactNode } from "react";

export type BannerTone = "info" | "warn" | "neg";

// Spelled out in full: Tailwind keeps a component class only if it finds the whole name.
const TONE_CLASS: Record<BannerTone, string> = {
  info: "banner banner-info",
  warn: "banner banner-warn",
  neg: "banner banner-neg",
};

/** A message across the content: info (accent), warn, neg (an error, announced to screen readers). */
export function Banner({ tone, icon, children }: { tone: BannerTone; icon?: ReactNode; children: ReactNode }) {
  return (
    <div className={TONE_CLASS[tone]} role={tone === "neg" ? "alert" : undefined}>
      {icon}
      <div>{children}</div>
    </div>
  );
}
