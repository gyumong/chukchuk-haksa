import type { Course, Credit, Student } from '@/types/domain';
import type { CourseDTO, CreditDTO, StudentDTO } from '@/types/dto';

/** StudentDTO → Student 변환 */
function mapStudentDTOToDomain(dto: StudentDTO): Student {
  return {
    studentId: dto.sno, // 학번을 그대로 사용
    portalUsername: dto.sno, // 학번을 포털 유저네임으로 사용
    name: dto.studNm, // 학생 이름
    departmentId: parseInt(dto.dpmjCd, 10), // 학과 ID
    departmentName: dto.dpmjNm, // 학과 이름
    majorId: parseInt(dto.mjorCd, 10), // 전공 ID
    majorName: dto.mjorNm, // 전공 이름
    secondaryMajorId: dto.the2MjorCd ? parseInt(dto.the2MjorCd, 10) : undefined, // 복수전공 ID (없으면 undefined)
    secondaryMajorName: dto.the2MjorNm || '', // 복수전공 이름, 없으면 빈 문자열
    admissionYear: parseInt(dto.enscYear, 10), // 입학 연도
    semesterEnrolled: parseInt(dto.enscYear + dto.enscSmrCd, 10), // 예: 201710
    isTransferStudent: dto.enscDvcd === '2', // 입학 구분 코드가 2인 경우 편입생으로 판단
    isGraduated: dto.scrgStatNm === '졸업', // 재학 상태로 졸업 여부 확인
    status: dto.scrgStatNm, // 재학 상태
    gradeLevel: dto.studGrde, // 학년
    admissionType: dto.enscDvcd, // 입학 유형
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
    totalScore: dto.gainPont,
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

export { mapStudentDTOToDomain, mapCreditDTOToDomain, mapCourseDTOToDomain };
