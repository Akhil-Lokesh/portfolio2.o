import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CommandPalette from './CommandPalette';

function setup() {
  return render(
    <MemoryRouter>
      <CommandPalette onTriggerMatrix={() => {}} />
    </MemoryRouter>
  );
}

describe('CommandPalette', () => {
  test('is closed until Cmd/Ctrl+K, then opens with a search box', () => {
    setup();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'k', metaKey: true });
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByLabelText(/search commands/i)).toBeInTheDocument();
  });

  test('filters commands as the user types', () => {
    setup();
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    const input = screen.getByLabelText(/search commands/i);
    fireEvent.change(input, { target: { value: 'work' } });
    expect(screen.getByText('Go to Work')).toBeInTheDocument();
    expect(screen.queryByText('Open GitHub')).not.toBeInTheDocument();
  });

  test('Escape closes the palette', () => {
    setup();
    fireEvent.keyDown(window, { key: 'k', metaKey: true });
    const input = screen.getByLabelText(/search commands/i);
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
