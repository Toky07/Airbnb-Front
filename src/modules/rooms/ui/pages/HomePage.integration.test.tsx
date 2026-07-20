import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '../../../../test/render-with-providers';
import HomePage from './HomePage';

describe('HomePage (integration)', () => {
  it('affiche les logements via la stack HTTP réelle et MSW', async () => {
    renderWithProviders(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText('Suite vue mer')).toBeInTheDocument();
    });

    expect(screen.getByRole('link', { name: /afficher plus/i })).toBeInTheDocument();
  });
});
