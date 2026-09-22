'use client';

import { useCallback, useState } from 'react';
import { captureException } from '@sentry/nextjs';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import { ApiError } from '@/shared/api/errors';
import { showToast } from '@/components/ui/Toast';
import { getErrorTreatment } from '@/shared/error-severity';

interface ModalState {
  isOpen: boolean;
  message: string;
  code?: string;
  showRetry: boolean;
  retryAction?: () => void;
}

const INITIAL_MODAL_STATE: ModalState = {
  isOpen: false,
  message: '',
  code: undefined,
  showRetry: false,
  retryAction: undefined,
};

export function useMutationErrorHandler() {
  const { notifySessionExpired } = useAuth();
  const router = useInternalRouter();
  const [modalState, setModalState] = useState<ModalState>(INITIAL_MODAL_STATE);

  const handleMutationError = useCallback(
    (error: unknown, retryAction?: () => void) => {
        console.error(error);
        
      if (!(error instanceof ApiError)) {
        // 분류 안 된(=ApiError가 아닌) 에러는 그 자체로 예상 못 한 상황이라 항상 관측 대상.
        captureException(error);
        showToast('요청 처리 중 오류가 발생했어요. 다시 시도해주세요.');
        return;
      }

      const treatment = getErrorTreatment(error.appCode, 'mutation');

      if (treatment?.sentry) {
        captureException(error);
      }

      const isGlobalAuthError = error.status === 401 || treatment?.severity === 'global';

      if (isGlobalAuthError) {
        notifySessionExpired();
        return;
      }

      if (treatment?.severity === 'modal') {
        setModalState({
          isOpen: true,
          message: error.userMessage,
          code: error.appCode || undefined,
          showRetry: treatment.action === 'both',
          retryAction,
        });
        return;
      }

      // toast: 명시적으로 toast 매핑된 경우 + 매핑 안 된(undefined) 기본값 둘 다 여기로 온다.
      showToast(error.userMessage);
    },
    [notifySessionExpired]
  );

  const closeModal = useCallback(() => setModalState(INITIAL_MODAL_STATE), []);

  const retry = useCallback(() => {
    const action = modalState.retryAction;
    closeModal();
    action?.();
  }, [modalState.retryAction, closeModal]);

  return {
    handleMutationError,
    modalState,
    closeModal,
    retry,
    goToInquiry: () => router.push(ROUTES.INQUIRY.NEW),
  };
}