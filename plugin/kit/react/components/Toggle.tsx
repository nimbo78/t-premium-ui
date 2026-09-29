interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  note?: string;
}

export function Toggle({ label, checked, onChange, disabled = false, note }: ToggleProps) {
  return (
    <label className="chip" data-disabled={disabled}>
      <input type="checkbox" className="sr-only" checked={checked} disabled={disabled}
        onChange={(e) => onChange(e.target.checked)} />
      <span className="toggle" data-on={checked} aria-hidden="true" />
      <span>{label}</span>
      {note && <span className="hint">· {note}</span>}
    </label>
  );
}
