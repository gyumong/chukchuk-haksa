import { type NextRequest, NextResponse } from 'next/server';
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
    const { data: users } = await supabase
      .from('users')
      .select('portal_connected')
      .eq('id', user.id)
      .single();

    // 로그인 후 리다이렉트 처리
    if (request.nextUrl.pathname === '/auth/callback') {
      const url = request.nextUrl.clone();
      url.pathname = users?.portal_connected ? '/main' : '/portal-login';
      return NextResponse.redirect(url);
    }

    // 포털 미연동 사용자가 main 페이지 접근 시 portal-login으로 리다이렉트
    if (!users?.portal_connected && request.nextUrl.pathname.startsWith('/main')) {
      const url = request.nextUrl.clone();
      url.pathname = '/portal-login';
      return NextResponse.redirect(url);
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
