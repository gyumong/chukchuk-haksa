import type { CreditDTO, CourseDTO } from '@/types/dto';
import type { Credit, Course } from '@/types/domain';

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

export  {
    mapCreditDTOToDomain,
    mapCourseDTOToDomain,
}