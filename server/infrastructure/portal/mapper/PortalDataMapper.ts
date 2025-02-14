// server/infrastructure/portal/mapper/PortalDataMapper.ts
import type { CourseAreaType } from '@/server/domain/course-offering/models/CourseOffering';
import type { StudentStatusType } from '@/server/domain/student/models/AcademicInfo';
import type {
  PortalAcademicData,
  PortalCurriculumData,
  PortalData,
  PortalStudentInfo,
} from '@/server/infrastructure/portal/dto/PortalDataType';
import type {
  RawPortalData,
  RawPortalGradeResponseDTO,
  RawPortalSemesterDTO,
  RawPortalStudentDTO,
} from '../dto/PortalRowDataType';

export class PortalDataMapper {
  static toPortalData(raw: RawPortalData): PortalData {
    return {
      student: this.toPortalStudentInfo(raw.student),
      academic: this.toPortalAcademicInfo(raw.semesters, raw.academicRecords),
      curriculum: this.toPortalCurriculumInfo(raw.semesters),
    };
  }

  static toPortalStudentInfo(student: RawPortalStudentDTO): PortalStudentInfo {
    return {
      studentCode: student.sno,
      name: student.studNm,
      college: {
        code: student.univCd,
        name: student.univNm,
      },
      department: {
        code: student.dpmjCd,
        name: student.dpmjNm,
      },
      major: {
        code: student.mjorCd,
        name: student.mjorNm,
      },
      secondaryMajor: student.the2MjorCd
        ? {
            code: student.the2MjorCd,
            name: student.the2MjorNm!,
          }
        : undefined,
      status: student.scrgStatNm as StudentStatusType,
      admission: {
        year: parseInt(student.enscYear),
        semester: parseInt(student.enscSmrCd),
        type: student.enscDvcd,
      },
      academic: {
        gradeLevel: student.studGrde,
        completedSemesters: student.facSmrCnt,
        totalCredits: 0,
        gpa: 0,
      },
    };
  }

  static toPortalAcademicInfo(
    semesters: RawPortalSemesterDTO[],
    academicRecords: RawPortalGradeResponseDTO
  ): PortalAcademicData {
    const academicSummary = {
      totalCredits: parseInt(academicRecords.selectSmrCretSumTabSjTotal.gainPoint),
      appliedCredits: parseInt(academicRecords.selectSmrCretSumTabSjTotal.applPoint),
      gpa: parseFloat(academicRecords.selectSmrCretSumTabSjTotal.gainAvmk),
      score: parseFloat(academicRecords.selectSmrCretSumTabSjTotal.gainTavgPont),
    };

    return {
      semesters: semesters.map(semester => ({
        year: parseInt(semester.semester.split('-')[0]),
        semester: parseInt(semester.semester.split('-')[1]),
        courses: semester.courses.map(course => ({
          code: course.subjtCd,
          name: course.subjtNm,
          professor: course.ltrPrfsNm ?? '미확인 교수',
          department: course.estbDpmjNm,
          credits: course.point,
          grade: course.cretGrdCd,
          isRetake: course.refacYearSmr !== '-' ? true : false,
          schedule: course.timtSmryCn,
          areaType: course.facDvnm,
          areaCode: course.cltTerrNm ? String(parseInt(course.cltTerrNm)) : undefined,
          originalAreaCode: course.cltTerrCd ? String(parseInt(course.cltTerrCd)) : undefined,
          establishmentSemester: parseInt(course.subjtEstbSmrCd),
          originalScore: course.gainPont,
        })),
      })),
      grades: {
        semesters: academicRecords.listSmrCretSumTabYearSmr.map(grade => ({
          year: parseInt(grade.cretGainYear),
          semester: parseInt(grade.cretSmrCd),
          earnedCredits: grade.gainPoint,
          appliedCredits: grade.applPoint,
          semesterGpa: grade.gainAvmk,
          score: parseFloat(grade.gainTavgPont),
          ranking: grade.dpmjOrdp
            ? {
                rank: parseInt(grade.dpmjOrdp.split('/')[0]),
                total: parseInt(grade.dpmjOrdp.split('/')[1]),
              }
            : undefined,
        })),
        summary: academicSummary,
      },
      summary: academicSummary,
    };
  }

  static toPortalCurriculumInfo(semesters: RawPortalSemesterDTO[]): PortalCurriculumData {
    return {
      courses: semesters.flatMap(semester =>
        semester.courses.map(course => ({
          courseCode: course.subjtCd,
          courseName: course.subjtNm,
          points: course.point,
        }))
      ),
      professors: semesters.flatMap(semester =>
        semester.courses.map(course => ({
          professorName: course.ltrPrfsNm ?? '미확인 교수',
        }))
      ),
      offerings: semesters.flatMap(semester =>
        semester.courses.map(course => ({
          courseCode: course.subjtCd,
          year: parseInt(course.subjtEstbYearSmr),
          semester: parseInt(course.subjtEstbSmrCd),
          classSection: course.diclNo,
          professorName: course.ltrPrfsNm ?? '미확인 교수',
          scheduleSummary: course.timtSmryCn,
          points: course.point,
          hostDepartment: course.estbDpmjNm,
          facultyDivisionName: course.facDvnm as CourseAreaType,
          subjectEstablishmentSemester: course.subjtEstbSmrCd ? parseInt(course.subjtEstbSmrCd) : undefined,
          areaCode: course.cltTerrNm ? parseInt(course.cltTerrNm) : undefined,
          originalAreaCode: course.cltTerrCd ? parseInt(course.cltTerrCd) : undefined,
        }))
      ),
    };
  }
}
