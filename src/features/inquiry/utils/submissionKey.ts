export interface ReportSubmissionBody {
  title: string;
  content: string;
}

export interface ReportSubmission extends ReportSubmissionBody {
  idempotencyKey: string;
}

/**
 * 문의 등록 요청에 실을 제출 정보를 정한다.
 *
 * 직전 제출이 끝나지 않았고(성공 전) 본문이 같으면 같은 제출의 재시도로 보고 최초 키를 그대로 쓴다.
 * 연속 탭·응답 유실·네트워크 오류 뒤 재시도가 여기에 해당하며, 서버는 같은 문의 ID 를 201 로 돌려준다.
 * 본문이 달라졌으면 새 제출이므로 새 키를 발급한다. 같은 키로 다른 본문을 보내면 409 C07 이 되기 때문이다.
 */
export function resolveReportSubmission(
  pending: ReportSubmission | null,
  body: ReportSubmissionBody,
  generateKey: () => string
): ReportSubmission {
  if (pending && pending.title === body.title && pending.content === body.content) {
    return pending;
  }

  return { ...body, idempotencyKey: generateKey() };
}
