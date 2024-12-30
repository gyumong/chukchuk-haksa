
// Credit DTO: 크롤링된 성적 데이터 타입
 interface CreditDTO {
    sno: string; // 학번
    cretGrdCd: string; // 학점 등급
    gainGpa: number; // 학점 평균
    subjtNm: string; // 과목명
    estbDpmjNm: string; // 개설 학과명
    facDvnm: string; // 교수 이름
    gainPoint: number; // 취득 학점
    subjtCd: string; // 과목 코드
    cretSmrNm: string; // 학기
    gainPont: number; // 총점
    cretGainYear: string; // 학년 (추가)
    cretSmrCd: string; // 학기 코드 (추가)
    
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
    facDvcd: string; // 학부 코드
    point: number; // 학점
    ltrPrfsNm: string; // 담당 교수 이름
    subjtEstbYearSmr: string; // 과목 개설 학기
    subjtEstbSmrCd: string; // 학기 코드
    facDvnm: string; // 학부 이름
    subjtCd: string; // 과목 코드
    subjtEstbYear: number; // 과목 개설 연도
  }

  export type {
    CreditDTO,
    CourseDTO,
  };
