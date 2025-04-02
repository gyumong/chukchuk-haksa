<div align="center">

<img src="https://github.com/user-attachments/assets/18c46f20-ee5d-4365-8896-36876459a5a1" width="600"/>
</div>

# 척척학사

### 📌 프로젝트 개요

<p align="center">
  <br/>
  <a href="https://your-live-service-url.com">
    <img src="https://img.shields.io/badge/프로젝트 기간-2024.12~ing-green?style=flat&logo=&logoColor=white" />
  </a>
</p>

**척척학사**는 학생들이 학교 포털과 연동하여 본인의 이수 현황과 졸업 요건을 손쉽게 확인하고 관리할 수 있도록 도와주는 서비스입니다. 

기존에는 학생들이 직접 학과별 졸업 요건을 찾아 하나하나 대조해야 했던 불편함이 있었지만, 척척학사는 이를 자동화하여 보다 편리하게 졸업 요건을 관리할 수 있도록 지원합니다. 현재 수원대학교 재학생 **600명** 이상이 사용 중이며, 학사 데이터를 실시간으로 동기화하여 졸업을 체계적으로 준비할 수 있도록 돕고 있습니다.


크롤링 관련 로직은 [suwon-scraper](https://github.com/gyumong/suwon-scraper)로 분리되어 있습니다.

이 프로젝트는 **2025년 2월 수원대학교 AI/SW 개발 경진대회 대상**을 수상한 작품으로, 2025년 1월부터 3월 1일 이전까지 풀스택 개발을 단독으로 진행하였으며, 이후 서비스 확장을 위하여 팀원을 모집하여 서버 부문을 [Java Spring 기반](https://github.com/pp8817/Chukchuk-haksa_Server)으로 이관하고 있습니다.

<br/>

## 🚀 주요 기능

<p align="center">
  <img src="https://github.com/user-attachments/assets/84cf31e3-6180-495f-a183-ead0d082b4fc" width="800" alt="척척학사 IA 구조도">
  <br/>
  <img src="https://github.com/user-attachments/assets/9fe3eb54-97be-48d9-8d60-c20da2a9e19d" width="800" alt="척척학사 기능 소개1">
  <br/>
  <img src="https://github.com/user-attachments/assets/1f464920-a223-45da-9cf1-4d8c2bd04cd6" width="800" alt="척척학사 기능 소개2">
</p>

- **학교 포털 데이터 연동**을 통한 학점, 성적 등 학사 데이터 실시간 동기화
- 학생별 학사 데이터와 졸업 요건을 자동 비교 분석하여 **부족한 학점 확인**
<br/>

## 🛠️ 기술 스택


| 분야 | 기술 |
|------|--------|
| 프론트엔드 | React, Next.js, TypeScript |
| 백엔드 및 데이터베이스 | Node.js, Supabase (PostgreSQL) |
| 데이터 크롤링 | Playwright |
| 인프라 및 배포 | Docker, AWS ECS, Vercel |

<br/>

# codemods

> 이 디렉토리는 코드 자동 변환을 위한 jscodeshift 스크립트를 저장합니다.

## 목록

- `useRouter-to-useInternalRouter.js`: next/navigation의 useRouter 훅을 useInternalRouter로 치환합니다.

## 실행 방법

```bash
yarn codemod:router        # 실행
yarn codemod:router:dry    # 변경사항 미리보기

<br/>

## 📝 관련 블로그 게시글

- [척척학사 왜 만들게 되었나?](https://www.gyumong.info/daily/chukchukhaksa-mvp-review)
- [척척학사 프로덕션 배포를 하며 겪은 이슈](https://www.gyumong.info/daily/chukchukhaksa-prod)
