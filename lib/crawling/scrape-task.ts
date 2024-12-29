
type TaskStatus = 'in-progress' | 'completed' | 'failed';

interface TaskInfo {
  status: TaskStatus;
  data: any; // 크롤링 결과 or 에러 메시지
}

declare global {
  var taskMap: Map<string, TaskInfo>;
}
// Node.js에서는 import 또는 require로 모듈을 불러올 때, 해당 모듈은 단일 인스턴스로 캐시됩니다.
// 그러나 각 HTTP 요청은 서버의 별도 실행 컨텍스트에서 처리되기 때문에, 모듈 내에 선언된 상태(taskMap)가 항상 공유된다고 보장할 수는 없습니다.
const globalTaskMap = global.taskMap || new Map<string, TaskInfo>();
global.taskMap = globalTaskMap;

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