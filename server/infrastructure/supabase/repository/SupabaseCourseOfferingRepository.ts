// server/infrastructure/supabase/repositories/SupabaseCourseOfferingRepository.ts
import type { SupabaseClient } from '@supabase/supabase-js';
import { CourseOffering } from '@/server/domain/course-offering/models/CourseOffering';
import { CourseAreaType, EvaluationType } from '@/server/domain/course-offering/models/CourseOffering';
import { ICourseOfferingRepository } from '@/server/domain/course-offering/repositories/ICourseOfferingRepository';
import type { Database } from '@/types/supabase';
import { CourseOfferingMapper } from '../mappers/CourseOfferingMapper';

/**
 * CreateOfferingData
 * - getOrCreateOffering 메서드에서 필요한 모든 필드를 정의
 */
export interface CreateOfferingData {
  courseId: number;
  year: number;
  semester: number;
  classSection?: string;
  professorId: number; // 교수 없을 수도 있다면 optional
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
}

export class SupabaseCourseOfferingRepository implements ICourseOfferingRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async findById(id: number): Promise<CourseOffering | null> {
    const { data, error } = await this.supabase.from('course_offerings').select('*').eq('id', id).single();

    if (error || !data) {
      return null;
    }
    return CourseOfferingMapper.toDomain(data);
  }

  async create(offering: CourseOffering): Promise<CourseOffering> {
    const payload = CourseOfferingMapper.toPersistence(offering);
    const { data, error } = await this.supabase.from('course_offerings').insert(payload).select('*').single();

    if (error || !data) {
      console.error('Failed to create course offering:', error);
      throw new Error('Failed to create course offering');
    }

    return CourseOfferingMapper.toDomain(data);
  }

  /**
   * 주어진 키( courseId, year, semester, classSection, professorId )로 레코드 조회
   */
  async getOfferingId(
    courseId: number,
    year: number,
    semester: number,
    classSection?: string,
    professorId?: number
  ): Promise<number | null> {
    let query = this.supabase
      .from('course_offerings')
      .select('id')
      .eq('course_id', courseId)
      .eq('year', year)
      .eq('semester', semester);

    if (classSection) {
      query = query.eq('class_section', classSection);
    } else {
      query = query.is('class_section', null);
    }

    if (professorId) {
      query = query.eq('professor_id', professorId);
    } else {
      query = query.is('professor_id', null);
    }

    const { data, error } = await query.single();
    if (error || !data) {
      return null;
    }
    return data.id;
  }

  /**
   * 주어진 offering 데이터로 레코드를 조회하고, 존재하지 않으면 생성하여 도메인 모델로 반환합니다.
   */
  async getOrCreateOffering(offeringData: CreateOfferingData): Promise<CourseOffering> {
    const offeringId = await this.getOfferingId(
      offeringData.courseId,
      offeringData.year,
      offeringData.semester,
      offeringData.classSection || undefined,
      offeringData.professorId
    );

    if (offeringId) {
      const existing = await this.findById(offeringId);
      if (existing) {
        return existing;
      }
    }

    // 3) 없으면 새로 도메인 모델 생성 후 create
    //    domain model의 create(...)에 나머지 필드도 넣어준다
    const newOfferingDomain = CourseOffering.create({
      courseId: offeringData.courseId,
      year: offeringData.year,
      semester: offeringData.semester,
      classSection: offeringData.classSection,
      professorId: offeringData.professorId,
      departmentId: offeringData.departmentId,
      scheduleSummary: offeringData.scheduleSummary,
      evaluationType: offeringData.evaluationType,
      isVideoLecture: offeringData.isVideoLecture ?? false,
      subjectEstablishmentSemester: offeringData.subjectEstablishmentSemester,
      facultyDivisionName: offeringData.facultyDivisionName,
      areaCode: offeringData.areaCode,
      originalAreaCode: offeringData.originalAreaCode,
      points: offeringData.points,
      hostDepartment: offeringData.hostDepartment,
    });

    return this.create(newOfferingDomain);
  }
}
