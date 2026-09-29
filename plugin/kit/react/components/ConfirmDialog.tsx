import { useEffect, useId, useRef, type ReactNode } from "react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  busy?: boolean;
  children: ReactNode;
}

export function ConfirmDialog({
  open, title, confirmLabel, cancelLabel = "Отмена", onConfirm, onCancel, busy = false, children,
}: ConfirmDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog ref={ref} className="modal" aria-labelledby={titleId}
      onCancel={(e) => { e.preventDefault(); onCancel(); }}>
      <h2 id={titleId}>{title}</h2>
      <div className="modal-body">{children}</div>
      <div className="flex justify-end gap-2.5 mt-5">
        <button type="button" className="btn-sec" onClick={onCancel}>{cancelLabel}</button>
        <button type="button" className="btn btn-danger" onClick={onConfirm} disabled={busy}>{confirmLabel}</button>
      </div>
    </dialog>
  );
}
