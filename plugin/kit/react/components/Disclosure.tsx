import { ChevronDown, ChevronRight } from "lucide-react";
import { useId, type ReactNode } from "react";

interface DisclosureProps {
  title: string;
  summary: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}

export function Disclosure({ title, summary, open, onToggle, children }: DisclosureProps) {
  const id = useId();
  const Chevron = open ? ChevronDown : ChevronRight;
  return (
    <div className="disclosure">
      <button type="button" className="disclosure-btn" aria-expanded={open} aria-controls={id} onClick={onToggle}>
        <span>{title}</span>
        <span className="summary">{summary}<Chevron size={15} aria-hidden="true" /></span>
      </button>
      {open && <div id={id} className="pb-1">{children}</div>}
    </div>
  );
}
