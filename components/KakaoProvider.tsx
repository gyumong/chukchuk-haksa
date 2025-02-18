'use client';

import { cleanupKakao, initializeKakao } from '@/lib/auth';
import Script from 'next/script';
import React from 'react';

export default function KakaoProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.1/kakao.min.js"
        crossOrigin="anonymous"
        onLoad={() => {
          cleanupKakao();
          initializeKakao();
        }}
      />
      {children}
    </>
  );
}