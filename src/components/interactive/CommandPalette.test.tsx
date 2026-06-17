import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CommandPalette from './CommandPalette';

// Real AnimatePresence keeps exiting children mounted while their exit animation
// runs, which never completes in JSDOM — breaking the synchronous "Escape closes"
// assertion. Scope a minimal framer-motion mock to THIS suite only (motion.* as
// plain elements, AnimatePresence as a synchronous passthrough). Other suites keep
// using the real library.
jest.mock('framer-motion', () => {
  const ReactLib = require('react');
  const MOTION_PROPS = new Set([
    'initial', 'animate', 'exit', 'transition', 'variants', 'whileHover', 'whileTap',
    'whileFocus', 'whileInView', 'viewport', 'layout', 'layoutId', 'drag',
    'dragSnapToOrigin', 'dragElastic', 'onHoverStart', 'onHoverEnd',
  ]);
  const make = (tag: string) => ({ children, ...props }: Record<string, unknown>) => {
    const clean: Record<string, unknown> = {};
    Object.keys(props).forEach((key) => {
      if (!MOTION_PROPS.has(key)) clean[key] = props[key];
    });
    return ReactLib.createElement(tag, clean, children);
  };
  return {
    __esModule: true,
    AnimatePresence: ({ children }: { children?: unknown }) =>
      ReactLib.createElement(ReactLib.Fragment, null, children),
    motion: new Proxy({}, { get: (_t: unknown, tag: string) => make(tag) }),
  };
});

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
