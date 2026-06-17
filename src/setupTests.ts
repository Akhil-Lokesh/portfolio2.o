// jest-dom adds custom matchers like toBeInTheDocument().
// CRA automatically loads this file before each test suite.
import '@testing-library/jest-dom';

// jsdom does not implement matchMedia; provide a default mock so hooks and
// components that read media queries can run in tests. Individual tests may
// override window.matchMedia to simulate specific query results.
if (typeof window.matchMedia !== 'function') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }),
  });
}
