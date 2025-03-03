// lib/crawling/scrape-task.ts
import { redis } from '@/lib/redis';

export interface TaskInfo {
  status: 'in-progress' | 'completed' | 'failed';
  data: any;
}

// 작업 등록(업데이트)
export async function setTask(taskId: string, status: TaskInfo['status'], data: any) {
  const task: TaskInfo = { status, data };
  // JSON 문자열로 변환 후 Redis에 저장
  await redis.set(`task:${taskId}`, JSON.stringify(task));
}

// 작업 조회
export async function getTask(taskId: string): Promise<TaskInfo | null> {
  const raw = await redis.get<string>(`task:${taskId}`);
  if (!raw) {return null;} // 찾을 수 없음

  return JSON.parse(raw) as TaskInfo;
}

// 작업 삭제
export async function deleteTask(taskId: string) {
  await redis.del(`task:${taskId}`);
}