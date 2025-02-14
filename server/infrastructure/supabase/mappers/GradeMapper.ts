// server/infrastructure/supabase/mappers/GradeMapper.ts
import { GradeType as DomainGradeType } from '@/server/domain/academic-record/models/Grade';
import type { Database } from '@/types';

type GradeType = Database['public']['Tables']['student_courses']['Row']['grade'];
export class GradeMapper {
  /**
   * DB의 원시 grade (string)을 도메인 GradeType으로 변환한다.
   */
  static toDomain(dbGrade: GradeType): DomainGradeType | undefined {
    if (dbGrade === null) {
      return undefined;
    }
    switch (dbGrade) {
      case 'A+':
        return DomainGradeType.AP;
      case 'A0':
        return DomainGradeType.A0;
      case 'B+':
        return DomainGradeType.BP;
      case 'B0':
        return DomainGradeType.B0;
      case 'C+':
        return DomainGradeType.CP;
      case 'C0':
        return DomainGradeType.C0;
      case 'D+':
        return DomainGradeType.DP;
      case 'D0':
        return DomainGradeType.D0;
      case 'F':
        return DomainGradeType.F;
      case 'P':
        return DomainGradeType.P;
      case 'NP':
        return DomainGradeType.NP;
      case 'IP':
        return DomainGradeType.IP;
      default:
        throw new Error(`DB에서 예상치 못한 grade 값이 수신되었습니다: ${dbGrade}`);
    }
  }

  /**
   * 도메인 GradeType을 DB에 저장할 원시 문자열로 변환한다.
   */
  static toPersistence(grade?: DomainGradeType): GradeType {
    return grade ? grade : null;
  }
}
