// app/api/suwon-scrape/login/route.ts
import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import type { SessionData } from '@/lib/auth/session';
import { sessionOptions } from '@/lib/auth/session';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: '학번/비밀번호가 필요합니다.' }, { status: 400 });
    }
    console.time('ColdStartTimer');

    const response = await fetch(`${process.env.AWS_URL}/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    // 응답 확인
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: '알 수 없는 오류가 발생했습니다.' }));
      console.error('Lambda Error:', errorData);
      return NextResponse.json(errorData, { status: response.status });
    }

    // 로그인 성공 시 세션 저장
    const res = NextResponse.json({ message: '로그인 성공', studentCode: username });
    const session = await getIronSession<SessionData>(req, res, sessionOptions);

    session.username = username;
    session.password = password;
    await session.save();

    return res;
  } catch (error: any) {
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    console.timeEnd('ColdStartTimer');
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
