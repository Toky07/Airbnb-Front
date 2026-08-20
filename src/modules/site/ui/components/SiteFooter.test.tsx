import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import SiteFooter from './SiteFooter';

describe('SiteFooter', () => {
  it('pointe vers les pages d’aide, de contact et légales', () => {
    render(
      <MemoryRouter>
        <SiteFooter />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: 'Centre d’aide' })).toHaveAttribute('href', '/help');
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '/contact');
    expect(screen.getByRole('link', { name: 'Confidentialité' })).toHaveAttribute(
      'href',
      '/legal/confidentialite',
    );
    expect(screen.getByRole('link', { name: 'Conditions' })).toHaveAttribute('href', '/legal/cgu');
    expect(screen.getByRole('link', { name: 'Mentions légales' })).toHaveAttribute(
      'href',
      '/legal/mentions',
    );
  });
});
