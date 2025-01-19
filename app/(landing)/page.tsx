'use client';

import { FixedButton } from '@/components/ui';
import { kakaoLogin } from '@/lib/auth';
import Image from 'next/image';

export default function LandingPage() {
    const handleLogin = async () => {
        try {
          await kakaoLogin();
        } catch (error) {
          console.error('로그인 실패:', error);
          alert('로그인 중 문제가 발생했습니다.');
        }
      };
  return (<>
          <Image
        src="/images/illustrations/LandingStart.png" // 이미지 경로를 지정해주세요
        alt="설명적인 대체 텍스트"
        width={375} // 원하는 너비
        height={1412} // 원하는 높이
        quality={100} // 품질 설정 (1-100)
        priority={true} // LCP(Largest Contentful Paint) 이미지의 경우 true로 설정
        className="object-cover" // 이미지 비율 유지를 위한 스타일
      />
      <Image
        src="/images/illustrations/LandingSecond.png"
        alt="설명적인 대체 텍스트"
        width={375}
        height={731}
        quality={100}
        priority={true}
        className="object-cover"
      />
      <Image
        src="/images/illustrations/LandingThird.png"
        alt="설명적인 대체 텍스트"
        width={375}
        height={650}
        quality={100}
        priority={true}
        className="object-cover"
      />
      <Image
        src="/images/illustrations/Landing4.png"
        alt="설명적인 대체 텍스트"
        width={375}
        height={684}
        quality={100}
        priority={true}
        className="object-cover"
      />
      <Image
        src="/images/illustrations/Landing5.png"
        alt="설명적인 대체 텍스트"
        width={375}
        height={719}
        quality={100}
        priority={true}
        className="object-cover"
      />
      <FixedButton variant="kakao" onClick={handleLogin}>
        3초 만에 카카오톡으로 시작하기
      </FixedButton>
    </>
  );
}

