// app/api/suwon-scrape/progress/route.ts
import { NextResponse } from 'next/server';
import { getTask } from '@/lib/crawling/scrape-task';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const taskId = searchParams.get('taskId');
  if (!taskId) {
    return NextResponse.json({ error: 'taskId is required' }, { status: 400 });
  }

  const task = getTask(taskId);
  if (!task) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  return NextResponse.json({
    status: task.status,
    data: task.data, // in-progress 시 data: null, completed 시 크롤링결과, failed 시 에러정보
  });
}
