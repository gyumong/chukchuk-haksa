import { Button } from '@/components/ui';
import { useTestOptionsQuery } from '../../apis/queries/useAdminQueries';
import { SectionCard } from '../SectionCard/SectionCard';
import styles from './TestOptionsSection.module.scss';

// 학과·영역 선택지 조회. DepartmentPicker 가 검색으로 학과를 찾으므로 조작에 꼭 필요하진 않지만,
// "백엔드가 알고 있는 선택지"를 눈으로 확인하는 창구다 — 문의 대응 중 학과 id 를 바로 집어올 때 쓴다.
export function TestOptionsSection() {
  const { data, isFetching, error, refetch } = useTestOptionsQuery();

  const departments = data?.departments ?? [];
  const areas = data?.graduationAreas ?? [];

  return (
    <SectionCard
      title="⑤ 테스트 조작 옵션"
      endpoint="GET /api/admin/test-options"
      description="백엔드가 인정하는 학과·졸업요건 영역 선택지. 학과 id 를 직접 확인할 때 사용한다."
    >
      <div className={styles.actions}>
        <Button variant="secondary" size="sm" onClick={() => refetch()} isLoading={isFetching}>
          다시 조회
        </Button>
      </div>

      {error && <p className={styles.error}>조회 실패: {error instanceof Error ? error.message : '알 수 없는 오류'}</p>}

      {!error && (
        <>
          <p className={styles.summary}>
            학과 {departments.length}건 · 졸업요건 영역 {areas.length}건
          </p>

          {areas.length > 0 && (
            <ul className={styles.areaList}>
              {areas.map(area => (
                <li key={area.code} className={styles.areaItem}>
                  {area.name ?? area.code} <span className={styles.meta}>({area.code})</span>
                </li>
              ))}
            </ul>
          )}

          {departments.length > 0 && (
            <details className={styles.details}>
              <summary className={styles.summaryToggle}>학과 목록 펼치기</summary>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>id</th>
                      <th>코드</th>
                      <th>학과명</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departments.map(department => (
                      <tr key={department.id}>
                        <td>{department.id}</td>
                        <td>{department.code}</td>
                        <td>{department.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          )}
        </>
      )}
    </SectionCard>
  );
}
