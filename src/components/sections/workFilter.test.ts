import { filterProjects } from './workFilter';
import { Project } from '../../types';

const make = (id: string, technologies: string[], year: number): Project => ({
  id,
  title: id,
  description: '',
  detailedDescription: '',
  keyFeatures: [],
  technicalChallenge: '',
  technologies,
  githubUrl: '',
  year,
});

const sample: Project[] = [
  make('a', ['Python', 'AWS'], 2024),
  make('b', ['React', 'Node.js'], 2023),
  make('c', ['Python', 'React'], 2023),
];

describe('filterProjects', () => {
  test('no filters returns everything', () => {
    expect(filterProjects(sample, [], [])).toHaveLength(3);
  });

  test('tech filter is match-any (OR) within the dimension', () => {
    const r = filterProjects(sample, ['Python', 'Node.js'], []);
    expect(r.map((p) => p.id).sort()).toEqual(['a', 'b', 'c']);
    const r2 = filterProjects(sample, ['AWS'], []);
    expect(r2.map((p) => p.id)).toEqual(['a']);
  });

  test('year filter is match-any within the dimension', () => {
    expect(filterProjects(sample, [], [2023]).map((p) => p.id).sort()).toEqual(['b', 'c']);
  });

  test('tech AND year combine across dimensions', () => {
    expect(filterProjects(sample, ['Python'], [2023]).map((p) => p.id)).toEqual(['c']);
  });
});
