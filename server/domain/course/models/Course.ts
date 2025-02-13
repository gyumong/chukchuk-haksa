// server/domain/course/models/Course.ts
import { Id } from '@/server/domain/shared/models/Id';

export class Course {
  private constructor(
    private readonly id: Id<number>,
    private readonly courseCode: string,
    private readonly courseName: string
  ) {}

  static create(params: { courseCode: string; courseName: string; points: number }): Course {
    if (!params.courseCode) {
      throw new Error('Course code is required');
    }
    if (!params.courseName) {
      throw new Error('Course name is required');
    }

    return new Course(Id.create<number>(), params.courseCode, params.courseName);
  }

  static reconstitute(params: { id: number; courseCode: string; courseName: string }): Course {
    return new Course(Id.of(params.id), params.courseCode, params.courseName);
  }

  getId(): Id<number> {
    return this.id;
  }

  getCourseCode(): string {
    return this.courseCode;
  }

  getCourseName(): string {
    return this.courseName;
  }
}
