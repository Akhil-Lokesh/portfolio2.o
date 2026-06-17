import { renderHook, act } from '@testing-library/react';
import { useKonamiCode } from './useKonamiCode';
import { KONAMI_CODE } from '../utils/constants';

const press = (code: string) =>
  act(() => {
    window.dispatchEvent(new KeyboardEvent('keydown', { code }));
  });

describe('useKonamiCode', () => {
  test('starts inactive and stays inactive on a partial sequence', () => {
    const { result } = renderHook(() => useKonamiCode());
    expect(result.current.isKonamiActivated).toBe(false);

    KONAMI_CODE.slice(0, -1).forEach(press);
    expect(result.current.isKonamiActivated).toBe(false);
  });

  test('activates once the full konami code is entered', () => {
    const { result } = renderHook(() => useKonamiCode());
    KONAMI_CODE.forEach(press);
    expect(result.current.isKonamiActivated).toBe(true);
  });

  test('activates even when preceded by unrelated keypresses', () => {
    const { result } = renderHook(() => useKonamiCode());
    ['KeyX', 'KeyY', 'Space', 'Enter'].forEach(press);
    KONAMI_CODE.forEach(press);
    expect(result.current.isKonamiActivated).toBe(true);
  });

  test('does not activate for a wrong sequence', () => {
    const { result } = renderHook(() => useKonamiCode());
    Array.from({ length: KONAMI_CODE.length }, () => 'KeyA').forEach(press);
    expect(result.current.isKonamiActivated).toBe(false);
  });
});
