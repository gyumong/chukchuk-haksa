export type GradeBand = 'a' | 'b' | 'c' | 'd' | 'p' | 'fallback';

export function getGradeBand(grade: string): GradeBand {
  const normalizedGrade = grade.trim().toUpperCase();

  if (normalizedGrade === 'P') {
    return 'p';
  }

  const firstCharacter = normalizedGrade.charAt(0);
  if (firstCharacter === 'A' || firstCharacter === 'B' || firstCharacter === 'C' || firstCharacter === 'D') {
    return firstCharacter.toLowerCase() as GradeBand;
  }

  return 'fallback';
}
