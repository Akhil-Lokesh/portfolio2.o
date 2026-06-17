import { fuzzyMatch } from './fuzzyMatch';

describe('fuzzyMatch', () => {
  test('empty query scores 0 (matches anything)', () => {
    expect(fuzzyMatch('', 'Anything')).toBe(0);
  });

  test('returns -1 when characters are missing or out of order', () => {
    expect(fuzzyMatch('xyz', 'About')).toBe(-1);
    expect(fuzzyMatch('ba', 'About')).toBe(-1); // 'b' before 'a' not in order
  });

  test('matches a subsequence', () => {
    expect(fuzzyMatch('wk', 'My Work')).toBeGreaterThan(0);
  });

  test('scores a prefix/start-of-word match higher than a scattered one', () => {
    const prefix = fuzzyMatch('work', 'Work');
    const scattered = fuzzyMatch('work', 'Will Order Real Kites');
    expect(prefix).toBeGreaterThan(scattered);
  });

  test('is case-insensitive', () => {
    expect(fuzzyMatch('ABOUT', 'about me')).toBeGreaterThan(0);
  });
});
