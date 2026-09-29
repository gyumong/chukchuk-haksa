'use client';

import { TopNavigation } from '@/components/ui/TopNavigation';
import { ROUTES } from '@/constants/routes';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import { useMyReportsQuery } from '@/features/inquiry/apis/queries/useMyReportsQuery';
import { InquiryEmptyState } from '@/features/inquiry/components/InquiryEmptyState/InquiryEmptyState';
import { InquiryListItem } from '@/features/inquiry/components/InquiryListItem/InquiryListItem';
import { OneOnOneInquiryCard } from '@/features/inquiry/components/OneOnOneInquiryCard/OneOnOneInquiryCard';
import AsyncBoundary from '@/shared/components/AsyncBoundary';
import layoutStyles from './layout.module.scss';
import styles from './page.module.scss';

function InquiryListSection() {
  const router = useInternalRouter();
  const { data: inquiries } = useMyReportsQuery();

  return inquiries.length === 0 ? (
    <InquiryEmptyState />
  ) : (
    <div className={styles.list}>
      {inquiries.map(inquiry => (
        <InquiryListItem
          key={inquiry.id}
          inquiry={inquiry}
          onClick={() => router.push(ROUTES.INQUIRY.DETAIL, { params: [inquiry.id] })}
        />
      ))}
    </div>
  );
}

export default function InquiryPage() {
  const router = useInternalRouter();

  return (
    <div className={layoutStyles.container}>
      <TopNavigation.Preset title="문의하기" type="back" onNavigationClick={() => router.back()} />
      <div className="gap-16" />
      <div className={layoutStyles.content}>
        <OneOnOneInquiryCard onClick={() => router.push(ROUTES.INQUIRY.NEW)} />

        <div className="gap-24" />
        <h2 className={styles.sectionTitle}>문의내역</h2>

        <AsyncBoundary>
          <InquiryListSection />
        </AsyncBoundary>
      </div>
    </div>
  );
}