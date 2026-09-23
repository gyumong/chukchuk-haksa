import type { DetailResponse, ListItem } from '@/shared/api/data-contracts';
import type { InquiryDetail, InquirySummary, InquiryStatus } from '../types';

function toStatus(status?: 'PENDING' | 'ANSWERED'): InquiryStatus {
  return status === 'ANSWERED' ? 'answered' : 'pending';
}

function formatDateTime(iso?: string | null): string {
  if (!iso) {
    return '';
  }
  return new Date(iso).toLocaleString('ko-KR');
}

export function mapToInquirySummary(item: ListItem): InquirySummary {
  return {
    id: item.id ?? '',
    title: item.title ?? '',
    status: toStatus(item.status),
    createdAt: formatDateTime(item.createdAt),
  };
}

export function mapToInquiryDetail(detail: DetailResponse): InquiryDetail {
  return {
    id: detail.id ?? '',
    title: detail.title ?? '',
    content: detail.content ?? '',
    status: toStatus(detail.status),
    createdAt: formatDateTime(detail.createdAt),
    answer: detail.answer
      ? {
          authorName: '척척학사 관리자',
          answeredAt: formatDateTime(detail.answeredAt),
          content: detail.answer,
        }
      : undefined,
  };
}