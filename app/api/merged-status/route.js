// app/api/merged-status/route.ts

import { NextResponse } from 'next/server';
import { getTaskStatusStream } from '@/lib/crawling/task-stream';

/**
 * SSE를 통해 특정 taskId의 진행 상태를 실시간 구독
 * 'in-progress' | 'completed' | 'failed' 이벤트를 클라이언트에 전송
 */
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const taskId = searchParams.get('taskId');

  if (!taskId) {
    return NextResponse.json({ error: 'taskId is required' }, { status: 400 });
  }

  const textEncoder = new TextEncoder();
  const readableStream = new ReadableStream({
    start(controller) {
      const sendEvent = (eventName, data) => {
        const payload = `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(textEncoder.encode(payload));
      };

      const { unsubscribe } = getTaskStatusStream(taskId, (event) => {
        sendEvent('status', event);
        if (event.status === 'completed' || event.status === 'failed') {
          controller.close();
        }
      });

      return () => {
        unsubscribe();
      };
    },
  });

  return new NextResponse(readableStream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Content-Encoding': 'none',
    },
  });
}