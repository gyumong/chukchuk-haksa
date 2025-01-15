import type { StudentStatus } from './enums';

// Student DTO: 크롤링된 학생 데이터 타입
interface StudentDTO {
  sno: string; // 학번 (예: 17019013)
  studNm: string; // 학생 이름 (예: 김민규)
  univCd: string; // 대학 코드 (예: 2000510)
  univNm: string; // 대학 이름 (예: ICT융합대학)
  dpmjCd: string; // 학과 코드 (예: 2000513)
  dpmjNm: string; // 학과 이름 (예: 정보통신학부)
  mjorCd: string; // 전공 코드 (예: 2000516)
  mjorNm: string; // 전공 이름 (예: 정보통신)
  the2MjorCd?: string; // 복수전공 코드 (선택적)
  the2MjorNm?: string; // 복수전공 이름 (선택적)
  enscYear: string; // 입학 연도 (예: 2017)
  enscSmrCd: string; // 입학 학기 코드 (예: 10)
  scrgStatNm: StudentStatus; // 재학 상태 (예: 재학, 졸업)
  studGrde: number; // 학년 (예: 3)
  enscDvcd: string; // 입학 구분 코드 (예: 1: 신입학, 2: 편입학)
  facSmrCnt: number; // 총 이수학기
}

// Credit DTO: 크롤링된 성적 데이터 타입
interface CreditDTO {
  sno: string; // 학번
  cretGrdCd: string; // 학점 등급
  gainGpa: number; // 학점 평균
  subjtNm: string; // 과목명
  estbDpmjNm: string; // 개설 학과명
  facDvnm: string; // 교수 이름
  gainPoint: number; // 취득 학점
  gainPont:number; // 원 점수 ex) 93
  subjtCd: string; // 과목 코드
  cretSmrNm: string; // 학기
  totalPoint: number; // 총점
  cretGainYear: string; // 학년 (추가)
  cretSmrCd: string; // 학기 코드 (추가)
  cltTerrCd?: number; // 선택영역 코드
  cltTerrNm?: string; // 선택영역 이름
}

// Course DTO: 크롤링된 수강 데이터 타입
interface CourseDTO {
  sno: string; // 학번
  diclNo: string; // 수업 번호
  timtSmryCn: string; // 강의 시간 요약
  estbDpmjNm: string; // 개설 학과명
  subjtNm: string; // 과목명
  refacYearSmr: string; // 재수강 학기
  closeYn: boolean; // 수강 종료 여부
  facDvcd: number; // 학부 코드
  point: number; // 학점
  ltrPrfsNm: string; // 담당 교수 이름
  subjtEstbYearSmr: string; // 과목 개설 학기
  subjtEstbSmrCd: string; // 학기 코드
  facDvnm: string; // 학부 이름
  subjtCd: string; // 과목 코드
  subjtEstbYear: number; // 과목 개설 연도
}

// 수원대 포털에서 받아오는 원본 데이터 타입
interface SemesterGradeDTO {
  sno: string; // 학번
  cretGainYear: string; // 년도
  cretSmrCd: string; // 학기 코드 (10, 15, 20, 25)
  gainPoint: number; // 취득 학점
  applPoint: number; // 신청 학점
  gainAvmk: number; // 평점 평균 (GPA)
  gainTavgPont: string; // 백분위 점수
  dpmjOrdp: string; // 학과 석차 (예: "6/33")
}

// 전체 성적 요약 데이터 타입
interface TotalGradeDTO {
  gainPoint: string; // 총 취득학점
  applPoint: string; // 총 신청학점
  gainAvmk: string; // 전체 평점평균
  gainTavgPont: string; // 전체 백분위
}

// API 응답 타입
interface GradeResponseDTO {
  listSmrCretSumTabYearSmr: SemesterGradeDTO[];
  selectSmrCretSumTabSjTotal: TotalGradeDTO;
}

export type { StudentDTO, CreditDTO, CourseDTO, SemesterGradeDTO, TotalGradeDTO, GradeResponseDTO };
