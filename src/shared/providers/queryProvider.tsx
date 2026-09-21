'use client';

import { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '../api/configs/queryClient';

const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // 브라우저 뒤로가기/앞으로가기(popstate) 시, suspense 에러로 "재요청 금지" 상태에
    // 멈춰있는 쿼리들을 초기 상태로 되돌린다. Next.js App Router가 뒤로가기 경로에서
    // 페이지 컴포넌트를 완전히 언마운트하지 않고 재사용하는 경우가 있어,
    // 컴포넌트 생명주기(mount/unmount)만으로는 이 상태를 확실히 풀 수 없다.
    const handlePopState = () => {
      queryClient.resetQueries({
        predicate: query => query.state.status === 'error',
      });
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default QueryProvider;