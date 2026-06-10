import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getHostService } from '../../core/services/host.service';
import type { HostProperty } from '../../core/types/host.types';
import { HostPropertyContext } from '../context/host-property.context';

type HostPropertyProviderProps = {
  children: ReactNode;
};

const HostPropertyProvider = ({ children }: HostPropertyProviderProps) => {
  const [properties, setProperties] = useState<HostProperty[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshProperties = useCallback(async () => {
    setLoading(true);
    const items = await getHostService().listProperties();
    setProperties(items);
    setLoading(false);
  }, []);

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
