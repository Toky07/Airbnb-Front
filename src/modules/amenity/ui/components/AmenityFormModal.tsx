import { useEffect, useState, type FormEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from '../../../../shared/ui/Modal';
import IconPickerModal from '../../../../shared/ui/amenity/IconPickerModal';
import { resolveAmenityIcon } from '../../../../shared/utils/resolve-amenity-icon';
import type {
  AmenityFormInput,
  AmenityItem,
  AmenityScope,
} from '../../core/types/amenity.types';

type AmenityFormModalProps = {
  isOpen: boolean;
  title: string;
  submitLabel: string;
  scope: AmenityScope;
  initial?: AmenityItem | null;
  onClose: () => void;
  onSubmit: (input: AmenityFormInput) => Promise<void>;
};

const AmenityFormModal = ({
  isOpen,
  title,
  submitLabel,
  scope,
  initial,
  onClose,
  onSubmit,
}: AmenityFormModalProps) => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    setName(initial?.name ?? '');
    setIcon(initial?.icon ?? '');
    setIsActive(initial?.isActive ?? true);
    setError(null);
    setIsSaving(false);
    setIsIconPickerOpen(false);
  }, [isOpen, initial]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!icon) {
      setError('Veuillez choisir une icône.');
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      await onSubmit({ name: name.trim(), icon, scope, isActive });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Enregistrement impossible');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title={title}>
        <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-ink/70">Nom</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink outline-none transition duration-200 focus:border-brand focus:ring-2 focus:ring-brand/20"
              placeholder="Ex. WiFi"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-ink/70">Icône</label>
            <button
              type="button"
              onClick={() => setIsIconPickerOpen(true)}
              className="flex w-full items-center justify-between rounded-xl border border-line bg-mist/60 px-4 py-3 text-sm transition duration-200 hover:border-brand/30 hover:bg-brand/5"
            >
              <span className="flex items-center gap-3 text-ink/80">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-surface text-brand soft-shadow">
                  {icon ? (
                    <FontAwesomeIcon icon={resolveAmenityIcon(icon)} className="h-4 w-4" />
                  ) : (
                    <FontAwesomeIcon icon="image" className="h-4 w-4 text-ink/40" />
                  )}
                </span>
                {icon ? 'Modifier l’icône' : 'Choisir une icône'}
              </span>
              <span className="text-xs font-medium text-brand">Parcourir</span>
            </button>
          </div>

          <label className="flex items-center gap-2 text-sm text-ink/70">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 rounded border-line text-brand"
            />
            Actif
          </label>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-line px-4 py-2 text-sm font-medium text-ink/70 transition duration-200 hover:bg-mist"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-brand-dark disabled:opacity-50"
            >
              {isSaving ? 'Enregistrement…' : submitLabel}
            </button>
          </div>
        </form>
      </Modal>

      <IconPickerModal
        isOpen={isIconPickerOpen}
        value={icon}
        onClose={() => setIsIconPickerOpen(false)}
        onSelect={setIcon}
      />
    </>
  );
};

export default AmenityFormModal;
