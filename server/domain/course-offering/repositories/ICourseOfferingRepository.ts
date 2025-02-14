// server/domain/course/repositories/ICourseOfferingRepository.ts
import { CourseAreaType, CourseOffering, EvaluationType } from '@/server/domain/course-offering/models/CourseOffering';

export interface ICourseOfferingRepository {
  /**
   * 특정 ID를 기준으로 CourseOffering 도메인 모델을 조회합니다.
   * @param id - CourseOffering의 고유 ID
   * @returns 조회된 CourseOffering 도메인 모델 또는 null
   */
  findById(id: number): Promise<CourseOffering | null>;

  /**
   * 새로운 CourseOffering 도메인 모델을 생성하여 영속화합니다.
   * @param offering - 생성할 CourseOffering 도메인 모델
   * @returns 생성된 CourseOffering 도메인 모델
   */
  create(offering: CourseOffering): Promise<CourseOffering>;

  /**
   * 주어진 CourseOffering 데이터(예: courseId, year, semester, classSection, professorId)를 기반으로 기존 레코드가 있다면 반환하고,
   * 없으면 새로 생성하여 반환합니다.
   * @param offering - CourseOffering 도메인 모델
   * @returns 조회되거나 생성된 CourseOffering 도메인 모델
   */
  getOrCreateOffering(offeringData: {
    courseId: number;
    year: number;
    semester: number;
    classSection?: string;
    professorId: number;
    departmentId?: number;
    scheduleSummary?: string;
    evaluationType?: EvaluationType;
    isVideoLecture?: boolean;
    subjectEstablishmentSemester?: number;
    facultyDivisionName?: CourseAreaType;
    areaCode?: number;
    originalAreaCode?: number;
    points?: number;
    hostDepartment?: string;
  }): Promise<CourseOffering>;
}
