
type TaskStatus = 'in-progress' | 'completed' | 'failed';

interface TaskInfo {
  status: TaskStatus;
  data: any; // 크롤링 결과 or 에러 메시지
}

const taskMap = new Map<string, TaskInfo>();

export function setTask(taskId: string, status: TaskStatus, data: any) {
  taskMap.set(taskId, { status, data });
}

export function getTask(taskId: string): TaskInfo | undefined {
  return taskMap.get(taskId);
}

export function deleteTask(taskId: string) {
  taskMap.delete(taskId);
}