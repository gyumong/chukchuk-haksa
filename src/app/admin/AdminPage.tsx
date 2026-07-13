'use client';

import { TopNavigation } from '@/components/ui';
import { AdminLogPanel } from '@/features/admin/components/AdminLogPanel/AdminLogPanel';
import { CreateTestUserSection } from '@/features/admin/components/CreateTestUserSection/CreateTestUserSection';
import { EnvBanner } from '@/features/admin/components/EnvBanner/EnvBanner';
import { GraduationCoursesSection } from '@/features/admin/components/GraduationCoursesSection/GraduationCoursesSection';
import { LectureEvaluationSection } from '@/features/admin/components/LectureEvaluationSection/LectureEvaluationSection';
import { MajorSection } from '@/features/admin/components/MajorSection/MajorSection';
import { TestCourseSection } from '@/features/admin/components/TestCourseSection/TestCourseSection';
import { TestOptionsSection } from '@/features/admin/components/TestOptionsSection/TestOptionsSection';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import styles from './AdminPage.module.scss';

// dev 전용 테스트 어드민. 진입 차단은 서버 컴포넌트(page.tsx)가 담당한다.
//
// "대상 계정 = 현재 세션 계정" 이 이 페이지의 핵심 규약이다. /api/admin/me/** 는 @secure 라
// securityWorker 가 세션 토큰을 Bearer 로 자동 부착하고, 요청별 Authorization 오버라이드는
// http-client 의 mergeRequestParams 가 securityWorker 헤더를 나중에 덮어써서 불가능하다.
// 따라서 다른 계정을 조작하려면 ①에서 만든 토큰으로 세션 자체를 교환한다(useSessionSwitch).
export default function AdminPage() {
  const { accessToken, isPortalLinked, isReady } = useAuth();
  const hasSession = isReady && accessToken !== null;

  return (
    <div className={styles.page}>
      <TopNavigation.Preset title="테스트 어드민" />

      <main className={styles.content}>
        <EnvBanner hasSession={hasSession} isPortalLinked={isPortalLinked} />

        <CreateTestUserSection />
        <LectureEvaluationSection />
        <MajorSection hasSession={hasSession} />
        <TestCourseSection hasSession={hasSession} />
        <GraduationCoursesSection hasSession={hasSession} />
        <TestOptionsSection />
        <AdminLogPanel />
      </main>
    </div>
  );
}
