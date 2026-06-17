import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';

function renderHome() {
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );
}

describe('Home', () => {
  test('shows the headline statement', () => {
    renderHome();
    expect(screen.getByText(/I make data behave/i)).toBeInTheDocument();
  });

  test('links to all four sections', () => {
    renderHome();
    expect(screen.getByRole('link', { name: /About Me/i })).toHaveAttribute('href', '/about');
    expect(screen.getByRole('link', { name: /My Work/i })).toHaveAttribute('href', '/work');
    expect(screen.getByRole('link', { name: /My Skills/i })).toHaveAttribute('href', '/skills');
    expect(screen.getByRole('link', { name: /Contact/i })).toHaveAttribute('href', '/contact');
  });
});
