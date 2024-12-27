// app/api/merged-status/route.js
import { NextResponse } from 'next/server';
import { getTaskStatusStream } from '../../../lib/crawling/task-stream'

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const taskId = searchParams.get('taskId');
  if (!taskId) return NextResponse.json({ error: 'taskId is required' }, { status: 400 });
  const textEncoder = new TextEncoder();
  const readableStream = new ReadableStream({
    start(controller) {
      const sendEvent = (eventName, data) => {
        const payload = `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(textEncoder.encode(payload));
      };
      const { unsubscribe } = getTaskStatusStream(taskId, (event) => {
        console.log("event",event);
        sendEvent('status', event);
        if (event.status === 'completed' || event.status === 'failed') controller.close();
      });
      return () => {
        unsubscribe();
      };
    }
  });
  return new NextResponse(readableStream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    },
  });
}