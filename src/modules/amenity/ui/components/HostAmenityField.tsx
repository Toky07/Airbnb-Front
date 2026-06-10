import { useCallback, useEffect, useState } from 'react';
import AmenityMultiSelect from '../../../../shared/ui/amenity/AmenityMultiSelect';
import { getHostAmenityService } from '../../core/services/host-amenity.service';
import type { AmenityItem, AmenityScope } from '../../core/types/amenity.types';

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
  const [options, setOptions] = useState<AmenityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOptions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await getHostAmenityService().listOptions(scope);
      setOptions(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Chargement impossible.');
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }, [scope]);

  useEffect(() => {
    void loadOptions();
  }, [loadOptions]);

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
