// app/api/start-merged-scrape/route.ts

import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { emitTaskEvent } from '@/lib/crawling/task-stream';
import { scrapeSuwonAll } from '@/lib/crawling/suwon-scrape-all';

/**
 * 하나의 태스크 ID를 발급하고, 브라우저 한 번 띄워
 * (1) 로그인 → (2) 성적 → (3) 수강 → Merge 로직을 실행
 */
export async function POST(req) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json({ error: 'Username and password are required.' }, { status: 400 });
  }

  const taskId = uuidv4();
  emitTaskEvent(taskId, { status: 'in-progress', data: null });

  (async () => {
    try {
      const mergedData = await scrapeSuwonAll(username, password);
      emitTaskEvent(taskId, { status: 'completed', data: mergedData });
    } catch (error) {
      if (error instanceof Error && error.message === 'Invalid credentials') {
        emitTaskEvent(taskId, { status: 'failed', data: '아이디/비밀번호 오류' });
        console.log('@@@@@@@@@@@@@@@@@@@@@@아이디/비밀번호 오류');
        console.error('@@@@@@@@@@@@@@@@@@@@@@아이디/비밀번호 오류');
      } else {
        emitTaskEvent(taskId, { status: 'failed', data: null });
      }
    }
  })();

  return NextResponse.json({ taskId }, { status: 202 });
}