import { useMemo } from 'react';
import styles from './FunnelHeadline.module.scss';

/**
 * @interface FunnelHeadlineProps
 * @property {string} title - 제목 텍스트 (<br/> 태그로 줄바꿈 가능)
 * @property {string} [description] - 설명 텍스트 (<br/> 태그로 줄바꿈 가능)
 * @property {string} [highlightText] - 강조할 텍스트
 */

interface FunnelHeadlineProps {
  description?: string;
  title: string;
  highlightText?: string;
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

const TextWithLineBreaks = ({
  text,
  className,
  highlightText,
}: {
  text: string;
  className?: string;
  highlightText?: string;
}) => {
  const lines = useSplitTextWithLineBreaks(text);
  return (
    <span className={className}>
      {lines.map(({ id, content, isLast }) => {
        if (highlightText && content.includes(highlightText)) {
          const parts = content.split(highlightText);
          return (
            <span key={id}>
              {parts[0]}
              <span className={styles.highlight}>{highlightText}</span>
              {parts[1]}
              {!isLast && <br />}
            </span>
          );
        }
        return (
          <span key={id}>
            {content}
            {!isLast && <br />}
          </span>
        );
      })}
    </span>
  );
};

export default function FunnelHeadline({ description, title, highlightText }: FunnelHeadlineProps) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <TextWithLineBreaks text={title} highlightText={highlightText} />
      </h1>
      {description && (
        <p className={styles.description}>
          <TextWithLineBreaks text={description} />
        </p>
      )}
    </div>
  );
}
