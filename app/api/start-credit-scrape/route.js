import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { scrapeSuwonCredit } from '../../../lib/crawling/suwon-scrape-credit';
import { emitTaskEvent } from '../../../lib/crawling/task-stream';

export async function POST(req) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
  }

  const taskId = uuidv4();
  // 상태 초기화
  emitTaskEvent(taskId, { status: 'in-progress', data: null });

  // 비동기로 크롤링 시작
  (async () => {
    try {
      const data = await scrapeSuwonCredit(username, password);
      console.log("@@@#",data);
      emitTaskEvent(taskId, { status: 'completed', data });
    } catch (error) {
      console.error("#$@#$",error);
      emitTaskEvent(taskId, { status: 'failed', data: null });
    }
  })();

  return NextResponse.json({ taskId }, { status: 202 });
}