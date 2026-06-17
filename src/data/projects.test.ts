import { projects } from './projects';

describe('projects data', () => {
  test('every project has a non-empty hook', () => {
    for (const p of projects) {
      expect(typeof p.hook).toBe('string');
      expect((p.hook ?? '').length).toBeGreaterThan(0);
    }
  });

  test('exactly one project is featured, and it is the recommendation engine', () => {
    const featured = projects.filter((p) => p.featured);
    expect(featured).toHaveLength(1);
    expect(featured[0].id).toBe('recommendation-engine');
  });
});
