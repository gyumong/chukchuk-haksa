import type { Inquiry } from '../types';

// API 연동 전까지 화면 확인용 임시 저장소. 새로고침하면 초기화됨 (별도 이슈에서 실제 API로 대체).
// 사용자 화면과 어드민 화면이 같은 데이터를 보도록 이 스토어 하나를 공유한다.
let inquiries: Inquiry[] = [
  {
    id: '4',
    title: '학사 아이디 비밀번호를 제대로 입력했는데 오류 화면이 발생합니다.',
    content:
      '내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용',
    status: 'answered',
    createdAt: '2026/09/10 16:17:32',
    studentCode: '20201234',
    studentName: '테스트 학생',
    answer: {
      authorName: '척척학사 관리자',
      answeredAt: '2026/09/11 10:34:12',
      content:
        '안녕하세요 척척학사 관리자입니다.\n남겨주신 문의사항을 확인했습니다. 빠른 시일내에 해결하도록 하겠습니다. 안녕하세요 척척학사 관리자입니다.\n남겨주신 문의사항을 확인했습니다. 빠른 시일내에 해결하도록 하겠습니다.\n\n팀 척척학사 드림',
    },
  },
  {
    id: '3',
    title: '학사 아이디 비밀번호를 제대로 입력했는데 오류 화면이 발생합니다.학사 아이디 비밀번호를 제대로 입력했는데 오류 화면이 발생합니다.학사 아이디 비밀번호를 제대로 입력했는데 오류 화면이 발생합니다.',
    content: '내용내용내용내용내용내용내용내용',
    status: 'pending',
    createdAt: '2026/09/10 16:17:32',
    studentCode: '20201234',
    studentName: '테스트 학생',
  },
  {
    id: '2',
    title: '졸업 요건 확인이 불가합니다.',
    content: '내용내용내용내용내용내용내용내용',
    status: 'answered',
    createdAt: '2026/09/10 16:17:32',
    studentCode: '20201234',
    studentName: '테스트 학생',
    answer: {
      authorName: '척척학사 관리자',
      answeredAt: '2026/09/11 10:34:12',
      content: '안녕하세요 척척학사 관리자입니다. 확인 후 답변드리겠습니다.',
    },
  },
  {
    id: '1',
    title: '졸업 요건 확인이 불가합니다.',
    content: '내용내용내용내용내용내용내용내용',
    status: 'pending',
    createdAt: '2026/09/10 16:17:32',
    studentCode: '20201234',
    studentName: '테스트 학생',
  },
];

export function getInquiries(): Inquiry[] {
  return inquiries;
}

export function getInquiryById(id: string): Inquiry | undefined {
  return inquiries.find(item => item.id === id);
}

export function addInquiry(params: {
  title: string;
  content: string;
  id?: string;
  createdAt?: string;
  studentCode?: string;
  studentName?: string;
}): Inquiry {
  const newInquiry: Inquiry = {
    id: params.id ?? String(Date.now()),
    title: params.title,
    content: params.content,
    status: 'pending',
    createdAt: params.createdAt ?? new Date().toLocaleString('ko-KR'),
    studentCode: params.studentCode ?? '20201234',
    studentName: params.studentName ?? '테스트 학생',
  };
  inquiries = [newInquiry, ...inquiries];
  return newInquiry;
}

export function answerInquiry(id: string, content: string): Inquiry | undefined {
  inquiries = inquiries.map(item =>
    item.id === id
      ? {
          ...item,
          status: 'answered' as const,
          answer: {
            authorName: '척척학사 관리자',
            answeredAt: new Date().toLocaleString('ko-KR'),
            content,
          },
        }
      : item
  );
  return getInquiryById(id);
}

export function deleteInquiryAnswer(id: string): Inquiry | undefined {
  inquiries = inquiries.map(item =>
    item.id === id
      ? {
          ...item,
          status: 'pending' as const,
          answer: undefined,
        }
      : item
  );
  return getInquiryById(id);
}