'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { TopNavigation } from '@/components/ui/TopNavigation';
import { Button } from '@/components/ui';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import { answerInquiry, getInquiryById, deleteInquiryAnswer } from '@/features/inquiry/mocks/inquiryStore';
import { useAutoResizeTextarea } from '@/features/inquiry/hooks/useAutoResizeTextarea';
import { InquiryStatusBadge } from '@/features/inquiry/components/InquiryStatusBadge/InquiryStatusBadge';
import layoutStyles from '../layout.module.scss';
import styles from './page.module.scss';
import Image from 'next/image';

export default function AdminInquiryDetailPage() {
  const router = useInternalRouter();
  const params = useParams<{ id: string }>();
  const [inquiry, setInquiry] = useState(() => getInquiryById(params.id));
  const [isEditing, setIsEditing] = useState(false);
  const [answerContent, setAnswerContent] = useState(inquiry?.answer?.content ?? '');
const { containerRef, textareaRef, bottomRef } = useAutoResizeTextarea(`${isEditing}:${answerContent}`);
  if (!inquiry) {
    return (
      <div className={layoutStyles.container}>
        <TopNavigation.Preset title="문의 상세" type="back" onNavigationClick={() => router.back()} />
        <div className="gap-16" />
        <div className={layoutStyles.content}>
          <p className={styles.notFound}>문의 내역을 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  const handleStartEditing = () => {
    setAnswerContent(inquiry.answer?.content ?? '');
    setIsEditing(true);
  };

  const handleSubmit = () => {
    if (!answerContent.trim()) {
      return;
    }
    setInquiry(answerInquiry(inquiry.id, answerContent.trim()) ?? inquiry);
    setIsEditing(false);
  };

  const handleDelete = () => {
  if (!inquiry.answer) {
    return;
  }
  if (!window.confirm('등록된 답변을 삭제할까요? 문의가 답변 대기 상태로 되돌아갑니다.')) {
    return;
  }
  setInquiry(deleteInquiryAnswer(inquiry.id) ?? inquiry);
  setAnswerContent('');
};

  return (
    <div className={layoutStyles.container}>
      <TopNavigation.Preset title="문의 상세" type="back" onNavigationClick={() => router.back()} />
      <div className="gap-16" />
      <div ref={containerRef} className={`${layoutStyles.content} ${styles.formContent}`}>
        <InquiryStatusBadge status={inquiry.status} />
        <h1 className={styles.title}>{inquiry.title}</h1>
        <p className={styles.meta}>
          {inquiry.studentName} · {inquiry.studentCode}
        </p>
        <p className={styles.date}>{inquiry.createdAt}</p>
        <p className={styles.content}>{inquiry.content}</p>

        {isEditing ? (
          <>
            <p className={styles.label}>답변</p>
            <textarea
              ref={textareaRef}
              className={styles.answerInput}
              value={answerContent}
              onChange={e => setAnswerContent(e.target.value)}
              placeholder="답변을 입력해주세요"
            />
            <div ref={bottomRef} className={styles.bottomSection}>
              <Button variant="primary" width="full" onClick={handleSubmit} disabled={!answerContent.trim()}>
                답변 등록하기
              </Button>
            </div>
          </>
        ) : (
          <>
            {inquiry.answer && (
                <div className={styles.answerCard}>
                    <div className={styles.answerHeader}>
                    <div className={styles.answerAuthorRow}>
                        <Image
                        src="/images/illustrations/DefaultProfile.png"
                        alt=""
                        width={40}
                        height={40}
                        className={styles.answerAvatar}
                        />
                        <div className={styles.answerAuthorInfo}>
                        <span className={styles.answerAuthor}>{inquiry.answer.authorName}</span>
                        <span className={styles.answerDate}>{inquiry.answer.answeredAt}</span>
                        </div>
                    </div>
                    <button type="button" className={styles.deleteText} onClick={handleDelete}>
                        삭제
                    </button>
                    </div>
                    <p className={styles.answerContent}>{inquiry.answer.content}</p>
                </div>
                )}
            <div className={styles.bottomSectionStatic}>
                <Button variant="secondary" width="full" onClick={handleStartEditing}>
                    {inquiry.answer ? '답변 수정하기' : '답변 작성하기'}
                </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}