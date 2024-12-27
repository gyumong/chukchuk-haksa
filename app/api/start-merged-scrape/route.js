// app/api/start-merged-scrape/route.js
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { emitTaskEvent, getTaskStatusStream } from '@/lib/crawling/task-stream';
import { mergeCourseData } from '@/lib/crawling/merge-course-data';

export async function POST(req) {
  const { username, password } = await req.json();
  if (!username || !password) {
    return NextResponse.json({ error: 'Username and password are required.' }, { status: 400 });
  }
  const mergedTaskId = uuidv4();
  emitTaskEvent(mergedTaskId, { status: 'in-progress', data: null });

  (async () => {
    const creditRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/start-credit-scrape`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const creditData = await creditRes.json();
    const creditTaskId = creditData.taskId;

    const courseRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/start-course-scrape`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const courseData = await courseRes.json();
    const courseTaskId = courseData.taskId;

    let creditDone = false;
    let courseDone = false;
    let creditResult = null;
    let courseResult = null;

    function handleUpdate(taskUpdate) {
      console.log("handleUpdate",taskUpdate);
      if (taskUpdate.taskId === creditTaskId) {
        console.log("creditTaskId",taskUpdate.status);
        if (taskUpdate.status === 'completed') {
          console.log("ataskUpdate.data",taskUpdate.data);
          creditDone = true;
          creditResult = taskUpdate.data;
        } else if (taskUpdate.status === 'failed') {
          emitTaskEvent(mergedTaskId, { status: 'failed', data: null });
          unsubAll();
        }
      }
      if (taskUpdate.taskId === courseTaskId) {
        console.log("courseTaskId",taskUpdate.status);
        if (taskUpdate.status === 'completed') {
          console.log("btaskUpdate.data",taskUpdate.data);
          courseDone = true;
          courseResult = taskUpdate.data;
        } else if (taskUpdate.status === 'failed') {
          emitTaskEvent(mergedTaskId, { status: 'failed', data: null });
          unsubAll();
        }
      }
      if (creditDone && courseDone) {
        const mergedData = mergeCourseData(creditResult, courseResult);
        console.log("@@@#",mergedData);
        emitTaskEvent(mergedTaskId, { status: 'completed', data: mergedData });
        unsubAll();
      }
    }

    const subs = [];
    subs.push(getTaskStatusStream(creditTaskId, handleUpdate));
    subs.push(getTaskStatusStream(courseTaskId, handleUpdate));
    console.log("subs",subs);
    function unsubAll() {
      subs.forEach(({ unsubscribe }) => unsubscribe());
    }
  })();

  return NextResponse.json({ taskId: mergedTaskId }, { status: 202 });
}