import React from 'react';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/react';
import QueryProvider from '@/shared/providers/queryProvider';
import '../styles/global.scss';

export const metadata: Metadata = {
  title: '척척학사 I 수원대생의 완벽한 졸업을 위한 필수 서비스',
  description:
    '수원대학교 학생들을 위해 제작된 통합 학사 관리 서비스, 척척학사! 졸업 요건 충족 여부 자동 확인, 전공/교양별 학점 이수 현황 분석, 미리 설계하는 나만의 시간표 기능까지, 척척학사와 함께 체계적인 졸업 준비를 시작하세요.',
  keywords: ['수원대학교', '학사관리', '졸업 요건', '학점 관리', '수강 계획', '학사 시스템', '척척학사', '시간표'],
  metadataBase: new URL('https://cchaksa.com'),
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: '척척학사 I 수원대생의 완벽한 졸업을 위한 필수 서비스',
    description:
      '수원대학교 학생들을 위해 제작된 통합 학사 관리 서비스, 척척학사! 졸업 요건 충족 여부 자동 확인, 전공/교양별 학점 이수 현황 분석, 미리 설계하는 나만의 시간표 기능까지, 척척학사와 함께 체계적인 졸업 준비를 시작하세요.',
    url: 'https://cchaksa.com',
    siteName: '척척학사 I',
    images: [
      {
        url: '/images/opengraph/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    title: '척척학사 I 수원대생의 완벽한 졸업을 위한 필수 서비스',
    description:
      '수원대학교 학생들을 위해 제작된 통합 학사 관리 서비스, 척척학사! 졸업 요건 충족 여부 자동 확인, 전공/교양별 학점 이수 현황 분석, 미리 설계하는 나만의 시간표 기능까지, 척척학사와 함께 체계적인 졸업 준비를 시작하세요.',
  },
};

const paperlogy = localFont({
  src: './fonts/Paperlogy-subset-7Bold.woff2',
  weight: '700',
  variable: '--paperlogy-font',
  display: 'swap',
});
const suit = localFont({
  src: [
    {
      path: './fonts/SUIT-subset-Regular.woff2',
      weight: '400',
    },
    {
      path: './fonts/SUIT-subset-SemiBold.woff2',
      weight: '600',
    },
  ],
  variable: '--suit-font',
  display: 'swap',
});

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={`${paperlogy.variable} ${suit.variable} antialiased`}>
        <QueryProvider>{children}</QueryProvider>
        <Analytics />
        {/* Cloudflare Web Analytics: 스크립트 삽입 */}
        <Script
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "e3e57bab626a47919bcc298916bec636"}'
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
