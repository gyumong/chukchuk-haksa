// app/api/start-course-scrape/route.js

import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { scrapeSuwonCourse } from '../../../lib/crawling/suwon-scrape-course'
import { emitTaskEvent } from '../../../lib/crawling/task-stream'

export async function POST(req) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
  }

  const taskId = uuidv4();
  emitTaskEvent(taskId, { status: 'in-progress', data: null });

  (async () => {
    try {
      const data = await scrapeSuwonCourse(username, password);
      console.log("#",data);
      emitTaskEvent(taskId, { status: 'completed', data });
    } catch (error) {
      console.log("@#@",error);
      console.error("##@",error);
      emitTaskEvent(taskId, { status: 'failed', data: null });
    }
  })();

  return NextResponse.json({ taskId }, { status: 202 });
}