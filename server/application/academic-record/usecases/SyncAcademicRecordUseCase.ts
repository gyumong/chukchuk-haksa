// server/application/academic-record/usecases/SyncAcademicRecordUseCase.ts
import { CourseEnrollment } from '@/server/domain/academic-record/models/CourseEnrollment';
import type { GradeType } from '@/server/domain/academic-record/models/Grade';
import type { IAcademicRecordRepository } from '@/server/domain/academic-record/repositories/IAcademicRecordRepository';
import type { IStudentCourseRepository } from '@/server/domain/academic-record/repositories/IStudentCourseRepository';
import type { IAuthService } from '@/server/domain/auth/IAuthService';
import type { ICourseOfferingRepository } from '@/server/domain/course-offering/repositories/ICourseOfferingRepository';
import type { ICourseRepository } from '@/server/domain/course/repositories/ICourseRepository';
import type { IPortalRepository } from '@/server/domain/portal/repository/IPortalRepository';
import type { IProfessorRepository } from '@/server/domain/professor/repositories/IProfessorRepository';
import type {
  PortalAcademicData,
  PortalCourseInfo,
  PortalCurriculumData,
  PortalData,
  PortalOfferingCreationData,
} from '@/server/infrastructure/portal/dto/PortalDataType';
import { AcademicRecordMapperFromPortal } from '@/server/infrastructure/supabase/mappers/AcademicRecordMapperFromPortal';

/**
 * offerings와 academicData를 merge할 때 사용할 중간 구조
 * (year, semester, courseCode)를 Key로 묶어놓고,
 * academic이 없으면 undefined로 둠
 */
interface MergedOfferingAcademic {
  offering: PortalOfferingCreationData;
  academic?: PortalCourseInfo;
}

export interface SyncAcademicRecordResult {
  isSuccess: boolean;
  error?: string;
}

/**
 * SyncAcademicRecordUseCase
 * - (1) 포털에서 학업(성적, 수강) 데이터를 가져옴
 * - (2) academicData를 도메인모델(AcademicRecord)로 매핑 후 upsert
 * - (3) offerings와 academicData를 merge하여, 교수/과목/개설강좌/수강기록을 upsert
 */
export class SyncAcademicRecordUseCase {
  constructor(
    private readonly portalRepository: IPortalRepository,
    private readonly authService: IAuthService,
    private readonly academicRecordRepository: IAcademicRecordRepository,
    private readonly studentCourseRepository: IStudentCourseRepository,
    private readonly courseRepository: ICourseRepository,
    private readonly courseOfferingRepository: ICourseOfferingRepository,
    private readonly professorRepository: IProfessorRepository
  ) {}

  /**
   * 사용자가 직접 인증정보(username, password)를 입력하고 실행하는 경우
   */
  async execute(username: string, password: string): Promise<SyncAcademicRecordResult> {
    try {
      // 1) 포털에서 학업(성적, 수강) 데이터 fetch
      const portalData: PortalData = await this.portalRepository.fetchPortalData(username, password);

      // 2) 현재 인증된 사용자 정보
      const userId = await this.authService.getAuthenticatedUserId();

      // 3) academicData → 도메인 모델(AcademicRecord) 매핑 & 저장
      const academicRecord = AcademicRecordMapperFromPortal.fromPortalAcademicData(userId, portalData.academic);
      await this.academicRecordRepository.upsertAcademicRecord(academicRecord);

      // 4) offerings + academicData → 수강기록(CourseEnrollment) 생성 & 저장
      const enrollments = await this.processCurriculumData(portalData.curriculum, portalData.academic, userId);
      await this.studentCourseRepository.upsertEnrollments(enrollments);

      return { isSuccess: true };
    } catch (error) {
      return {
        isSuccess: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * 이미 PortalData를 갖고 있는 경우 (테스트용, etc.)
   */
  async executeWithPortalData(portalData: PortalData): Promise<SyncAcademicRecordResult> {
    try {
      const userId = await this.authService.getAuthenticatedUserId();

      // 1) academicData → 도메인 모델(AcademicRecord) 매핑 & 저장
      const academicRecord = AcademicRecordMapperFromPortal.fromPortalAcademicData(userId, portalData.academic);
      await this.academicRecordRepository.upsertAcademicRecord(academicRecord);

      // 2) offerings + academicData → 수강기록(CourseEnrollment) 생성 & 저장
      const enrollments = await this.processCurriculumData(portalData.curriculum, portalData.academic, userId);
      await this.studentCourseRepository.upsertEnrollments(enrollments);

      return { isSuccess: true };
    } catch (error) {
      return {
        isSuccess: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * offerings(교과)와 academic(학업 성적)을 합쳐서
   * 최종적으로 CourseEnrollment를 만드는 메서드
   */
  private async processCurriculumData(
    curriculumData: PortalCurriculumData,
    academicData: PortalAcademicData,
    userId: string
  ): Promise<CourseEnrollment[]> {
    // (1) offerings와 academicData를 (year, semester, courseCode) 기준으로 merge
    const mergedList = this.mergeOfferingsAndAcademic(curriculumData, academicData);
    console.log('mergedList', mergedList);

    // (2) 교수/과목을 미리 조회&생성해서 Map에 저장
    const professorMap = await this.buildProfessorMap(curriculumData);
    const courseMap = await this.buildCourseMap(curriculumData);

    // (3) mergedList를 순회하면서 개설강좌 getOrCreate, 수강기록(CourseEnrollment) 생성
    const enrollments: CourseEnrollment[] = [];

    for (const item of mergedList) {
      const { offering, academic } = item;

      // --- 과목 ID 구하기 ---
      const courseId = courseMap.get(offering.courseCode);
      if (!courseId) {
        throw new Error(`Course not found for code: ${offering.courseCode}`);
      }

      // --- 교수 ID 구하기 (없으면 에러 던질 지, '미확인 교수'로 대체할 지 결정) ---
      const professorId = professorMap.get(offering.professorName ?? 'Unknown Professor');
      if (!professorId) {
        throw new Error(`Professor not found for name: ${offering.professorName}`);
      }

      // --- 개설강좌 getOrCreate ---
      const courseOffering = await this.courseOfferingRepository.getOrCreateOffering({
        courseId,
        year: offering.year,
        semester: offering.semester,
        classSection: offering.classSection, // 필드로만 저장, key에 쓰진 않음
        professorId,
        departmentId: undefined, // 필요하면 확장
        scheduleSummary: offering.scheduleSummary,
        evaluationType: offering.evaluationType,
        isVideoLecture: offering.isVideoLecture ?? false,
        subjectEstablishmentSemester: offering.subjectEstablishmentSemester,
        facultyDivisionName: offering.facultyDivisionName,
        areaCode: offering.areaCode,
        originalAreaCode: offering.originalAreaCode,
        points: offering.points,
        hostDepartment: offering.hostDepartment,
      });

      // --- academic 정보로부터 성적/재수강/원점수 파생 ---
      const grade: GradeType = (academic?.grade ?? 'IP') as GradeType;
      const points = academic ? academic.credits : offering.points || 0;
      const isRetake = academic?.isRetake ?? false;
      const originalScore = academic?.originalScore;

      // --- 도메인 객체(CourseEnrollment) 생성 ---
      const enrollment = CourseEnrollment.create({
        studentId: userId,
        offeringId: courseOffering.getId().getValue(),
        originalScore: originalScore,
        grade: grade,
        points: Number(points),
        isRetake,
      });

      enrollments.push(enrollment);
    }

    return enrollments;
  }

  /**
   * (year, semester, courseCode)를 key로 해서
   * curriculumData.offerings와 academicData.semesters 정보를 합칩니다.
   * - offerings에는 있으나 academic에는 없는 항목 → academic = undefined
   * - academic에는 있으나 offerings에는 없는 항목 → 새로 추가 (grade, etc.만 있고 offering엔 기본값)
   */
  private mergeOfferingsAndAcademic(
    curriculumData: PortalCurriculumData,
    academicData: PortalAcademicData
  ): MergedOfferingAcademic[] {
    const map = new Map<string, MergedOfferingAcademic>();
    console.log('curriculumData', curriculumData);
    console.log('academicData', academicData);

    // 1) offerings를 먼저 삽입
    for (const offering of curriculumData.offerings) {
      const key = this.makeKey(offering.year, offering.semester, offering.courseCode);
      map.set(key, { offering, academic: undefined });
    }

    // 2) academicData를 순회하여, (year, semester, code)로 매핑
    for (const semesterInfo of academicData.semesters) {
      const { year, semester } = semesterInfo;

      for (const courseInfo of semesterInfo.courses) {
        const code = courseInfo.code; // PortalCourseInfo.code
        const key = this.makeKey(year, semester, code);

        if (map.has(key)) {
          // 이미 offerings에 존재하므로 academic만 매핑
          const existing = map.get(key)!;
          existing.academic = courseInfo;
        } else {
          // offerings엔 없지만 academic만 있는 과목 → "누락 없이 다 저장"하려면 추가
          map.set(key, {
            offering: {
              courseCode: code,
              year,
              semester,
              // 교수명, 학점 등 기본값 or academicData에서 추론
              professorName: courseInfo.professor,
              scheduleSummary: courseInfo.schedule,
              points: courseInfo.credits,
              subjectEstablishmentSemester: courseInfo.establishmentSemester,
              // 만약 evaluationType, areaCode 등을 따로 가지려면 채워줄 수 있음
            },
            academic: courseInfo,
          });
        }
      }
    }

    // 최종적으로 map의 value들을 배열로 리턴
    return Array.from(map.values());
  }

  /**
   * 교수명 -> 교수ID 맵핑을 미리 만들어둠
   */
  private async buildProfessorMap(curriculumData: PortalCurriculumData): Promise<Map<string, number>> {
    const professorMap = new Map<string, number>();
    for (const prof of curriculumData.professors) {
      const name = prof.professorName ?? '미확인 교수';
      const professorEntity = await this.professorRepository.getOrCreate(name);
      const idValue = professorEntity.getId().getValue() as number;
      professorMap.set(name, idValue);
    }
    return professorMap;
  }

  /**
   * 과목코드 -> 과목ID 맵핑을 미리 만들어둠
   */
  private async buildCourseMap(curriculumData: PortalCurriculumData): Promise<Map<string, number>> {
    const courseMap = new Map<string, number>();
    for (const courseData of curriculumData.courses) {
      const courseEntity = await this.courseRepository.getOrCreateCourse({
        courseCode: courseData.courseCode,
        courseName: courseData.courseName,
        points: courseData.points,
      });
      const courseIdValue = courseEntity.getId().getValue() as number;
      courseMap.set(courseData.courseCode, courseIdValue);
    }
    return courseMap;
  }

  /**
   * offerings & academicData를 매핑할 때 쓰는 key 생성 함수
   * (classSection은 제외, year, semester, courseCode만 사용)
   */
  private makeKey(year: number, semester: number, courseCode: string): string {
    return `${year}-${semester}-${courseCode}`;
  }
}
