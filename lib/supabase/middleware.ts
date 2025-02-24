import { type NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { createServerClient } from '@supabase/ssr';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
        },
      },
    }
  );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 포털 연동 상태 확인
  if (user) {
    // TODO setUser 관련 코드 모듈화 필요
    Sentry.setUser({
      id: user.id,
    });
    const { data: users, error } = await supabase
      .from('users')
      .select('portal_connected, is_deleted')
      .eq('id', user.id)
      .single();

    if (error || !users) {
      console.warn('Cannot find user or error => skipping checks');
      return supabaseResponse;
    }

    if (users.is_deleted) {
      if (request.nextUrl.pathname !== '/') {
        console.warn('User is deleted => redirecting to /');
        const url = request.nextUrl.clone();
        url.pathname = '/';
        url.searchParams.set('msg', 'deleted-user');
        return NextResponse.redirect(url);
      } else {
        // 이미 '/' 라면, 더 이상 redirect 하지 않고 그대로 보여주기
        console.warn('User is deleted, but we are already at /. Not redirecting.');
      }
    }

    // 로그인 후 리다이렉트 처리
    if (request.nextUrl.pathname === '/auth/callback') {
      const url = request.nextUrl.clone();
      url.pathname = users?.portal_connected ? '/main' : '/portal-login';
      url.search = '';
      return NextResponse.redirect(url);
    }

    // 포털 미연동 사용자가 main 페이지 접근 시 portal-login으로 리다이렉트
    if (!users?.portal_connected && request.nextUrl.pathname.startsWith('/main')) {
      const url = request.nextUrl.clone();
      url.pathname = '/portal-login';
      return NextResponse.redirect(url);
    }

    if (users?.portal_connected) {
      // 만약 사용자가 portal-login, /funnel/*, /scraping 등 특정 경로 접근 시 차단하고 싶다면:
      if (
        request.nextUrl.pathname === '/portal-login' ||
        request.nextUrl.pathname.startsWith('/agreement') ||
        request.nextUrl.pathname.startsWith('/scraping') ||
        request.nextUrl.pathname.startsWith('/target-score') ||
        request.nextUrl.pathname.startsWith('/complete')
      ) {
        const url = request.nextUrl.clone();
        url.pathname = '/main'; // 이미 연동된 유저는 /main 같은 페이지로 보낸다
        return NextResponse.redirect(url);
      }
    }
  }

  if (!user && !request.nextUrl.pathname.startsWith('/') && !request.nextUrl.pathname.startsWith('/auth')) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
