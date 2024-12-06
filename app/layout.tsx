'use client';

import React from 'react';
import localFont from 'next/font/local';
import Script from 'next/script';
import { cleanupKakao, initializeKakao } from '@/lib/auth';
import '../styles/global.scss';

const paperlogy = localFont({
  src: './fonts/Paperlogy-7Bold.woff2',
  weight: '700',
  variable: '--paperlogy-font',
});
const suit = localFont({
  src: [
    {
      path: './fonts/SUIT-Regular.woff2',
      weight: '400',
    },
    {
      path: './fonts/SUIT-SemiBold.woff2',
      weight: '600',
    },
  ],
  variable: '--suit-font',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.1/kakao.min.js"
          crossOrigin="anonymous"
          onLoad={() => {
            cleanupKakao();
            initializeKakao();
          }}
        />
      </head>
      <body className={`${paperlogy.variable} ${suit.variable} antialiased`}>{children}</body>
    </html>
  );
}
