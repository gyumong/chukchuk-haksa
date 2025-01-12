import styles from './FunnelHeadline.module.scss';

/**
 * @interface FunnelHeadlineProps
 * @property {string} title - 제목 텍스트 (<br/> 태그로 줄바꿈 가능)
 * @property {string} [description] - 설명 텍스트 (<br/> 태그로 줄바꿈 가능)
 */

interface FunnelHeadlineProps {
  description?: string;
  title: string;
}

    const splitTextWithLineBreaks = (text: string) => {
  const lines = text.split('<br/>');
  return lines.map((line, index) => ({
    id: `${text}-line-${index}`,
    content: line,
    isLast: index === lines.length - 1,
  }));
    };

export default function FunnelHeadline({ description, title }: FunnelHeadlineProps) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        {splitTextWithLineBreaks(title).map(({ id, content, isLast }) => (
          <span key={id}>
            {content}
            {!isLast && <br />}
          </span>
        ))}
      </h1>
      {description && (
        <p className={styles.description}>
          {splitTextWithLineBreaks(description).map(({ id, content, isLast }) => (
            <span key={id}>
              {content}
              {!isLast && <br />}
            </span>
          ))}
        </p>
      )}
    </div>
  );
}
