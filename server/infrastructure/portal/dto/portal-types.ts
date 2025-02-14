// server/infrastructure/portal/dto/portal-types.ts
import { StudentStatusType } from '@/server/domain/student/models/AcademicInfo';

// 포털에서 가져오는 원시 데이터 타입들
export interface RawPortalStudentDTO {
  sno: string; // 학번
  studNm: string; // 학생 이름
  univCd: string; // 대학 코드
  univNm: string; // 대학 이름
  dpmjCd: string; // 학과 코드
  dpmjNm: string; // 학과 이름
  mjorCd: string; // 전공 코드
  mjorNm: string; // 전공 이름
  the2MjorCd?: string; // 복수전공 코드
  the2MjorNm?: string; // 복수전공 이름
  enscYear: string; // 입학 연도
  enscSmrCd: string; // 입학 학기 코드
  scrgStatNm: StudentStatusType; // 재학 상태
  studGrde: number; // 학년
  enscDvcd: string; // 입학 구분 코드
  facSmrCnt: number; // 총 이수학기
}

export interface RawPortalCourseDTO {
  sno: string; // 학번
  diclNo: string; // 수업 번호
  timtSmryCn: string; // 강의 시간 요약
  estbDpmjNm: string; // 개설 학과명
  subjtNm: string; // 과목명
  refacYearSmr: string; // 재수강 학기
  closeYn: string; // 수강 종료 여부
  facDvcd: string; // 학부 코드
  point: number; // 학점
  ltrPrfsNm: string; // 담당 교수 이름
  subjtEstbYearSmr: string; // 과목 개설 학기
  subjtEstbSmrCd: string; // 학기 코드
  facDvnm: string; // 학부 이름
  subjtCd: string; // 과목 코드
  subjtEstbYear: string; // 과목 개설 연도

  // CreditDTO 필드들
  cretGrdCd?: string; // 학점 등급
  gainGpa?: number; // 학점 평균
  gainPoint?: number; // 취득 학점
  gainPont?: number; // 원 점수
  cretSmrNm?: string; // 학기
  totalPoint?: number; // 총점
  cretGainYear?: string; // 학년
  cretSmrCd?: string; // 학기 코드
  orgClsCd?: string; // 원본 학기 코드
  cltTerrCd?: string; // 선택영역 코드
  cltTerrNm?: string; // 선택영역 이름
}

// 학기별 성적 원시 데이터
export interface RawPortalSemesterGradeDTO {
  sno: string; // 학번
  cretGainYear: string; // 년도
  cretSmrCd: string; // 학기 코드 (10, 15, 20, 25)
  gainPoint: number; // 취득 학점
  applPoint: number; // 신청 학점
  gainAvmk: number; // 평점 평균 (GPA)
  gainTavgPont: string; // 백분위 점수
  dpmjOrdp: string; // 학과 석차 (예: "6/33")
}

// 전체 성적 원시 데이터
export interface RawPortalTotalGradeDTO {
  gainPoint: string; // 총 취득학점
  applPoint: string; // 총 신청학점
  gainAvmk: string; // 전체 평점평균
  gainTavgPont: string; // 전체 백분위
}

// 성적 API 응답 원시 데이터
export interface RawPortalGradeResponseDTO {
  listSmrCretSumTabYearSmr: RawPortalSemesterGradeDTO[];
  selectSmrCretSumTabSjTotal: RawPortalTotalGradeDTO;
}

export interface RawPortalSemesterDTO {
  semester: string; // 예: "2024-20"
  courses: RawPortalCourseDTO[];
}

// 포털에서 가져오는 모든 원시 데이터를 포함하는 타입
export interface RawPortalData {
  student: RawPortalStudentDTO;
  semesters: RawPortalSemesterDTO[];
  academicRecords: RawPortalGradeResponseDTO;
}
