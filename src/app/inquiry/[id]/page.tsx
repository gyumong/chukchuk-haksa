'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';
import { TopNavigation } from '@/components/ui/TopNavigation';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import { useReportDetailQuery } from '@/features/inquiry/apis/queries/useReportDetailQuery';
import { InquiryStatusBadge } from '@/features/inquiry/components/InquiryStatusBadge/InquiryStatusBadge';
import AsyncBoundary from '@/shared/components/AsyncBoundary';
import layoutStyles from '../layout.module.scss';
import styles from './page.module.scss';

function InquiryDetailSection({ id }: { id: string }) {
  const { data: inquiry } = useReportDetailQuery(id);

  return (
    <>
      <InquiryStatusBadge status={inquiry.status} />
      <h1 className={styles.title}>{inquiry.title}</h1>
      <p className={styles.date}>{inquiry.createdAt}</p>
      <p className={styles.content}>{inquiry.content}</p>

      {inquiry.answer && (
        <div className={styles.answerCard}>
          <div className={styles.answerHeader}>
            <Image
              src="/images/illustrations/DefaultProfile.png"
              alt=""
              width={40}
              height={40}
              className={styles.answerAvatar}
            />
            <div className={styles.answerAuthorInfo}>
              <span className={styles.answerAuthor}>{inquiry.answer.authorName}</span>
              <span className={styles.answerDate}>{inquiry.answer.answeredAt}</span>
            </div>
          </div>
          <p className={styles.answerContent}>{inquiry.answer.content}</p>
        </div>
      )}
    </>
  );
}

export default function InquiryDetailPage() {
  const router = useInternalRouter();
  const params = useParams<{ id: string }>();

  return (
    <div className={layoutStyles.container}>
      <TopNavigation.Preset title="문의내역 상세" type="back" onNavigationClick={() => router.back()} />
      <div className="gap-16" />
      <div className={layoutStyles.content}>
        <AsyncBoundary fullPage>
          <InquiryDetailSection id={params.id} />
        </AsyncBoundary>
      </div>
    </div>
  );
}