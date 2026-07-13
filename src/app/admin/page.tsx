import { notFound } from 'next/navigation';
import { getEnvironment } from '@/config/environment';

export const dynamic = 'force-dynamic';

/**
 * dev 전용 테스트 어드민 진입점.
 *
 * 게이트에 NODE_ENV 를 쓰지 않는 이유: 배포 빌드는 staging 이든 production 이든 NODE_ENV 가 항상
 * 'production' 이라 dev.cchaksa.com(=staging) 에서도 페이지가 막혀버린다. 배포 환경 이름을 읽는
 * getEnvironment() 로 판정해야 staging 에서만 열린다 (NEXT_PUBLIC_DEPLOY_ENV, deploy-cloudflare.yml).
 *
 * 이 가드는 편의 장치일 뿐이고 실제 보안은 백엔드가 담당한다 — /api/admin/** 자체가 dev 백엔드에만
 * 존재하므로, 프로덕션에서 이 페이지가 열려도 호출할 API 가 없다.
 *
 * 본문을 dynamic import 하는 이유: 프로덕션 번들에 어드민 클라이언트 코드가 실려 나가지 않게 한다
 * (lecture-evaluation-preview 와 동일 패턴).
 */
export default async function AdminRoutePage() {
  if (getEnvironment() === 'production') {
    notFound();
  }

  const { default: AdminPage } = await import('./AdminPage');

  return <AdminPage />;
}
