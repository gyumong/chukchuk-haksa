import { describe, expect, it, vi } from 'vitest';
import { resolveReportSubmission } from '../submissionKey';

const body = { title: '성적 오류', content: '학번 : 20260000' };

describe('resolveReportSubmission', () => {
  it('진행 중인 제출이 없으면 새 키를 한 번 발급한다', () => {
    const generateKey = vi.fn(() => 'key-1');

    expect(resolveReportSubmission(null, body, generateKey)).toEqual({ ...body, idempotencyKey: 'key-1' });
    expect(generateKey).toHaveBeenCalledTimes(1);
  });

  it('같은 본문으로 다시 제출하면 최초 키와 본문을 그대로 쓴다', () => {
    const pending = { ...body, idempotencyKey: 'key-1' };
    const generateKey = vi.fn(() => 'key-2');

    expect(resolveReportSubmission(pending, { ...body }, generateKey)).toBe(pending);
    expect(generateKey).not.toHaveBeenCalled();
  });

  it.each([
    ['제목', { ...body, title: '성적 오류 문의' }],
    ['본문', { ...body, content: '학번 : 20261111' }],
  ])('%s 이 바뀌면 새 제출로 보고 새 키를 발급한다', (_, nextBody) => {
    const pending = { ...body, idempotencyKey: 'key-1' };

    expect(resolveReportSubmission(pending, nextBody, () => 'key-2')).toEqual({ ...nextBody, idempotencyKey: 'key-2' });
  });
});
