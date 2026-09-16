'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';
import { TopNavigation } from '@/components/ui/TopNavigation';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import { InquiryStatusBadge } from '@/features/inquiry/components/InquiryStatusBadge/InquiryStatusBadge';
import { getInquiryById } from '@/features/inquiry/mocks/inquiryStore';
import layoutStyles from '../layout.module.scss';
import styles from './page.module.scss';

export default function InquiryDetailPage() {
  const router = useInternalRouter();
  const params = useParams<{ id: string }>();
  const inquiry = getInquiryById(params.id);

  return (
    <div className={layoutStyles.container}>
      <TopNavigation.Preset title="문의내역 상세" type="back" onNavigationClick={() => router.back()} />
      <div className="gap-16" />
      <div className={layoutStyles.content}>
        {!inquiry ? (
          <p className={styles.notFound}>문의 내역을 찾을 수 없습니다.</p>
        ) : (
          <>
            <InquiryStatusBadge status={inquiry.status} />
            <h1 className={styles.title}>{inquiry.title}</h1>
            <p className={styles.date}>{inquiry.createdAt}</p>
            <p className={styles.content}>{inquiry.content}</p>

            {inquiry.answer && (
              <div className={styles.answerCard}>
                <div className={styles.answerHeader}>
                  {/* TODO: 디자이너 전달 관리자 아바타로 교체 필요 */}
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
        )}
      </div>
    </div>
  );
}