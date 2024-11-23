'use client';

import React, { useState } from 'react';
import { kakaoLogin } from '../../lib/auth';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await kakaoLogin();
    } catch (error) {
      console.error('로그인 실패:', error);
      alert('로그인 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>로그인 페이지</h1>
      <button onClick={handleLogin}>카카오로 로그인하기</button>
    </div>
  );
}
