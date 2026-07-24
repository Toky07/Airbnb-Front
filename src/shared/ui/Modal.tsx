import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, type ReactNode } from 'react';

type ModalProps = {
  isOpen: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'md' | 'lg' | 'xl';
};

const sizeClasses = {
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export default function Modal({
  isOpen,
  title,
  description,
  onClose,
  children,
  footer,
  size = 'md',
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-ink/50 backdrop-blur-sm transition duration-200"
        aria-label="Fermer"
        onClick={onClose}
      />
      <div
        className={`relative flex w-full ${sizeClasses[size]} max-h-[90vh] flex-col overflow-hidden rounded-2xl border border-line bg-surface soft-shadow`}
      >
        <div className="flex items-start justify-between border-b border-line px-6 py-5">
          <div>
            <h2 id="modal-title" className="font-display text-lg font-bold text-ink">
              {title}
            </h2>
            {description ? (
              <p className="mt-1 text-sm text-ink/60">{description}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-ink/40 transition duration-200 hover:bg-mist hover:text-ink/70"
            aria-label="Fermer la fenêtre"
          >
            <FontAwesomeIcon icon="xmark" className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

        {footer ? (
          <div className="flex items-center justify-end gap-3 border-t border-line bg-canvas/80 px-6 py-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
