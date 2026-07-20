import { useCallback, useEffect, useMemo, useState } from 'react';
import { getListHostAmenityOptionsUseCase } from '../../application/composition/host-amenity.composition';
import type { AmenityItem, AmenityScope } from '../../core/types/amenity.types';

export function useHostAmenityOptions(scope: AmenityScope) {
  const listHostAmenityOptionsUseCase = useMemo(() => getListHostAmenityOptionsUseCase(), []);
  const [options, setOptions] = useState<AmenityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOptions = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await listHostAmenityOptionsUseCase.execute(scope);
    if (!result.success) {
      setError(result.error);
      setOptions([]);
    } else {
      setOptions(result.amenities);
    }

    setLoading(false);
  }, [listHostAmenityOptionsUseCase, scope]);

  useEffect(() => {
    void loadOptions();
  }, [loadOptions]);

  return { options, loading, error };
}
