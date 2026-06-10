export type AmenityScope = 'property' | 'room';

export type AmenityItem = {
  id: number;
  name: string;
  icon: string;
  scope: AmenityScope;
  isActive: boolean;
};

export type AmenityFormInput = {
  name: string;
  icon: string;
  scope: AmenityScope;
  isActive?: boolean;
};

export function mapAmenityItem(data: unknown): AmenityItem | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const record = data as Record<string, unknown>;
  if (typeof record.id !== 'number' || typeof record.name !== 'string') {
    return null;
  }

  const scope = record.scope === 'room' ? 'room' : 'property';

  return {
    id: record.id,
    name: record.name,
    icon: String(record.icon ?? ''),
    scope,
    isActive: record.isActive !== false,
  };
}
