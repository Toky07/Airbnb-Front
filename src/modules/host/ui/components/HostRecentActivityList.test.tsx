import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import HostRecentActivityList from './HostRecentActivityList';

describe('HostRecentActivityList', () => {
  it('affiche un message vide sans activité', () => {
    render(<HostRecentActivityList activities={[]} />);

    expect(screen.getByText(/aucune réservation récente/i)).toBeInTheDocument();
  });

  it('affiche les réservations récentes', () => {
    render(
      <HostRecentActivityList
        activities={[
          {
            id: 1,
            label: 'Suite · Hôtel Azur',
            totalPrice: 240,
            createdAt: '2026-08-01T10:00:00.000Z',
          },
        ]}
      />,
    );

    expect(screen.getByText('Suite · Hôtel Azur')).toBeInTheDocument();
    expect(screen.getByText('240,00 €')).toBeInTheDocument();
  });
});
