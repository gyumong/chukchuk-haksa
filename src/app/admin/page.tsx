'use client';

import { TopNavigation } from '@/components/ui/TopNavigation';
import { ROUTES } from '@/constants/routes';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import { getInquiries } from '@/features/inquiry/mocks/inquiryStore';
import { InquiryStatusBadge } from '@/features/inquiry/components/InquiryStatusBadge/InquiryStatusBadge';
import layoutStyles from './layout.module.scss';
import styles from './page.module.scss';

export default function AdminHomePage() {
  const router = useInternalRouter();
  const inquiries = getInquiries();

  return (
    <div className={layoutStyles.container}>
      <TopNavigation.Preset title="문의 관리" type="back" onNavigationClick={() => router.back()} />
      <div className="gap-16" />
      <div className={layoutStyles.content}>
        {inquiries.length === 0 ? (
          <p className={styles.empty}>들어온 문의가 없습니다.</p>
        ) : (
          <div className={styles.list}>
            {inquiries.map(inquiry => (
              <button
                key={inquiry.id}
                type="button"
                className={styles.item}
                onClick={() => router.push(ROUTES.ADMIN.DETAIL, { params: [inquiry.id] })}
              >
                <InquiryStatusBadge status={inquiry.status} />
                <p className={styles.title}>{inquiry.title}</p>
                <p className={styles.meta}>
                  {inquiry.studentName} · {inquiry.studentCode}
                </p>
                <p className={styles.date}>{inquiry.createdAt}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}