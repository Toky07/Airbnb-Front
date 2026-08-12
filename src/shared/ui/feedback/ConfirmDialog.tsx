import Button from '../button/Button';
import type { ButtonVariant } from '../button/types';
import Modal from '../Modal';

type ConfirmDialogProps = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: ButtonVariant;
  isPending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  confirmVariant = 'primary',
  isPending = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal
      isOpen={isOpen}
      title={title}
      onClose={isPending ? () => undefined : onCancel}
      footer={
        <>
          <Button variant="secondary" size="sm" disabled={isPending} onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button
            variant={confirmVariant}
            size="sm"
            disabled={isPending}
            onClick={onConfirm}
          >
            {isPending ? 'Traitement…' : confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-sm leading-relaxed text-ink/70">{message}</p>
    </Modal>
  );
}
