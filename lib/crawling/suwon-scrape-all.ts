// lib/crawling/suwon-scrape-all.ts
import type { Page } from 'playwright';
// import type을 사용
import { chromium } from 'playwright';
import type { Course, CourseDTO, Credit, CreditDTO, MergedSemester, Student, StudentDTO } from '@/types';
import { mapCourseDTOToDomain, mapCreditDTOToDomain, mapStudentDTOToDomain } from './suwon-dto';

/**
 * 로그인(공통) → 학생 정보 크롤링 → 성적 크롤링 → 수강 크롤링 → Merge
 */
export async function scrapeSuwonAll(
  username: string,
  password: string
): Promise<{ student: Student; mergedData: MergedSemester[] }> {
  const browser = await chromium.launch({ headless: true });
  let loginError = false;

  try {
    const page = await browser.newPage();

    // alert 또는 confirm, prompt가 발생했을 때 이벤트로 감지
    page.on('dialog', async dialog => {
      if (dialog.type() === 'alert') {
        const msg = dialog.message();
        // 로그인 실패 시 뜨는 "아이디 또는 비밀번호를 잘못 입력하셨습니다." 등 문구 확인
        if (msg.includes('아이디 또는 비밀번호를 잘못 입력하셨습니다')) {
          //  dialog 이벤트 핸들러는 비동기로 동작합니다. 이 핸들러 내부에서 throw된 에러는 Playwright의 이벤트 처리 체계에 따라 처리되므로, 호출 스택에 다시 반영되지 않습니다. 그래서 아래와 같이 처리했습니다.
          loginError = true;
          await dialog.dismiss();
          return;
        } else {
          await dialog.dismiss();
        }
      }
    });

    await page.goto('https://portal.suwon.ac.kr/enview/index.html', {
      waitUntil: 'networkidle',
      timeout: 60000,
    });

    const frame = page.frame({ name: 'mainFrame' });
    if (!frame) {
      throw new Error('mainFrame not found');
    }

    await frame.fill('input[name="userId"]', username);
    await frame.fill('input[name="pwd"]', password);
    await frame.click('button.mainbtn_login');

    // 여기서 추가 대기 TODO: 문제 생길 시 로직 변경 필요
    await page.waitForTimeout(3000);

    if (loginError) {
      throw new Error('아이디 비밀번호가 올바르지 않습니다.'); // 로그인 에러 발생 시 명시적 throw
    }

    // 로그인 성공한 경우 → 학사시스템 페이지 이동
    await page.goto('https://info.suwon.ac.kr/sso_security_check', { waitUntil: 'domcontentloaded' });

    // 학생 정보 크롤링
    const student: Student = await doStudentScrape(page, username);

    // 성적 크롤링 + DTO 변환
    const creditData: Credit[] = await doCreditScrape(page, username);

    // 수강 크롤링 + DTO 변환
    const courseData: Course[] = await doCourseScrape(page, username);

    // 병합
    const mergedData = mergeCreditCourse(creditData, courseData);
    return { student, mergedData };
  } finally {
    await browser.close();
  }
}
/** 학생 정보 크롤링 로직 */
async function doStudentScrape(page: Page, username: string): Promise<Student> {
  const headers = {
    'Content-Type': 'application/json;charset=UTF-8',
    Accept: 'application/json',
    'User-Agent': 'Mozilla/5.0',
    Referer:
      'https://info.suwon.ac.kr/websquare/websquare_mobile.html?' +
      'w2xPath=/views/usw/sa/hj/SA_HJ_1230.xml&menuSeq=3818&progSeq=1117',
  };

  // POST 요청으로 학생 정보를 가져옴
  const response = await page.request.post('https://info.suwon.ac.kr/scrgBas/selectScrgBas.do', {
    headers,
    data: { sno: username }, // 학번을 요청 데이터로 전달
  });

  if (!response.ok()) {
    throw new Error(`Failed to fetch student info: ${response.status()}`);
  }

  const responseData = await response.json();
  const studentInfo: StudentDTO = responseData?.studentInfo;

  if (!studentInfo) {
    throw new Error('No studentInfo found in response.');
  }

  // DTO를 도메인 객체로 변환
  const student: Student = mapStudentDTOToDomain(studentInfo);

  return student;
}

/** 성적 크롤링 로직 */
async function doCreditScrape(page: Page, username: string): Promise<Credit[]> {
  const headers = {
    'Content-Type': 'application/json;charset=UTF-8',
    Accept: 'application/json',
    'User-Agent': 'Mozilla/5.0',
    Referer:
      'https://info.suwon.ac.kr/websquare/websquare_mobile.html?' +
      'w2xPath=/views/usw/sa/hj/SA_HJ_1230.xml&menuSeq=3818&progSeq=1117',
  };

  const response1 = await page.request.post('https://info.suwon.ac.kr/smrCretSum/listSmrCretSumTabYearSmrStud.do', {
    headers,
    data: { sno: username },
  });

  const data1 = await response1.json();
  const detailedData: CreditDTO[] = [];

  for (const item of data1.listSmrCretSumTabYearSmr || []) {
    const response2 = await page.request.post('https://info.suwon.ac.kr/cretBas/listSmrCretSumTabSubjt.do', {
      headers,
      data: {
        sno: username,
        cretGainYear: item.cretGainYear,
        cretSmrCd: item.cretSmrCd,
      },
    });
    const data2 = await response2.json();
    detailedData.push(
      ...(data2.listSmrCretSumTabSubjt || []).map((entry: Credit) => ({
        ...entry,
        cretGainYear: item.cretGainYear, // 상위 항목에서 가져옴
        cretSmrCd: item.cretSmrCd, // 상위 항목에서 가져옴
      }))
    );
  }

  // DTO → Domain 변환
  // mapCreditDTOToDomain를 사용
  const domainData: Credit[] = detailedData.map(dto => {
    const domainCredit = mapCreditDTOToDomain(dto);
    // `cretGainYear`와 `cretSmrCd`를 사용해 `semester` 계산
    domainCredit.semester = `${dto.cretGainYear}-${dto.cretSmrCd}`;
    return domainCredit;
  });
  return domainData;
}

/** 수강 크롤링 로직 */
async function doCourseScrape(page: Page, username: string): Promise<Course[]> {
  const headers = {
    'Content-Type': 'application/json;charset=UTF-8',
    Accept: 'application/json',
    'User-Agent': 'Mozilla/5.0',
    Referer:
      'https://info.suwon.ac.kr/websquare/websquare_mobile.html?' +
      'w2xPath=/views/usw/sa/hj/SA_HJ_1230.xml&menuSeq=3818&progSeq=1117',
  };

  const response1 = await page.request.post('https://info.suwon.ac.kr/atlecApplDtai/listAtlecApplDtaiTabYearSmr.do', {
    headers,
    data: { sno: username },
  });

  const data1 = await response1.json();
  const detailedData: CourseDTO[] = [];

  for (const info of data1.listAtlecApplDtaiTabYearSmr || []) {
    const response2 = await page.request.post('https://info.suwon.ac.kr/atlecApplDtai/listAtlecApplDtaiTabSubjt.do', {
      headers,
      data: {
        sno: username,
        subjtEstbYear: info.subjtEstbYear,
        subjtEstbSmrCd: info.subjtEstbSmrCd,
      },
    });
    const data2 = await response2.json();
    detailedData.push(...(data2.listAtlecApplDtaiTabSubjt || []));
  }

  // DTO → Domain 변환
  const domainData: Course[] = detailedData.map(dto => {
    const domainCourse = mapCourseDTOToDomain(dto);
    // `semester` 필드 추가
    domainCourse.semester = `${domainCourse.subjectEstablishmentYear}-${domainCourse.subjectEstablishmentSemesterCode}`;
    return domainCourse;
  });
  return domainData;
}

/** Domain 객체 병합 로직 */
function mergeCreditCourse(creditData: Credit[], courseData: Course[]): MergedSemester[] {
  // semesterMap에 학기별로 저장한 뒤 병합
  const semesterMap: Record<string, { semester: string; courses: Record<string, Credit & Partial<Course>> }> = {};

  // 수강 데이터 먼저 반영
  for (const c of courseData) {
    const semesterKey = c.semester as string; // domainCourse에서 semester를 가져옵니다.

    if (!semesterMap[semesterKey]) {
      semesterMap[semesterKey] = {
        semester: semesterKey,
        courses: {},
      };
    }
    semesterMap[semesterKey].courses[c.subjectCode] = { ...c } as Credit & Partial<Course>;
  }

  // 성적 데이터 반영
  for (const cc of creditData) {
    const semesterKey = cc.semester as string; // credit에서 semester를 가져옵니다.

    if (!semesterMap[semesterKey]) {
      semesterMap[semesterKey] = {
        semester: semesterKey,
        courses: {},
      };
    }

    const existing = semesterMap[semesterKey].courses[cc.courseCode];
    if (existing) {
      // 수강 데이터에 성적 정보 병합
      Object.assign(existing, cc);
    } else {
      // 성적 데이터만 있는 경우 추가
      semesterMap[semesterKey].courses[cc.courseCode] = { ...cc };
    }
  }

  // 결과 변환
  return Object.values(semesterMap).map(sem => ({
    semester: sem.semester,
    courses: Object.values(sem.courses),
  }));
}
