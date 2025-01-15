import type { Course, Credit, ProcessedSemesterGrade, ProcessedTotalGrade, Student } from '@/types/domain';
import type { CourseDTO, CreditDTO, GradeResponseDTO, SemesterGradeDTO, StudentDTO, TotalGradeDTO } from '@/types/dto';
import { parseRankString } from '../utils/parseRankString';

/** StudentDTO → Student 변환 */
function mapStudentDTOToDomain(dto: StudentDTO): Student {
  return {
    studentCode: dto.sno, // 학번을 그대로 사용
    name: dto.studNm, // 학생 이름
    departmentCode: dto.dpmjCd, // 학과 코드
    departmentName: dto.dpmjNm, // 학과 이름
    majorCode: dto.mjorCd, // 전공 코드
    majorName: dto.mjorNm, // 전공 이름
    secondaryMajorCode: dto.the2MjorCd, // 복수전공 코드
    secondaryMajorName: dto.the2MjorNm || '', // 복수전공 이름, 없으면 빈 문자열
    admissionYear: parseInt(dto.enscYear, 10), // 입학 연도
    semesterEnrolled: parseInt(dto.enscYear + dto.enscSmrCd, 10), // 예: 201710
    isTransferStudent: dto.enscDvcd === '2', // 입학 구분 코드가 2인 경우 편입생으로 판단
    isGraduated: dto.scrgStatNm === '졸업', // 재학 상태로 졸업 여부 확인
    status: dto.scrgStatNm, // 재학 상태
    gradeLevel: dto.studGrde, // 학년
    admissionType: dto.enscDvcd, // 입학 유형
    completedSemesters: dto.facSmrCnt, // 총 이수학기
  };
}

/** CreditDTO → Credit 변환 */
function mapCreditDTOToDomain(dto: CreditDTO): Credit {
  return {
    studentNumber: dto.sno,
    grade: dto.cretGrdCd,
    gpa: dto.gainGpa,
    courseName: dto.subjtNm,
    department: dto.estbDpmjNm,
    facultyDivisionName: dto.facDvnm,
    points: dto.gainPoint,
    courseCode: dto.subjtCd,
    totalScore: dto.totalPoint,
    areaCode: dto.cltTerrNm ? parseInt(dto.cltTerrNm.replace(/[^0-9]/g, '')) : undefined,
    originalAreaCode: dto.cltTerrCd,
    originalScore:dto.gainPont
  };
}

/** CourseDTO → Course 변환 */
function mapCourseDTOToDomain(dto: CourseDTO): Course {
  return {
    studentNumber: dto.sno,
    courseNumber: dto.diclNo,
    scheduleSummary: dto.timtSmryCn,
    departmentName: dto.estbDpmjNm,
    courseName: dto.subjtNm,
    retakeYearSemester: dto.refacYearSmr,
    isClosed: dto.closeYn,
    facultyDivisionCode: dto.facDvcd,
    points: dto.point,
    professorName: dto.ltrPrfsNm,
    subjectEstablishmentYearSemester: dto.subjtEstbYearSmr,
    subjectEstablishmentSemesterCode: dto.subjtEstbSmrCd,
    facultyDivisionName: dto.facDvnm,
    subjectCode: dto.subjtCd,
    subjectEstablishmentYear: dto.subjtEstbYear,
  };
}
/** SemesterGradeDTO → ProcessedSemesterGrade 변환 */
function mapSemesterGradeDTOToDomain(grades: SemesterGradeDTO[]): ProcessedSemesterGrade[] {
  return grades.map(grade => {
    const { rank, total } = parseRankString(grade.dpmjOrdp);

    return {
      year: parseInt(grade.cretGainYear, 10),
      semester: parseInt(grade.cretSmrCd, 10),
      attemptedCredits: grade.applPoint,
      earnedCredits: grade.gainPoint,
      semesterGpa: grade.gainAvmk,
      semesterPercentile: parseFloat(grade.gainTavgPont),
      classRank: rank,
      totalStudents: total,
    };
  });
}

/** TotalGradeDTO → ProcessedTotalGrade 변환 */
function mapTotalGradeDTOToDomain(dto: TotalGradeDTO): ProcessedTotalGrade {
  return {
    totalAttemptedCredits: parseInt(dto.applPoint, 10),
    totalEarnedCredits: parseInt(dto.gainPoint, 10),
    cumulativeGpa: parseFloat(dto.gainAvmk),
    percentile: parseFloat(dto.gainTavgPont),
  };
}

function mapGradeResponseDTOToDomain(data: GradeResponseDTO) {
  return {
    semesters: mapSemesterGradeDTOToDomain(data.listSmrCretSumTabYearSmr),
    total: mapTotalGradeDTOToDomain(data.selectSmrCretSumTabSjTotal),
  };
}

export {
  mapStudentDTOToDomain,
  mapCreditDTOToDomain,
  mapCourseDTOToDomain,
  mapSemesterGradeDTOToDomain,
  mapTotalGradeDTOToDomain,
  mapGradeResponseDTOToDomain,
};
