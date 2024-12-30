// app/api/suwon-scrape/start/route.ts
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { setTask } from '@/lib/crawling/scrape-task';
import { scrapeSuwonAll } from '@/lib/crawling/suwon-scrape-all';
import type { MergedSemester } from '@/types';

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json({ error: 'username, password required' }, { status: 400 });
  }

  const taskId = uuidv4();
  setTask(taskId, 'in-progress', null);

  // 비동기로 크롤링 시작
  (async () => {
    try {
      const result: MergedSemester[] = await scrapeSuwonAll(username, password);
      // 작업 완료 후 상태를 completed로
      setTask(taskId, 'completed', result);
    } catch (err: any) {
      setTask(taskId, 'failed', { message: err.message });
    }
  })();

  return NextResponse.json({ taskId }, { status: 202 });
}
