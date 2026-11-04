'use client';

import { useState } from 'react';
import AcademicStatsCard from '@/components/academic/AcademicStatsCard/AcademicStatsCard';
import type { ReferenceRank } from '@/features/academic/types/referenceRank';
import { getReferenceRankValue } from '@/features/academic/utils/referenceRankView';
import { ReferenceRankInfoDialog } from '@/features/dashboard/components/ReferenceRankInfoDialog/ReferenceRankInfoDialog';
import { ReferenceRankText } from '@/features/dashboard/components/ReferenceRankValue/ReferenceRankValue';
import styles from './page.module.scss';

const BASE: ReferenceRank = {
  cohort: { year: 2026, semester: 10, majorCode: 'SAMPLE', majorName: '컴퓨터SW전공', gradeLevel: 3 },
  status: 'EXACT',
  rank: 32,
  rankFrom: null,
  rankTo: null,
  participantCount: 50,
  tiedCount: 1,
  reasons: [],
  dataAsOf: '2026-11-02T16:00:00Z',
  calculatedAt: '2026-11-03T00:00:00Z',
  rulesVersion: 'suwon-reference-v1',
};

const NO_RANK = { rank: null, participantCount: null, tiedCount: null, dataAsOf: null };

const SCENARIOS: Array<{ label: string; data: ReferenceRank }> = [
  { label: 'EXACT', data: BASE },
  { label: 'TIED', data: { ...BASE, status: 'TIED', tiedCount: 3 } },
  { label: 'EXACT (세 자리)', data: { ...BASE, rank: 101, participantCount: 150 } },
  {
    label: 'UNRESOLVED',
    data: { ...BASE, status: 'UNRESOLVED', rank: null, rankFrom: 5, rankTo: 7, tiedCount: null },
  },
  {
    label: 'UNRESOLVED (세 자리)',
    data: { ...BASE, status: 'UNRESOLVED', rank: null, rankFrom: 101, rankTo: 120, tiedCount: null },
  },
  {
    label: 'INSUFFICIENT_PEERS',
    data: { ...BASE, status: 'INSUFFICIENT_PEERS', rank: null, participantCount: 1, tiedCount: null },
  },
  {
    label: 'UNAVAILABLE (워커 반영 전 전원)',
    data: { ...BASE, ...NO_RANK, cohort: null, status: 'UNAVAILABLE', reasons: ['TERM_SNAPSHOT_MISSING'] },
  },
];

export default function ReferenceRankPreview() {
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  return (
    <main className={styles.page}>
      {SCENARIOS.map(({ label, data }) => (
        <div key={label} className={styles.scenario}>
          <p className={styles.label}>{label}</p>
          <AcademicStatsCard
            earnedCredits={109}
            gpa={3.03}
            rankValue={<ReferenceRankText value={getReferenceRankValue(data)} />}
            onRankInfoClick={() => setIsInfoOpen(true)}
          />
        </div>
      ))}
      <ReferenceRankInfoDialog isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
    </main>
  );
}
