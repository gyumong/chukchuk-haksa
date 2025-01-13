import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { chromium } from 'playwright';
import type { SessionData } from '@/lib/auth/session';
import { sessionOptions } from '@/lib/auth/session';

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json({ error: '학번/비밀번호가 필요합니다.' }, { status: 400 });
  }

  const browser = await chromium.launch({ headless: true });
  let loginError = false;

  try {
    const page = await browser.newPage();

    // (1) 로그인 검증 로직
    page.on('dialog', async dialog => {
      // 예: "아이디 또는 비밀번호를 잘못 입력하셨습니다" 문구 뜨면
      if (dialog.message().includes('비밀번호를 잘못 입력')) {
        loginError = true;
      }
      await dialog.dismiss();
    });

    await page.goto('https://portal.suwon.ac.kr/enview/index.html', {
      waitUntil: 'networkidle',
      timeout: 60000,
    });
    const frame = page.frame({ name: 'mainFrame' });
    if (!frame) {
      throw new Error('mainFrame을 찾을 수 없습니다.');
    }

    await frame.fill('input[name="userId"]', username);
    await frame.fill('input[name="pwd"]', password);
    await frame.click('button.mainbtn_login');
    await page.waitForTimeout(3000);

    if (loginError) {
      return NextResponse.json({ error: '아이디나 비밀번호가 일치하지 않습니다.\n학교 홈페이지에서 확인해주세요.' }, { status: 401 });
    }

    // (2) 로그인 성공 처리
    // iron-session 초기화
    const res = NextResponse.json({ message: '로그인 성공' });
    const session = await getIronSession<SessionData>(req, res, sessionOptions);

    // (3) 세션에 username, password 저장
    session.username = username;
    session.password = password;
    await session.save();

    return res;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    await browser.close();
  }
}
