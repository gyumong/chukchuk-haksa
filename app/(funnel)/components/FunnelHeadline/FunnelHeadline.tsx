import { useMemo } from 'react';
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

const useSplitTextWithLineBreaks = (text: string) =>
  useMemo(() => {
    const lines = text.split('<br/>');
    return lines.map((line, index) => ({
      id: `${text}-line-${index}`,
      content: line,
      isLast: index === lines.length - 1,
    }));
  }, [text]);

const TextWithLineBreaks = ({ text, className }: { text: string; className?: string }) => {
  const lines = useSplitTextWithLineBreaks(text);
  return (
    <span className={className}>
      {lines.map(({ id, content, isLast }) => (
        <span key={id}>
          {content}
          {!isLast && <br />}
        </span>
      ))}
    </span>
  );
};

export default function FunnelHeadline({ description, title }: FunnelHeadlineProps) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <TextWithLineBreaks text={title} />
      </h1>
      {description && (
        <p className={styles.description}>
          <TextWithLineBreaks text={description} />
        </p>
      )}
    </div>
  );
}
