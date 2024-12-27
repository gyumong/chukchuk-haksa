import { chromium } from 'playwright';

export async function scrapeSuwonCredit(username, password) {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // 포털 로그인 페이지 접속
await page.goto('https://portal.suwon.ac.kr/enview/index.html', {
  waitUntil: 'networkidle',
  timeout: 120000 // 1분으로 늘려보기
});

    // iframe 접근
    const frame = page.frame({ name: 'mainFrame' });
    if (!frame) {
      throw new Error('mainFrame을 찾을 수 없습니다.');
    }

    // 아이디/비번 입력 후 로그인
    await frame.fill('input[name="userId"]', username);
    await frame.fill('input[name="pwd"]', password);
    await frame.click('button.mainbtn_login');

    // 로그인 처리 대기
    await page.waitForTimeout(3000);
    await page.goto('https://info.suwon.ac.kr/sso_security_check');

    // 쿠키 추출
    const cookies = await page.context().cookies();
    const session = {};
    for (const cookie of cookies) {
      session[cookie.name] = cookie.value;
    }

    // 세션 쿠키를 활용해 내부 API 호출
    const headers = {
      'Content-Type': 'application/json;charset=UTF-8',
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0',
      'Referer': 'https://info.suwon.ac.kr/websquare/websquare_mobile.html?w2xPath=/views/usw/sa/hj/SA_HJ_1230.xml&menuSeq=3818&progSeq=1117'
    };

    // 1차 요청: 학기별 이수 현황
    const response1 = await page.request.post(
      'https://info.suwon.ac.kr/smrCretSum/listSmrCretSumTabYearSmrStud.do', {
        headers,
        data: { sno: username },
      }
    );
    const data1 = await response1.json();

    // 2차 요청: 세부 과목 정보
    const detailedData = [];
    for (const course of data1.listSmrCretSumTabYearSmr || []) {
      const response2 = await page.request.post(
        'https://info.suwon.ac.kr/cretBas/listSmrCretSumTabSubjt.do', {
          headers,
          data: {
            sno: username,
            cretGainYear: course["cretGainYear"],
            cretSmrCd: course["cretSmrCd"]
          },
        }
      );
      const data2 = await response2.json();
      detailedData.push(...(data2.listSmrCretSumTabSubjt || []));
    }

    // 데이터 가공 (학기별 그룹화 예시)
    const groupedData = detailedData.reduce((acc, current) => {
      const semester = current.cretSmrNm;
      if (!acc[semester]) {
        acc[semester] = [];
      }
      acc[semester].push({
        studentNumber: current.sno,
        grade: current.cretGrdCd,
        gpa: current.gainGpa,
        courseName: current.subjtNm,
        department: current.estbDpmjNm,
        facultyDivisionName: current.facDvnm,
        points: current.gainPoint,
        courseCode: current.subjtCd,
        totalScore: current.gainPont
      });
      return acc;
    }, {});

    const formattedData = Object.keys(groupedData).map(key => ({
      semester: key,
      credits: groupedData[key]
    }));

    return formattedData;
  } finally {
    await browser.close();
  }
}