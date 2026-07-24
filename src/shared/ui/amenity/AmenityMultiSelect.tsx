import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { resolveAmenityIcon } from '../../utils/resolve-amenity-icon';
import type { AmenityItem } from '../../../modules/amenity/core/types/amenity.types';

type AmenityMultiSelectProps = {
  label: string;
  options: AmenityItem[];
  value: number[];
  onChange: (ids: number[]) => void;
  hint?: string;
};

const AmenityMultiSelect = ({
  label,
  options,
  value,
  onChange,
  hint,
}: AmenityMultiSelectProps) => {
  const toggle = (id: number) => {
    if (value.includes(id)) {
      onChange(value.filter((current) => current !== id));
      return;
    }
    onChange([...value, id]);
  };

  if (options.length === 0) {
    return (
      <div>
        <p className="text-sm font-medium text-ink/80">{label}</p>
        <p className="mt-2 text-sm text-ink/60">Aucun équipement disponible.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-3 text-sm font-medium text-ink/80">{label}</p>
      {hint ? <p className="mb-3 text-xs text-ink/50">{hint}</p> : null}
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((amenity) => {
          const checked = value.includes(amenity.id);
          return (
            <label
              key={amenity.id}
              className={[
                'flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition duration-200',
                checked
                  ? 'border-brand/30 bg-brand/5 text-ink'
                  : 'border-line bg-mist/60 text-ink/70 hover:border-brand/20 hover:bg-mist',
              ].join(' ')}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(amenity.id)}
                className="h-4 w-4 rounded border-line text-brand"
              />
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-surface text-brand">
                <FontAwesomeIcon
                  icon={resolveAmenityIcon(amenity.icon)}
                  className="h-3.5 w-3.5"
                />
              </span>
              <span className="font-medium">{amenity.name}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default AmenityMultiSelect;
