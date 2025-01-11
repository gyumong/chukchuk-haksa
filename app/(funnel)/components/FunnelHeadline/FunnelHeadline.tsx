import styles from './FunnelHeadline.module.scss';

interface FunnelHeadlineProps {
  description?: string;
  title: string;
}

export default function FunnelHeadline({ description, title }: FunnelHeadlineProps) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        {title.split('<br/>').map((line, index) => (
          <span key={index}>
            {line}
            {index !== title.split('<br/>').length - 1 && <br />}
          </span>
        ))}
      </h1>
      {description && (
        <p className={styles.description}>
          {description.split('<br/>').map((line, index) => (
            <span key={index}>
              {line}
              {index !== description.split('<br/>').length - 1 && <br />}
            </span>
          ))}
        </p>
      )}
    </div>
  );
}
