import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Hub from './Hub';

const renderHub = () =>
  render(
    <MemoryRouter>
      <Hub />
    </MemoryRouter>
  );

describe('Hub', () => {
  test('renders the four navigation sections', () => {
    renderHub();

    // Each section is rendered in both the mobile and desktop layouts.
    ['About Me', 'My Work', 'My Skills', 'Contact Me'].forEach((label) => {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    });
  });

  test('navigation links point at the right routes', () => {
    renderHub();

    expect(screen.getAllByRole('link', { name: /About Me/i })[0]).toHaveAttribute(
      'href',
      '/about'
    );
    expect(screen.getAllByRole('link', { name: /Contact Me/i })[0]).toHaveAttribute(
      'href',
      '/contact'
    );
  });
});
