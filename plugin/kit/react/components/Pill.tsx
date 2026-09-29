import type { ReactNode } from "react";

export type PillTone = "ok" | "run" | "q" | "dry" | "bad" | "warn";

// Spelled out in full: Tailwind keeps a component class only if it finds the whole name.
const TONE_CLASS: Record<PillTone, string> = {
  ok: "pill pill-ok",
  run: "pill pill-run",
  q: "pill pill-q",
  dry: "pill pill-dry",
  bad: "pill pill-bad",
  warn: "pill pill-warn",
};

interface PillProps {
  tone: PillTone;
  spinner?: boolean;
  dot?: boolean;
  children: ReactNode;
}

/** A status badge: `spinner` for something in progress, `dot` for a steady state. */
export function Pill({ tone, spinner = false, dot = false, children }: PillProps) {
  return (
    <span className={TONE_CLASS[tone]}>
      {spinner && <span className="spin" aria-hidden="true" />}
      {dot && <span className="dot" aria-hidden="true" />}
      {children}
    </span>
  );
}
