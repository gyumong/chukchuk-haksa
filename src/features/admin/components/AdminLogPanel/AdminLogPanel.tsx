import { Button, showToast } from '@/components/ui';
import { clearAdminLog, useAdminLog } from '../../apis/logStore';
import { SectionCard } from '../SectionCard/SectionCard';
import styles from './AdminLogPanel.module.scss';

// payload 는 unknown(성공 data 또는 에러 상세) 이라 직렬화가 항상 성공한다고 보장할 수 없다.
// 로그 패널이 터지면 문의 대응 자체가 막히므로 실패해도 렌더는 유지한다.
const formatPayload = (payload: unknown): string => {
  if (payload === undefined) {
    return 'undefined';
  }
  try {
    return JSON.stringify(payload, null, 2);
  } catch {
    return '(직렬화할 수 없는 응답)';
  }
};

// ④ 응답 로그 — 이 페이지에서 보낸 모든 어드민 요청의 감사 로그(최근 20건).
export function AdminLogPanel() {
  const entries = useAdminLog();
  const isEmpty = entries.length === 0;

  const handleCopyAll = () => {
    // 클립보드 API 는 비보안 컨텍스트/구형 브라우저에서 없을 수 있다. 던지지 않고 안내만 한다.
    const clipboard: Clipboard | undefined = navigator.clipboard;
    if (clipboard === undefined) {
      showToast('이 브라우저에서는 클립보드 복사를 지원하지 않습니다.');
      return;
    }

    let text: string;
    try {
      text = JSON.stringify(entries, null, 2);
    } catch {
      showToast('로그를 직렬화할 수 없어 복사하지 못했습니다.');
      return;
    }

    clipboard
      .writeText(text)
      .then(() => {
        showToast(`응답 로그 ${entries.length}건을 복사했습니다.`);
      })
      .catch(() => {
        showToast('클립보드 복사에 실패했습니다.');
      });
  };

  return (
    <SectionCard
      title="④ 응답 로그"
      description="이 페이지에서 보낸 모든 어드민 요청의 성공/실패와 응답 본문(최근 20건). 문의 대응 시 그대로 복사해 백엔드에 전달할 수 있다."
    >
      <div className={styles.toolbar}>
        <span className={styles.count}>{entries.length}건</span>
        <div className={styles.actions}>
          <Button type="button" size="sm" variant="secondary" onClick={handleCopyAll} disabled={isEmpty}>
            전체 복사
          </Button>
          <Button type="button" size="sm" variant="secondary" onClick={clearAdminLog} disabled={isEmpty}>
            비우기
          </Button>
        </div>
      </div>

      {isEmpty ? (
        <p className={styles.empty}>아직 요청이 없습니다.</p>
      ) : (
        <ul className={styles.list}>
          {entries.map(entry => (
            <li key={entry.id} className={styles.item}>
              <details className={styles.details}>
                <summary className={styles.summary}>
                  <span className={styles.time}>{entry.time}</span>
                  <span className={styles.method}>{entry.method}</span>
                  <span className={styles.path}>{entry.path}</span>
                  <span className={`${styles.badge} ${entry.ok ? styles.badgeSuccess : styles.badgeError}`}>
                    {entry.ok ? '성공' : '실패'}
                  </span>
                  <span className={styles.message}>{entry.message}</span>
                </summary>
                <pre className={styles.payload}>{formatPayload(entry.payload)}</pre>
              </details>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}
