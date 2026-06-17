/**
 * Scores how well `query` fuzzy-matches `text`.
 * Returns -1 if not all query chars appear in order; otherwise a score >= 0
 * where consecutive and start-of-word matches score higher. Empty query => 0.
 */
export function fuzzyMatch(query: string, text: string): number {
  if (!query) return 0;
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  let qi = 0;
  let score = 0;
  let lastMatch = -2;

  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      score += 1;
      if (lastMatch === ti - 1) score += 4; // consecutive run bonus
      if (ti === 0 || t[ti - 1] === ' ') score += 2; // start-of-word bonus
      lastMatch = ti;
      qi += 1;
    }
  }

  return qi === q.length ? score : -1;
}
