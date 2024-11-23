'use client';

import React from 'react';

import { kakaoLogin } from '@/lib/auth';

export default function LoginPage() {
  const handleLogin = async () => {
    try {
      await kakaoLogin();
    } catch (error) {
      console.error('로그인 실패:', error);
      alert('로그인 중 문제가 발생했습니다.');
    }
  };

  return (
    <div>
      <h1>로그인 페이지</h1>
      <button onClick={handleLogin}>카카오로 로그인하기</button>
    </div>
  );
}
