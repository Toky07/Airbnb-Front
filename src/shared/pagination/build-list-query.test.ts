import { describe, expect, it } from 'vitest';
import { buildListQuery } from './build-list-query';

describe('buildListQuery', () => {
  it('inclut checkIn et checkOut quand les deux sont fournis', () => {
    const query = buildListQuery({
      page: 1,
      limit: 10,
      checkIn: '2026-08-01',
      checkOut: '2026-08-05',
    });

    expect(query).toContain('checkIn=2026-08-01');
    expect(query).toContain('checkOut=2026-08-05');
  });

  it('n’ajoute pas les dates si une seule est fournie', () => {
    const query = buildListQuery({
      page: 1,
      limit: 10,
      checkIn: '2026-08-01',
    });

    expect(query).not.toContain('checkIn');
    expect(query).not.toContain('checkOut');
  });
});
