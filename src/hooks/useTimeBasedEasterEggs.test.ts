import { renderHook } from '@testing-library/react';
import { useTimeBasedEasterEggs } from './useTimeBasedEasterEggs';

describe('useTimeBasedEasterEggs', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('flags late night and shows the night owl message', () => {
    jest.setSystemTime(new Date(2025, 0, 1, 2, 0, 0)); // Wed 2:00 AM
    const { result } = renderHook(() => useTimeBasedEasterEggs());

    expect(result.current.isLateNight).toBe(true);
    expect(result.current.timeMessage).toMatch(/night owl/i);
  });

  test('shows no easter egg message on a normal weekday afternoon', () => {
    jest.setSystemTime(new Date(2025, 0, 1, 15, 0, 0)); // Wed 3:00 PM
    const { result } = renderHook(() => useTimeBasedEasterEggs());

    expect(result.current.isLateNight).toBe(false);
    expect(result.current.isFridayAfternoon).toBe(false);
    expect(result.current.timeMessage).toBeNull();
  });

  test('detects Friday afternoon', () => {
    jest.setSystemTime(new Date(2025, 0, 3, 14, 0, 0)); // Fri 2:00 PM
    const { result } = renderHook(() => useTimeBasedEasterEggs());

    expect(result.current.isFridayAfternoon).toBe(true);
  });

  test('detects Programmer’s Day (Sept 13)', () => {
    jest.setSystemTime(new Date(2025, 8, 13, 10, 0, 0)); // Sep 13, 10:00 AM
    const { result } = renderHook(() => useTimeBasedEasterEggs());

    expect(result.current.isProgrammerDay).toBe(true);
  });
});
