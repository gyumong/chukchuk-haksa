/**
 * 석차 문자열 파싱 (예: "6/33" → { rank: 6, total: 33 })
 */
export function parseRankString(rankStr: string): { rank: number | null; total: number | null } {
  if (!rankStr || rankStr === '/') {
    return { rank: null, total: null };
  }

  const [rank, total] = rankStr.split('/').map(num => parseInt(num, 10));
  return {
    rank: isNaN(rank) ? null : rank,
    total: isNaN(total) ? null : total,
  };
}
