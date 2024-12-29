// lib/crawling/suwon-scrape-all.ts

import { chromium } from 'playwright';

/**
 * 로그인(공통) → 성적 크롤링 → 수강 크롤링 → Merge
 */
export async function scrapeSuwonAll(username: string, password: string): Promise<any[]> {
  const browser = await chromium.launch({ headless: true });
  let loginError = false;
  
  try {
    const page = await browser.newPage();

    // alert 또는 confirm, prompt가 발생했을 때 이벤트로 감지
    page.on('dialog', async (dialog) => {
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
      timeout: 60000
    });

    const frame = page.frame({ name: 'mainFrame' });
    if (!frame) throw new Error('mainFrame not found');

    await frame.fill('input[name="userId"]', username);
    await frame.fill('input[name="pwd"]', password);
    await frame.click('button.mainbtn_login');

    // 여기서 추가 대기
    await page.waitForTimeout(3000);

    if (loginError) {
      throw new Error('Invalid credentials'); // 로그인 에러 발생 시 명시적 throw
    }

    // 로그인 성공한 경우 → 학사시스템 페이지 이동
    await page.goto('https://info.suwon.ac.kr/sso_security_check', { waitUntil: 'domcontentloaded' });

    // 성적 크롤링
    const creditData = await doCreditScrape(page, username);

    // 수강 크롤링
    const courseData = await doCourseScrape(page, username);

    // 병합
    const merged = mergeCreditCourse(creditData, courseData);
    return merged;
  } finally {
    await browser.close();
  }
}

/** 성적 크롤링 로직 */
async function doCreditScrape(
  page: import('playwright').Page,
  username: string
): Promise<any[]> {
  const headers = {
    'Content-Type': 'application/json;charset=UTF-8',
    'Accept': 'application/json',
    'User-Agent': 'Mozilla/5.0',
    'Referer':
      'https://info.suwon.ac.kr/websquare/websquare_mobile.html?' +
      'w2xPath=/views/usw/sa/hj/SA_HJ_1230.xml&menuSeq=3818&progSeq=1117'
  };

  const response1 = await page.request.post(
    'https://info.suwon.ac.kr/smrCretSum/listSmrCretSumTabYearSmrStud.do',
    {
      headers,
      data: { sno: username }
    }
  );

  const data1 = await response1.json();
  const detailedData: any[] = [];

  for (const item of data1.listSmrCretSumTabYearSmr || []) {
    const response2 = await page.request.post(
      'https://info.suwon.ac.kr/cretBas/listSmrCretSumTabSubjt.do',
      {
        headers,
        data: {
          sno: username,
          cretGainYear: item.cretGainYear,
          cretSmrCd: item.cretSmrCd
        }
      }
    );
    const data2 = await response2.json();
    detailedData.push(...(data2.listSmrCretSumTabSubjt || []));
  }

  const grouped = detailedData.reduce((acc, cur) => {
    const semester = cur.cretSmrNm;
    if (!acc[semester]) acc[semester] = [];
    acc[semester].push({
      studentNumber: cur.sno,
      grade: cur.cretGrdCd,
      gpa: cur.gainGpa,
      courseName: cur.subjtNm,
      department: cur.estbDpmjNm,
      facultyDivisionName: cur.facDvnm,
      points: cur.gainPoint,
      courseCode: cur.subjtCd,
      totalScore: cur.gainPont
    });
    return acc;
  }, {} as Record<string, any[]>);

  const formatted = Object.keys(grouped).map(key => ({
    semester: key,
    courses: grouped[key]
  }));

  return formatted;
}

/** 수강 크롤링 로직 */
async function doCourseScrape(
  page: import('playwright').Page,
  username: string
): Promise<any[]> {
  const headers = {
    'Content-Type': 'application/json;charset=UTF-8',
    'Accept': 'application/json',
    'User-Agent': 'Mozilla/5.0',
    'Referer':
      'https://info.suwon.ac.kr/websquare/websquare_mobile.html?' +
      'w2xPath=/views/usw/sa/hj/SA_HJ_1230.xml&menuSeq=3818&progSeq=1117'
  };

  const response1 = await page.request.post(
    'https://info.suwon.ac.kr/atlecApplDtai/listAtlecApplDtaiTabYearSmr.do',
    {
      headers,
      data: { sno: username }
    }
  );

  const data1 = await response1.json();
  const detailedData: any[] = [];

  for (const info of data1.listAtlecApplDtaiTabYearSmr || []) {
    const response2 = await page.request.post(
      'https://info.suwon.ac.kr/atlecApplDtai/listAtlecApplDtaiTabSubjt.do',
      {
        headers,
        data: {
          sno: username,
          subjtEstbYear: info.subjtEstbYear,
          subjtEstbSmrCd: info.subjtEstbSmrCd
        }
      }
    );
    const data2 = await response2.json();
    detailedData.push(...(data2.listAtlecApplDtaiTabSubjt || []));
  }

  const grouped = detailedData.reduce((acc, cur) => {
    const semester = cur.subjtEstbYearSmr;
    if (!acc[semester]) acc[semester] = [];
    acc[semester].push({
      studentNumber: cur.sno,
      courseNumber: cur.diclNo,
      scheduleSummary: cur.timtSmryCn,
      departmentName: cur.estbDpmjNm,
      courseName: cur.subjtNm,
      retakeYearSemester: cur.refacYearSmr,
      isClosed: cur.closeYn,
      facultyDivisionCode: cur.facDvcd,
      points: cur.point,
      professorName: cur.ltrPrfsNm,
      subjectEstablishmentYearSemester: cur.subjtEstbYearSmr,
      subjectEstablishmentSemesterCode: cur.subjtEstbSmrCd,
      facultyDivisionName: cur.facDvnm,
      subjectCode: cur.subjtCd,
      subjectEstablishmentYear: cur.subjtEstbYear
    });
    return acc;
  }, {} as Record<string, any[]>);

  const formatted = Object.keys(grouped).map(key => ({
    semester: key,
    courses: grouped[key]
  }));

  return formatted;
}

/** 성적 + 수강 데이터 병합 로직 */
function mergeCreditCourse(creditData: any[], courseData: any[]): any[] {
  const semesterMap: Record<
    string,
    { semester: string; courses: Record<string, any> }
  > = {};

  // 수강 데이터
  for (const semInfo of courseData) {
    if (!semesterMap[semInfo.semester]) {
      semesterMap[semInfo.semester] = {
        semester: semInfo.semester,
        courses: {}
      };
    }
    for (const c of semInfo.courses) {
      semesterMap[semInfo.semester].courses[c.subjectCode] = {
        subjectCode: c.subjectCode,
        courseName: c.courseName,
        facultyDivisionName: c.facultyDivisionName,
        points: c.points,
        professorName: c.professorName,
        departmentName: c.departmentName
      };
    }
  }

  // 성적 데이터
  for (const semInfo of creditData) {
    if (!semesterMap[semInfo.semester]) {
      semesterMap[semInfo.semester] = {
        semester: semInfo.semester,
        courses: {}
      };
    }
    const semesterObj = semesterMap[semInfo.semester];
    for (const c of semInfo.courses) {
      const existing = semesterObj.courses[c.courseCode];
      if (existing) {
        existing.grade = c.grade;
        existing.gpa = c.gpa;
        existing.totalScore = c.totalScore;
      } else {
        semesterObj.courses[c.courseCode] = {
          courseCode: c.courseCode,
          courseName: c.courseName,
          facultyDivisionName: c.facultyDivisionName,
          points: c.points,
          grade: c.grade,
          gpa: c.gpa,
          totalScore: c.totalScore
        };
      }
    }
  }

  return Object.values(semesterMap).map(sem => ({
    semester: sem.semester,
    courses: Object.values(sem.courses)
  }));
}