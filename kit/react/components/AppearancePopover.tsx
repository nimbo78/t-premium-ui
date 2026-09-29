import { Moon, Sun, Sunrise, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useThemeStore } from "../theme/store";
import type { ThemeMode, ThemeStyle } from "../theme/types";

// Swatch classes spelled out in full: Tailwind keeps a component class only if it finds the whole name.
const STYLES: { style: ThemeStyle; label: string; swatch: string }[] = [
  { style: "warm", label: "Стиль T-Premium", swatch: "swatch swatch-warm" },
  { style: "classic", label: "Стиль Классика", swatch: "swatch swatch-classic" },
];

const MODES: { mode: ThemeMode; label: string; Icon: LucideIcon }[] = [
  { mode: "light", label: "Светлая тема", Icon: Sun },
  { mode: "dark", label: "Тёмная тема", Icon: Moon },
  { mode: "auto", label: "Авто: по восходу и закату", Icon: Sunrise },
];

/** One icon button (the current mode) opening a small panel: style swatches + mode icons. */
export function AppearancePopover() {
  const { style, mode, setStyle, setMode } = useThemeStore();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointer = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
    };
  }, [open]);

  const Current = MODES.find((m) => m.mode === mode)?.Icon ?? Sunrise;
  return (
    <div className="ap-wrap" ref={wrapRef}>
      <button
        ref={buttonRef}
        type="button"
        className="icon-btn"
        aria-label="Оформление"
        title="Оформление"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <Current size={18} aria-hidden="true" />
      </button>
      {open && (
        <div className="pop-panel" role="dialog" aria-label="Оформление">
          <div className="pop-title">Стиль</div>
          <div className="ap" role="group" aria-label="Стиль">
            {STYLES.map((s) => (
              <button key={s.style} type="button" className="ap-btn" aria-label={s.label} title={s.label}
                aria-pressed={style === s.style} onClick={() => setStyle(s.style)}>
                <span className={s.swatch} />
              </button>
            ))}
          </div>
          <div className="pop-title">Тема</div>
          <div className="ap" role="group" aria-label="Тема">
            {MODES.map(({ mode: m, label, Icon }) => (
              <button key={m} type="button" className="ap-btn" aria-label={label} title={label}
                aria-pressed={mode === m} onClick={() => setMode(m)}>
                <Icon size={17} aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
