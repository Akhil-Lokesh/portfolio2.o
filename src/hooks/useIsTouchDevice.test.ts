import { renderHook } from '@testing-library/react';
import { useIsTouchDevice } from './useIsTouchDevice';

describe('useIsTouchDevice', () => {
  const originalInnerWidth = window.innerWidth;

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: originalInnerWidth,
    });
  });

  test('reports touch on a narrow viewport', () => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 375 });
    const { result } = renderHook(() => useIsTouchDevice());
    expect(result.current).toBe(true);
  });

  test('reports non-touch on a wide desktop viewport', () => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1440 });
    const { result } = renderHook(() => useIsTouchDevice());
    expect(result.current).toBe(false);
  });
});
