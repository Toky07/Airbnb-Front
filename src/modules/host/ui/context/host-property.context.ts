import { createContext, useContext } from 'react';
import type { HostProperty } from '../../core/types/host.types';

export type HostPropertyContextValue = {
  properties: HostProperty[];
  loading: boolean;
  refreshProperties: () => Promise<void>;
};

export const HostPropertyContext = createContext<HostPropertyContextValue | null>(null);

export function useHostPropertyContext(): HostPropertyContextValue {
  const context = useContext(HostPropertyContext);
  if (!context) {
    throw new Error('useHostPropertyContext doit être utilisé dans HostPropertyProvider.');
  }
  return context;
}
