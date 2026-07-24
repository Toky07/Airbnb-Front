import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMemo, useState } from 'react';
import Modal from '../Modal';
import { resolveAmenityIcon } from '../../utils/resolve-amenity-icon';
import { FONT_AWESOME_ICON_OPTIONS } from './fontawesome-icon-options';

type IconPickerModalProps = {
  isOpen: boolean;
  value: string;
  onClose: () => void;
  onSelect: (iconId: string) => void;
};

const IconPickerModal = ({ isOpen, value, onClose, onSelect }: IconPickerModalProps) => {
  const [search, setSearch] = useState('');

  const filteredOptions = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return FONT_AWESOME_ICON_OPTIONS;
    }

    return FONT_AWESOME_ICON_OPTIONS.filter(
      (option) =>
        option.label.toLowerCase().includes(query) ||
        option.id.toLowerCase().includes(query),
    );
  }, [search]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Choisir une icône"
      description="Sélectionnez une icône Font Awesome pour représenter cet équipement."
      size="lg"
    >
      <div className="space-y-4">
        <div className="relative">
          <FontAwesomeIcon
            icon="magnifying-glass"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Rechercher une icône…"
            className="w-full rounded-xl border border-line bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition duration-200 focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>

        {filteredOptions.length === 0 ? (
          <p className="py-8 text-center text-sm text-ink/60">Aucune icône trouvée.</p>
        ) : (
          <div className="grid max-h-80 grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4 md:grid-cols-5">
            {filteredOptions.map((option) => {
              const selected = value === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    onSelect(option.id);
                    onClose();
                  }}
                  className={[
                    'flex flex-col items-center gap-2 rounded-xl border px-2 py-3 text-center transition duration-200',
                    selected
                      ? 'border-brand/40 bg-brand/5 text-ink'
                      : 'border-line bg-mist/60 text-ink/70 hover:border-brand/30 hover:bg-brand/5',
                  ].join(' ')}
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-surface text-brand">
                    <FontAwesomeIcon
                      icon={resolveAmenityIcon(option.id)}
                      className="h-4 w-4"
                    />
                  </span>
                  <span className="text-xs font-medium leading-tight">{option.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default IconPickerModal;
