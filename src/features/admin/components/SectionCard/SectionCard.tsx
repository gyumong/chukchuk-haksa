import { useId } from 'react';
import type { ReactNode } from 'react';
import styles from './SectionCard.module.scss';

interface SectionCardProps {
  title: string;
  /** API 경로 등 부제. 어떤 엔드포인트를 때리는 섹션인지 항상 노출한다. */
  endpoint?: string;
  description?: ReactNode;
  /** 세션이 없어 조작할 수 없는 섹션은 흐리게 + 사유 표시. */
  disabledReason?: string;
  children: ReactNode;
}

export function SectionCard({ title, endpoint, description, disabledReason, children }: SectionCardProps) {
  // title 로 id 를 만들면 안 된다 — 제목에 공백이 있으면("② 강의평가 상태 세팅")
  // aria-labelledby 가 공백 구분 ID 목록으로 파싱돼 어떤 요소에도 매칭되지 않는다.
  const titleId = useId();

  return (
    <section className={styles.card} aria-labelledby={titleId}>
      <header className={styles.header}>
        <h2 id={titleId} className={styles.title}>
          {title}
        </h2>
        {endpoint && <code className={styles.endpoint}>{endpoint}</code>}
      </header>

      {description && <p className={styles.description}>{description}</p>}

      {disabledReason ? (
        <>
          <p className={styles.disabledReason}>{disabledReason}</p>
          <div className={styles.disabledBody} aria-disabled="true">
            {children}
          </div>
        </>
      ) : (
        children
      )}
    </section>
  );
}
