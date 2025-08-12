'use client';

import Image, { type ImageProps } from 'next/image';
import { FixedButton } from '@/components/ui';
import { kakaoLogin } from '@/lib/auth';

const landingImages: ImageProps[] = [
  {
    src: '/images/illustrations/Landing1.png',
    alt: '척척학사 메인 랜딩 이미지',
    width: 375,
    height: 1412,
    priority: true,
  },
  {
    src: '/images/illustrations/Landing2.png',
    alt: '간편 연동을 통해 학과별 학기별 졸업요건을 쉽게 확인해보아요',
    width: 375,
    height: 731,
  },
  {
    src: '/images/illustrations/Landing3.png',
    alt: '수강 완료 리스트 확인 페이지 이미지',
    width: 375,
    height: 650,
  },
  {
    src: '/images/illustrations/Landing4.png',
    alt: '학기별 세부 성적 확인 이미지',
    width: 375,
    height: 684,
  },
  {
    src: '/images/illustrations/Landing5-1.png',
    alt: '시간표 설계 이미지',
    width: 375,
    height: 684,
  },
  {
    src: '/images/illustrations/Landing6.png',
    alt: '최종 랜딩 이미지',
    width: 375,
    height: 719,
  },
] as const;

const LandingPage = () => {
  const handleLogin = async () => {
    try {
      await kakaoLogin();
    } catch (error) {
      console.error('로그인 실패:', error);
      alert('로그인 중 문제가 발생했습니다.');
    }
  };
  return (
    <>
      {landingImages.map(image => (
        <div key={image.alt + image.src}>
          <Image {...image} />
        </div>
      ))}
      <FixedButton variant="kakao" onClick={handleLogin}>
        3초 만에 카카오톡으로 시작하기
      </FixedButton>
    </>
  );
};

export default LandingPage;
