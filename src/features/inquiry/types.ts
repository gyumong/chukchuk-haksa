export type InquiryStatus = 'pending' | 'answered';

export interface InquiryAnswer {
  authorName: string;
  answeredAt: string;
  content: string;
}

export interface Inquiry {
  id: string;
  title: string;
  content: string;
  status: InquiryStatus;
  createdAt: string;
  answer?: InquiryAnswer;
}