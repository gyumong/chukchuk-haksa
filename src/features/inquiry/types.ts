export type InquiryStatus = 'pending' | 'answered';

export interface InquiryAnswer {
  authorName: string;
  answeredAt: string;
  content: string;
}

// 사용자 화면 - 실제 /api/reports 응답 기준
export interface InquirySummary {
  id: string;
  title: string;
  status: InquiryStatus;
  createdAt: string;
}

export interface InquiryDetail {
  id: string;
  title: string;
  content: string;
  status: InquiryStatus;
  createdAt: string;
  answer?: InquiryAnswer;
}