import { fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Route, Routes, useLocation } from 'react-router';
import { renderWithProviders } from '../../../../test/render-with-providers';
import HomePage from './HomePage';

function SearchRouteProbe() {
  const location = useLocation();

  return <div data-testid="search-page" data-search={location.search} />;
}

describe('HomePage (integration)', () => {
  it('affiche les logements via la stack HTTP réelle et MSW', async () => {
    await renderWithProviders(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText('Suite vue mer')).toBeInTheDocument();
    });

    expect(screen.getByRole('link', { name: /afficher plus/i })).toBeInTheDocument();
  });

  it('redirige vers la recherche géolocalisée via Proche de vous', async () => {
    const getCurrentPosition = vi.fn((success: PositionCallback) => {
      success({
        coords: {
          latitude: 43.7102,
          longitude: 7.262,
          accuracy: 1,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
          toJSON: () => ({}),
        },
        timestamp: Date.now(),
      } as GeolocationPosition);
    });

    Object.defineProperty(globalThis.navigator, 'geolocation', {
      configurable: true,
      value: { getCurrentPosition },
    });

    await renderWithProviders(
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchRouteProbe />} />
      </Routes>,
      { routerInitialEntries: ['/'] },
    );

    await waitFor(() => {
      expect(screen.getByText('Suite vue mer')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /proche de vous/i }));

    await waitFor(() => {
      expect(screen.getByTestId('search-page')).toBeInTheDocument();
    });

    expect(getCurrentPosition).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('search-page')).toHaveAttribute(
      'data-search',
      expect.stringContaining('lat=43.7102'),
    );
    expect(screen.getByTestId('search-page')).toHaveAttribute(
      'data-search',
      expect.stringContaining('lng=7.262'),
    );
    expect(screen.getByTestId('search-page')).toHaveAttribute(
      'data-search',
      expect.stringContaining('radiusKm=25'),
    );
  });
});
