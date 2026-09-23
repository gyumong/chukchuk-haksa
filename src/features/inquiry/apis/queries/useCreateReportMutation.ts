import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardQueryKeys } from '@/features/dashboard/apis/queryKey';
import { addInquiry } from '../../mocks/inquiryStore';
import { inquiryQueryKeys } from '../queryKey';
import { createReport } from '../service';

interface CreateReportVariables {
  title: string;
  content: string;
}

export function useCreateReportMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: CreateReportVariables) => createReport(variables),
    onSuccess: (created, variables) => {
      queryClient.invalidateQueries({ queryKey: inquiryQueryKeys.list });

      // 어드민 페이지는 아직 mock 데이터라, 방금 등록된 문의도 어드민 목록에 보이도록 동일 문의를 mock 스토어에 함께 추가한다.
      // 백엔드에 어드민 조회 API가 생기면 이 블록은 제거한다.
      const profile = queryClient.getQueryData<{ studentCode: string; name: string }>(dashboardQueryKeys.profile);
      addInquiry({
        id: created.id,
        title: variables.title,
        content: variables.content,
        createdAt: created.createdAt ? new Date(created.createdAt).toLocaleString('ko-KR') : undefined,
        studentCode: profile?.studentCode,
        studentName: profile?.name,
      });
    },
  });
}