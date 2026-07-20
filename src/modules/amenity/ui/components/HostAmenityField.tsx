import AmenityMultiSelect from '../../../../shared/ui/amenity/AmenityMultiSelect';
import type { AmenityScope } from '../../core/types/amenity.types';
import { useHostAmenityOptions } from '../hooks/useHostAmenityOptions';

type HostAmenityFieldProps = {
  scope: AmenityScope;
  value: number[];
  onChange: (ids: number[]) => void;
  label: string;
  hint?: string;
};

const HostAmenityField = ({
  scope,
  value,
  onChange,
  label,
  hint,
}: HostAmenityFieldProps) => {
  const { options, loading, error } = useHostAmenityOptions(scope);

  return (
    <div className="space-y-4 md:col-span-2">
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {loading ? (
        <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
      ) : (
        <AmenityMultiSelect
          label={label}
          options={options.filter((item) => item.isActive)}
          value={value}
          onChange={onChange}
          hint={hint}
        />
      )}
    </div>
  );
};

export default HostAmenityField;
