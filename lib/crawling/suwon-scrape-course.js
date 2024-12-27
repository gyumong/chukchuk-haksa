// lib/crawling/scrapeSuwonCourse.js

import { chromium } from 'playwright';

export async function scrapeSuwonCourse(username, password) {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // 포털 로그인 페이지로 이동
    await page.goto('https://portal.suwon.ac.kr/enview/index.html', {
      waitUntil: 'networkidle',
      timeout: 120000 // 1분으로 늘려보기
    });

    // iframe 접근
    const frame = page.frame({ name: 'mainFrame' });
    if (!frame) {
      throw new Error('mainFrame을 찾을 수 없습니다.');
    }

    // 아이디/비밀번호 입력
    await frame.fill('input[name="userId"]', username);
    await frame.fill('input[name="pwd"]', password);
    await frame.click('button.mainbtn_login');

    // 로그인 대기
    await page.waitForTimeout(3000);
    await page.goto('https://info.suwon.ac.kr/sso_security_check');

    // 쿠키 확보
    const cookies = await page.context().cookies();
    const session = {};
    for (const cookie of cookies) {
      session[cookie.name] = cookie.value;
    }

    const headers = {
      'Content-Type': 'application/json;charset=UTF-8',
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0',
      'Referer': 'https://info.suwon.ac.kr/websquare/websquare_mobile.html?w2xPath=/views/usw/sa/hj/SA_HJ_1230.xml&menuSeq=3818&progSeq=1117'
    };

    // 수강 정보(학기별 수강과목) 조회 API 가정
    const response1 = await page.request.post(
      'https://info.suwon.ac.kr/atlecApplDtai/listAtlecApplDtaiTabYearSmr.do', {
        headers,
        data: { sno: username },
      }
    );
    const data1 = await response1.json();

    // 각 학기별로 상세 과목 목록 조회
    const detailedData = [];
    for (const courseInfo of data1.listAtlecApplDtaiTabYearSmr || []) {
      const response2 = await page.request.post(
        'https://info.suwon.ac.kr/atlecApplDtai/listAtlecApplDtaiTabSubjt.do', {
          headers,
          data: {
            sno: username,
            subjtEstbYear: courseInfo["subjtEstbYear"],
            subjtEstbSmrCd: courseInfo["subjtEstbSmrCd"]
          },
        }
      );
      const data2 = await response2.json();
      detailedData.push(...(data2.listAtlecApplDtaiTabSubjt || []));
    }

    // 데이터 가공 (학기별 그룹화 예시)
    const groupedData = detailedData.reduce((acc, current) => {
      const semester = current.subjtEstbYearSmr; // "2022-1" 형태 가정
      if (!acc[semester]) {
        acc[semester] = [];
      }
      acc[semester].push({
        studentNumber: current.sno,
        courseNumber: current.diclNo,
        scheduleSummary: current.timtSmryCn,
        departmentName: current.estbDpmjNm,
        courseName: current.subjtNm,
        retakeYearSemester: current.refacYearSmr,
        isClosed: current.closeYn,
        facultyDivisionCode: current.facDvcd,
        points: current.point,
        professorName: current.ltrPrfsNm,
        subjectEstablishmentYearSemester: current.subjtEstbYearSmr,
        subjectEstablishmentSemesterCode: current.subjtEstbSmrCd,
        facultyDivisionName: current.facDvnm,
        subjectCode: current.subjtCd,
        subjectEstablishmentYear: current.subjtEstbYear
      });
      return acc;
    }, {});

    const formattedData = Object.keys(groupedData).map(key => ({
      semester: key,
      courses: groupedData[key]
    }));

    return formattedData;
  } finally {
    await browser.close();
  }
}