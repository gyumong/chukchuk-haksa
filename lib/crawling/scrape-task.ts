type TaskStatus = 'in-progress' | 'completed' | 'failed';

interface TaskInfo {
  status: TaskStatus;
  data: any; // 크롤링 결과 or 에러 메시지
}

declare global {
  // TypeScript에서 global 객체 확장을 위해 반드시 선언이 필요
  let taskMap: Map<string, TaskInfo> | undefined;
}

// `globalThis`를 사용해 글로벌 변수 관리
const globalTaskMap = (globalThis as any).taskMap || new Map<string, TaskInfo>();
(globalThis as any).taskMap = globalTaskMap;

export const taskMap = globalTaskMap;

export function setTask(taskId: string, status: TaskStatus, data: any) {
  taskMap.set(taskId, { status, data });
}

export function getTask(taskId: string): TaskInfo | undefined {
  return taskMap.get(taskId);
}

export function deleteTask(taskId: string) {
  taskMap.delete(taskId);
}
