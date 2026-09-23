'use client';

import { useState } from 'react';
import { TopNavigation } from '@/components/ui/TopNavigation';
import { Button, ErrorModal, Icon } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import { useCreateReportMutation } from '@/features/inquiry/apis/queries/useCreateReportMutation';
import { useAutoResizeTextarea } from '@/features/inquiry/hooks/useAutoResizeTextarea';
import { useMutationErrorHandler } from '@/shared/hooks/useMutationErrorHandler';
import layoutStyles from '../layout.module.scss';
import styles from './page.module.scss';

export default function InquiryNewPage() {
  const router = useInternalRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { containerRef, textareaRef, bottomRef } = useAutoResizeTextarea(content);
  const mutation = useCreateReportMutation();
  const { handleMutationError, modalState, closeModal, retry, goToInquiry } = useMutationErrorHandler();

  const isFilled = title.trim().length > 0 && content.trim().length > 0;

  const handleSubmit = async () => {
    if (!isFilled) {
      return;
    }
    try {
      const created = await mutation.mutateAsync({ title: title.trim(), content: content.trim() });
      router.replace(ROUTES.INQUIRY.DETAIL, { params: [created.id ?? ''] });
    } catch (error) {
      handleMutationError(error, handleSubmit);
    }
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
          <Button
            variant="primary"
            width="full"
            onClick={handleSubmit}
            disabled={!isFilled || mutation.isPending}
            isLoading={mutation.isPending}
          >
            문의사항 등록하기
          </Button>
        </div>
      </div>

      <ErrorModal
        isOpen={modalState.isOpen}
        message={modalState.message}
        code={modalState.code}
        onRetry={modalState.showRetry ? retry : undefined}
        onInquiry={() => {
          closeModal();
          goToInquiry();
        }}
        onClose={closeModal}
      />
    </div>
  );
}