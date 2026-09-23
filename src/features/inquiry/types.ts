export type InquiryStatus = 'pending' | 'answered';

export interface InquiryAnswer {
  authorName: string;
  answeredAt: string;
  content: string;
}

// 어드민 목업 전용 (studentCode/studentName 등 실제 API엔 없는 필드 포함)
export interface Inquiry {
  id: string;
  title: string;
  content: string;
  status: InquiryStatus;
  createdAt: string;
  studentCode: string;
  studentName: string;
  answer?: InquiryAnswer;
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