'use client';

import { useState } from 'react';
import { TopNavigation } from '@/components/ui/TopNavigation';
import { Button, Icon } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import { addInquiry } from '@/features/inquiry/mocks/inquiryStore';
import { useAutoResizeTextarea } from '@/features/inquiry/hooks/useAutoResizeTextarea';
import layoutStyles from '../layout.module.scss';
import styles from './page.module.scss';

export default function InquiryNewPage() {
  const router = useInternalRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { containerRef, textareaRef, bottomRef } = useAutoResizeTextarea(content);

  const isFilled = title.trim().length > 0 && content.trim().length > 0;

  const handleSubmit = () => {
    if (!isFilled) {
        return;
    }
    const created = addInquiry(title.trim(), content.trim());
    router.replace(ROUTES.INQUIRY.DETAIL, { params: [created.id] });
  };

  return (
    <div className={layoutStyles.container}>
      <TopNavigation.Preset title="새로운 글 작성하기" type="back" onNavigationClick={() => router.back()} />
      <div className="gap-16" />
      <div ref={containerRef} className={`${layoutStyles.content} ${styles.formContent}`}>
        <p className={styles.label}>문의내용</p>

        <div className={styles.titleInputWrapper}>
          <input
            className={styles.titleInput}
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="문의제목을 입력해주세요"
          />
          {title.length > 0 && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={() => setTitle('')}
              aria-label="입력 내용 삭제"
            >
              <Icon name="delete" size={24} />
            </button>
          )}
        </div>

        <textarea
          ref={textareaRef}
          className={styles.contentInput}
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder={'문의내용을 입력해주세요\nex, 학번 :\n학과 :\n문의내용 :'}
        />

        <div ref={bottomRef} className={styles.bottomSection}>
          <p className={styles.helperText}>답변에는 평균 1-2일이 소요됩니다.</p>
          <Button variant="primary" width="full" onClick={handleSubmit} disabled={!isFilled}>
            문의사항 등록하기
          </Button>
        </div>
      </div>
    </div>
  );
}