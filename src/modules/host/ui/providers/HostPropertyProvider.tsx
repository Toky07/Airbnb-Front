import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getListHostPropertiesUseCase } from '../../application/property/composition/host-property.composition';
import type { HostProperty } from '../../core/types/host.types';
import { HostPropertyContext } from '../context/host-property.context';

type HostPropertyProviderProps = {
  children: ReactNode;
};

const HostPropertyProvider = ({ children }: HostPropertyProviderProps) => {
  const listHostPropertiesUseCase = useMemo(() => getListHostPropertiesUseCase(), []);
  const [properties, setProperties] = useState<HostProperty[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshProperties = useCallback(async () => {
    setLoading(true);
    const items = await listHostPropertiesUseCase.execute();
    setProperties(items);
    setLoading(false);
  }, [listHostPropertiesUseCase]);

  useEffect(() => {
    void refreshProperties();
  }, [refreshProperties]);

  const value = useMemo(
    () => ({
      properties,
      loading,
      refreshProperties,
    }),
    [properties, loading, refreshProperties],
  );

  return (
    <HostPropertyContext.Provider value={value}>{children}</HostPropertyContext.Provider>
  );
};

export default HostPropertyProvider;
