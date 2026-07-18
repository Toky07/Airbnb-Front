import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import AppErrorBoundary from './AppErrorBoundary';

function createRecoverableChild() {
  let shouldThrow = true;

  const RecoverableChild = () => {
    if (shouldThrow) {
      throw new Error('Erreur de test');
    }

    return <p>Contenu rétabli</p>;
  };

  return {
    RecoverableChild,
    recover: () => {
      shouldThrow = false;
    },
  };
}

describe('AppErrorBoundary', () => {
  it('affiche le fallback quand un enfant lève une erreur', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const Bomb = () => {
      throw new Error('boom');
    };

    render(
      <AppErrorBoundary>
        <Bomb />
      </AppErrorBoundary>,
    );

    expect(
      screen.getByRole('heading', { name: /une erreur est survenue/i }),
    ).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it('permet de réessayer après une erreur', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { RecoverableChild, recover } = createRecoverableChild();

    render(
      <AppErrorBoundary>
        <RecoverableChild />
      </AppErrorBoundary>,
    );

    expect(
      screen.getByRole('heading', { name: /une erreur est survenue/i }),
    ).toBeInTheDocument();

    recover();
    fireEvent.click(screen.getByRole('button', { name: /réessayer/i }));

    expect(screen.getByText('Contenu rétabli')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});
