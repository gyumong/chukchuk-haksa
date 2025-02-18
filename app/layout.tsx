import React from 'react';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Analytics } from '@vercel/analytics/react';
import KakaoProvider from '@/components/KakaoProvider';
import '../styles/global.scss';

export const metadata: Metadata = {
  title: '척척학사 I 수원대학교 졸업 관리의 모든 것',
  description:
    '수원대학교 학생들을 위한 학사 및 졸업 관리 시스템, 척척학사! 졸업 요건 자동 확인, 학점 이수 현황 분석, 최적의 과목 추천까지 한 번에!',
  keywords: ['수원대학교', '학사관리', '졸업 요건', '학점 관리', '수강 계획', '학사 시스템', '척척학사'],
  metadataBase: new URL('https://cchaksa.com'),
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: '척척학사 I 수원대학교 졸업 관리의 모든 것',
    description:
      '수원대학교 학생들을 위한 학사 및 졸업 관리 시스템, 척척학사! 졸업 요건 자동 확인, 학점 이수 현황 분석, 최적의 과목 추천까지 한 번에!',
    url: 'https://cchaksa.com',
    siteName: '척척학사 I',
    images: [
      {
        url: '/images/opengraph/og-image.png',
        width: 800,
        height: 400,
      },
    ],
  },
  twitter: {
    title: '척척학사 I 수원대학교 졸업 관리의 모든 것',
    description:
      '수원대학교 학생들을 위한 학사 및 졸업 관리 시스템, 척척학사! 졸업 요건 자동 확인, 학점 이수 현황 분석, 최적의 과목 추천까지 한 번에!',
  },
};

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

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={`${paperlogy.variable} ${suit.variable} antialiased`}>
        <KakaoProvider>{children}</KakaoProvider>
        <Analytics />
      </body>
    </html>
  );
}
