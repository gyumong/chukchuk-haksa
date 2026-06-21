'use client';

import { FixedButton } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import { useLanguageCertRequirementQuery } from '@/features/academic/apis/queries/useLanguageCertRequirementQuery';
import {
  getRequirementValue,
  getTestLabel,
  sortRequirements,
} from '@/features/academic/utils/languageCertDisplay';
import { EVENTS, track } from '@/lib/analytics';
import { isInWebView, postBridgeMessage } from '@/lib/webview';
import AsyncBoundary from '@/shared/components/AsyncBoundary';
import { FunnelHeadline } from '../components';
import styles from './page.module.scss';

// target-score 에서 이전해 온 webview 완료 신호. 첫 가입(funnel) 흐름의 '마지막' 단계인 이 화면에서
// 송출한다. MPA(재연동) 흐름은 /mpa/portal-login/scraping 에서 자체 송출하므로 이 변경과 무관하다.
// 프로토콜: 네이티브는 이 신호를 받으면 webview 를 닫고 dashboard 를 갱신한다.
const BRIDGE_DONE_PORTAL_LINK = 'done:portal-link';

// 외국어 인증 기준(학과·입학년도별 시험 통과 기준)을 '확인 전용'으로 노출한다.
// 선택/제출 동작은 없으며, 불러온 시험 목록을 보여주기만 한다.
function ForeignLanguageCertInfo() {
  const { data: requirement } = useLanguageCertRequirementQuery();
  const { departmentName, admissionYear, note } = requirement;
  const requirements = sortRequirements(requirement.requirements);

  const yearLabel = admissionYear != null ? `${String(admissionYear).slice(-2)}학번` : '';
  const deptYear = [departmentName, yearLabel].filter(Boolean).join(' ');
  const title = deptYear
    ? `${deptYear}의<br/>외국어인증제도 필요 점수에요`
    : `외국어인증제도<br/>필요 점수에요`;

  return (
    <>
      <FunnelHeadline
        title={title}
        description="외국어인증제도 요건을 확인해주세요."
        highlightText={deptYear || '외국어인증제도'}
      />

      {requirements.length > 0 ? (
        <ul className={styles.list}>
          {requirements.map((req, index) => (
            <li key={`${req.testType ?? 'req'}-${index}`} className={styles.card}>
              {departmentName && <span className={styles.caption}>{departmentName}</span>}
              <div className={styles.row}>
                <span className={styles.examName}>{getTestLabel(req.testType)}</span>
                <span className={styles.examValue}>{getRequirementValue(req)}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.note}>{note ?? '학과별 외국어 인증 기준 정보를 준비 중입니다.'}</p>
      )}
    </>
  );
}

// 마지막 온보딩 단계에서는 기준 조회 실패가 재시도/로그아웃 CTA(ApiErrorFallback·DefaultErrorFallback)로
// 노출되어 '다음'과 충돌하지 않도록, 조용한 안내만 보여준다. 실제 진행은 경계 밖의 '다음' 버튼이 담당.
function RequirementErrorNote() {
  return (
    <p className={styles.note}>
      외국어인증제도 기준을 불러오지 못했어요.
      <br />
      아래 ‘다음’을 눌러 계속할 수 있어요.
    </p>
  );
}

export default function ForeignLanguageCertPage() {
  const router = useInternalRouter();

  const handleNext = () => {
    track(EVENTS.UNIV_FOREIGN_LANGUAGE_CERTIFICATION_BTN_TAP);
    if (isInWebView()) {
      const posted = postBridgeMessage(BRIDGE_DONE_PORTAL_LINK);
      if (!posted) {
        // 브리지 송출 실패(race/예외) 시 사용자가 webview 에 정지하지 않도록 기존 fallback 으로 이동.
        // Sentry 캡쳐는 bridge.ts 내부.
        router.push(`${ROUTES.MAIN}`);
      }
    } else {
      router.push(`${ROUTES.MAIN}`);
    }
  };

  return (
    <ProtectedRoute requirePortalLinked={true}>
      <div className={styles.container}>
        {/* 기준 조회 실패/로딩은 AsyncBoundary 가 처리하되, '다음' 버튼은 경계 밖에 두어
            조회가 실패해도 사용자가 온보딩을 끝낼 수 있게 한다. */}
        <div className={styles.content}>
          <AsyncBoundary customErrorFallback={RequirementErrorNote}>
            <ForeignLanguageCertInfo />
          </AsyncBoundary>
        </div>
        <FixedButton onClick={handleNext}>다음</FixedButton>
      </div>
    </ProtectedRoute>
  );
}
