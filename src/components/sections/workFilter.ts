import { Project } from '../../types';

/**
 * Filters projects by selected technologies and years.
 * Within a dimension the match is ANY (OR); across the two dimensions it is AND.
 * An empty selection for a dimension imposes no constraint for that dimension.
 */
export function filterProjects(
  projects: Project[],
  selectedTechs: string[],
  selectedYears: number[]
): Project[] {
  return projects.filter((p) => {
    const techOk = selectedTechs.length === 0 || p.technologies.some((t) => selectedTechs.includes(t));
    const yearOk = selectedYears.length === 0 || selectedYears.includes(p.year);
    return techOk && yearOk;
  });
}
