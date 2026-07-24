import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import FavoriteButton from './FavoriteButton';

const toggle = vi.fn();

vi.mock('../hooks/useFavoriteToggle', () => ({
  useFavoriteToggle: () => ({
    isFavorite: false,
    loading: false,
    error: null,
    toggle,
    isAuthenticated: true,
  }),
}));

describe('FavoriteButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('affiche le bouton favori et déclenche le toggle', async () => {
    render(
      <MemoryRouter>
        <FavoriteButton roomId={1} />
      </MemoryRouter>,
    );

    const button = screen.getByRole('button', { name: /ajouter aux favoris/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);

    await waitFor(() => {
      expect(toggle).toHaveBeenCalled();
    });
  });
});
