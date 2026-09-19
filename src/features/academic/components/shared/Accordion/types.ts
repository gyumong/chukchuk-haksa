import type { ReactNode } from 'react';
import type { CourseDto } from '@/shared/api/data-contracts';

type Course = CourseDto;

interface CourseAreaProps {
  title: string;
  currentCredits: number;
  /** 기준(필요) 학점. 생략하면 "{currentCredits}학점" 단독 표시 (편입생 취득학점만 보이는 영역). */
  requiredCredits?: number;
  isCompleted: boolean;
  /** 이수해야 하는 선택 영역 수 (선교: requiredElectiveCourses). */
  requiredElectiveAreas?: number;
  /** 이수한 선택 영역 수 (선교: completedElectiveCourses). */
  completedElectiveAreas?: number;
  courses?: Course[];
  /** 학점 표시 뒤(행 끝)에 붙일 부가 요소 (예: 정보 아이콘 버튼). */
  trailingAdornment?: ReactNode;
  /** 학점 텍스트를 통째로 대체하는 라벨 (예: "학점 확인 불가"). */
  creditsLabel?: ReactNode;
  /** 펼침 본문. 지정하면 courses 대신 렌더한다 (지정과목 목록처럼 CourseDto 가 아닌 리스트용). */
  children?: ReactNode;
}

interface CourseAreaTriggerProps {
  title: string;
  currentCredits: number;
  /** 기준(필요) 학점. 생략하면 "{currentCredits}학점" 단독 표시. */
  requiredCredits?: number;
  isCompleted: boolean;
  isExpanded: boolean;
  onClick: () => void;
  /** 이수해야 하는 선택 영역 수 (선교: requiredElectiveCourses). */
  requiredElectiveAreas?: number;
  currentElectiveCourses?: number;
  /** 이수한 선택 영역 수 (선교: completedElectiveCourses). */
  completedElectiveAreas?: number;
  /** 학점 표시 뒤(행 끝)에 붙일 부가 요소. */
  trailingAdornment?: ReactNode;
  /** 학점 텍스트를 통째로 대체하는 라벨. */
  creditsLabel?: ReactNode;
}

interface CourseListProps {
  courses: Course[];
  isCompleted: boolean;
}

export type { CourseAreaProps, CourseAreaTriggerProps, CourseListProps };
