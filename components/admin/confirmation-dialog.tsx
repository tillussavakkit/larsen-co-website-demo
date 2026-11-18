'use client';

import { useEffect, useId, useRef, type ReactNode } from 'react';

type ConfirmationDialogProps = {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmationDialog({
  open,
  title,
  children,
  confirmLabel = 'Bekræft',
  cancelLabel = 'Annuller',
  danger = false,
  busy = false,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      cancelRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="admin-dialog"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onCancel();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget && !busy) onCancel();
      }}
    >
      <div className="admin-dialog__panel">
        <p className="admin-kicker">Bekræft handling</p>
        <h2 id={titleId}>{title}</h2>
        <div id={descriptionId} className="admin-dialog__body">
          {children}
        </div>
        <div className="admin-dialog__actions">
          <button
            ref={cancelRef}
            type="button"
            className="admin-button admin-button--secondary"
            onClick={onCancel}
            disabled={busy}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`admin-button ${danger ? 'admin-button--danger' : 'admin-button--primary'}`}
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? 'Arbejder…' : confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
