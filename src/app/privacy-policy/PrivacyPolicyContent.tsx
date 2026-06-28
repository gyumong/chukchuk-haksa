import styles from './PrivacyPolicy.module.scss';

export default function PrivacyPolicyContent() {
  return (
    <div className={styles.content}>
      <section className={styles.header}>
        <h1>척척학사 개인정보처리방침</h1>
        <p>
          <strong>서비스명</strong>: 척척학사 (수원대생의 완벽한 졸업을 위한 필수 서비스)
          <br />
          <strong>시행일</strong>: 2026년 6월 27일
          <br />
          (최초 제정: 2024년 1월 / 본 개정: 광고·행태정보·국외이전 사항 반영)
        </p>
        <p>
          척척학사(이하 &ldquo;서비스&rdquo;)는 「개인정보 보호법」 등 관계 법령을 준수하며, 이용자의
          개인정보를 보호하기 위하여 다음과 같이 개인정보처리방침을 수립·공개합니다.
        </p>
      </section>

      <section className={styles.section}>
        <h2>1. 수집 항목 및 목적</h2>
        <div className={styles.sectionContent}>
          <h3>가. 이용자가 제공하는 정보</h3>
          <ul>
            <li>
              <strong>필수정보</strong>: 포털 로그인 정보(학번, 비밀번호), 기본 정보(이름, 입학연도,
              전공/학과), 학사 정보(수강 내역, 성적 정보)
            </li>
            <li>
              <strong>선택정보</strong>: 연락처, 이메일 등
            </li>
          </ul>

          <h3>나. 서비스 이용 과정에서 자동으로 생성·수집되는 정보</h3>
          <p>서비스 이용 과정에서 다음 정보가 자동으로 생성·수집될 수 있습니다.</p>
          <ul>
            <li>앱 버전, 플랫폼(Android/iOS), 기기 정보</li>
            <li>서비스 이용 기록(시간표·과목 통계 등 이벤트 로그)</li>
            <li>오류 및 크래시 로그</li>
            <li>(광고 관련 자동 수집 정보는 「6. 온라인 맞춤형 광고 및 행태정보 수집」 참조)</li>
          </ul>

          <h3>다. 수집·이용 목적</h3>
          <ul>
            <li>학사 정보 자동 조회 및 관리</li>
            <li>본인 식별 및 회원관리</li>
            <li>서비스 품질 개선 및 추천 기능 고도화</li>
            <li>서비스 이용 통계 분석 및 오류 진단·개선</li>
          </ul>
        </div>
      </section>

      <section className={styles.section}>
        <h2>2. 개인정보의 보유 및 이용 기간</h2>
        <div className={styles.sectionContent}>
          <p>
            회원 탈퇴 시 즉시 파기하거나 관련 법령에 따라 보관 후 파기합니다. 부정 이용 방지 등 내부 정책 및
            법령상 보존 의무가 있는 정보는 해당 기간 동안 별도 저장합니다.
          </p>
          <p>
            자동 수집 정보 및 위탁사로 전송되는 정보의 보유·이용 기간은 「4. 개인정보 제3자 제공 및 처리위탁」
            및 「6. 온라인 맞춤형 광고 및 행태정보 수집」에 따릅니다.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <h2>3. 동의를 거부할 권리 및 불이익</h2>
        <div className={styles.sectionContent}>
          <p>
            이용자는 개인정보 수집·이용 동의를 거부할 권리가 있습니다. 다만 필수정보 미동의 시 서비스 이용이
            제한될 수 있으며, 선택정보 미동의 시에도 기본 기능은 이용할 수 있습니다.
          </p>
          <p>맞춤형 광고를 위한 행태정보 수집은 「6.」에 안내된 방법으로 거부·차단할 수 있습니다.</p>
        </div>
      </section>

      <section className={styles.section}>
        <h2>4. 개인정보 제3자 제공 및 처리위탁</h2>
        <div className={styles.sectionContent}>
          <p>
            서비스는 이용자의 개인정보를 제3자에게 무분별하게 제공하지 않습니다. 포털 로그인 비밀번호는 학사
            정보 크롤링 목적 외에는 저장하지 않으며, 일회성 사용 후 즉시 폐기합니다.
          </p>

          <h3>가. 처리위탁 (국내)</h3>
          <p>
            서비스는 안정적인 서비스 제공을 위하여 아래와 같이 개인정보 처리 업무를 위탁하며, 해당 데이터는
            국내에 저장됩니다.
          </p>
          <div className={styles.tableWrapper}>
            <table>
              <thead>
                <tr>
                  <th>수탁자</th>
                  <th>위탁 업무</th>
                  <th>데이터 저장 위치</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Amazon Web Services, Inc. (AWS)</td>
                  <td>서비스 인프라(서버·데이터베이스) 운영 및 데이터 보관</td>
                  <td>대한민국 (AWS 아시아 태평양 - 서울 리전)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>나. 개인정보 국외 이전</h3>
          <p>
            서비스는 이용 통계 분석, 오류 모니터링 및 맞춤형 광고 제공을 위하여 아래와 같이 개인정보 처리를
            위탁하며, 이 과정에서 개인정보가 국외로 이전됩니다.
          </p>
          <div className={styles.tableWrapper}>
            <table>
              <thead>
                <tr>
                  <th>이전받는 자</th>
                  <th>이전 국가</th>
                  <th>이전 항목</th>
                  <th>이전 목적</th>
                  <th>이전 시기 및 방법</th>
                  <th>보유·이용 기간</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Google LLC (Firebase)</td>
                  <td>미국</td>
                  <td>이벤트 로그, 플랫폼, 크래시 로그</td>
                  <td>서비스 이용 통계 및 앱 오류(크래시) 분석</td>
                  <td>서비스 이용(이벤트 발생) 시점에 네트워크를 통해 전송</td>
                  <td>Google 개인정보처리방침에 따름 (https://policies.google.com/privacy)</td>
                </tr>
                <tr>
                  <td>Google LLC (AdMob·AdSense)</td>
                  <td>미국</td>
                  <td>광고식별자(AAID/IDFA), 기기·브라우저 정보, IP 주소, 쿠키, 광고 상호작용 정보</td>
                  <td>맞춤형 광고 제공, 광고 성과 측정, 부정클릭(무효 트래픽) 방지</td>
                  <td>광고 요청 시점에 네트워크를 통해 전송</td>
                  <td>Google 개인정보처리방침에 따름 (https://policies.google.com/privacy)</td>
                </tr>
                <tr>
                  <td>Amplitude, Inc.</td>
                  <td>미국</td>
                  <td>서비스 내부 사용자 식별자(uid), 앱 버전, 플랫폼, 이용 통계</td>
                  <td>앱 이용 행태 분석</td>
                  <td>이벤트 발생 시점에 네트워크를 통해 전송</td>
                  <td>수집·이용 목적 달성 시까지 (Amplitude 정책에 따름)</td>
                </tr>
                <tr>
                  <td>Functional Software, Inc. (Sentry)</td>
                  <td>미국</td>
                  <td>오류 로그, IP 주소, 브라우저·기기 정보, 접속 URL, 화면 녹화(세션 리플레이) 데이터</td>
                  <td>웹 오류 모니터링 및 화면 녹화 기반 오류 재현</td>
                  <td>오류가 발생한 세션 및 일부 샘플링 세션에서 네트워크를 통해 전송</td>
                  <td>수집·이용 목적 달성 시까지 (Sentry 정책에 따름)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className={styles.note}>
            ※ <strong>세션 리플레이(화면 녹화) 안내</strong>: 웹사이트의 오류를 재현·분석하기 위해 일부 세션
            및 오류가 발생한 세션의 화면이 녹화될 수 있습니다. 이용자가 입력한 텍스트 및 입력값은 기본적으로
            마스킹(가림) 처리되어 수집되지 않습니다.
          </p>
          <p>
            <strong>국외 이전을 거부하는 방법 및 효과</strong>: 이용자는 「6.」에 안내된 광고식별자/쿠키 통제
            방법으로 맞춤형 광고용 행태정보의 국외 이전을 거부할 수 있습니다. 그 밖의 분석·오류 모니터링 목적
            이전에 대해서는 「7.」의 고객센터로 거부를 요청할 수 있습니다. 다만 이전을 거부하는 경우 통계 기반
            서비스 개선, 오류 진단, 맞춤형 광고 등 일부 기능이 제한될 수 있습니다.
          </p>
          <p>
            서비스는 위탁·국외이전 시 「개인정보 보호법」에 따라 개인정보가 안전하게 관리되도록 필요한 사항을
            규정하고 관리·감독합니다.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <h2>5. 개인정보 보호 및 권리 행사</h2>
        <div className={styles.sectionContent}>
          <p>
            <strong>가. 정보주체의 권리</strong>: 이용자는 개인정보 열람, 정정·삭제, 처리정지, 동의 철회 등을
            요구할 수 있습니다.
          </p>
          <p>
            <strong>나. 보안 조치</strong>: SSL/TLS 암호화 통신, OIDC 프로토콜 인증, Row-Level Security 접근
            통제, 비정상 활동 모니터링
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <h2>6. 온라인 맞춤형 광고 및 행태정보 수집</h2>
        <div className={styles.sectionContent}>
          <p>척척학사는 이용자에게 맞춤형 광고를 제공하기 위해 행태정보를 수집·이용하며, 그 내용은 아래와 같습니다.</p>

          <h3>가. 수집하는 행태정보 항목 및 수집 방법</h3>
          <ul>
            <li>
              <strong>모바일 앱</strong>: 광고식별자(Android 광고 ID(AAID), iOS 광고식별자(IDFA)), 기기
              정보(OS·기기 모델 등), 광고 조회 및 클릭 등 광고 상호작용 정보
            </li>
            <li>
              <strong>웹사이트</strong>: 쿠키, 기기·브라우저 정보, IP 주소, 광고 조회 및 클릭 등 광고 상호작용
              정보
            </li>
            <li>
              <strong>수집 방법</strong>: Google AdMob(앱) 및 Google AdSense(웹)의 광고 모듈·자동수집 도구를
              통하여 Google LLC 등 광고 제공 사업자가 자동으로 수집합니다.
            </li>
            <li>
              iOS의 경우, 앱 추적 투명성(App Tracking Transparency, ATT)에 따라 <strong>이용자가 추적을 허용한
              경우에 한하여</strong> 광고식별자(IDFA)를 수집합니다.
            </li>
          </ul>

          <h3>나. 수집·이용 목적</h3>
          <ul>
            <li>
              이용자의 관심·성향에 기반한 맞춤형 광고 제공, 광고 노출·성과 측정, 부정클릭(무효 트래픽) 방지 및
              서비스 운영·개선
            </li>
          </ul>

          <h3>다. 보유·이용 기간</h3>
          <ul>
            <li>
              수집·이용 목적 달성 시까지 보유하며, 구체적인 보관 기간은 Google의 데이터 보관 정책
              (https://policies.google.com/technologies/ads)에 따릅니다.
            </li>
          </ul>

          <h3>라. 행태정보 수집 거부·통제 방법</h3>
          <p>이용자는 아래 방법으로 광고식별자 수집 및 맞춤형 광고를 거부·차단할 수 있습니다.</p>
          <ul>
            <li>
              <strong>Android</strong>: 설정 &gt; Google &gt; 광고 &gt; &apos;광고 ID 삭제&apos; 또는 &apos;광고
              맞춤설정 선택 해제&apos;
            </li>
            <li>
              <strong>iOS</strong>: 설정 &gt; 개인정보 보호 및 보안 &gt; 추적 &gt; &apos;앱이 추적을 요청하도록
              허용&apos; 해제
            </li>
            <li>
              <strong>웹</strong>: Google 광고 설정(https://adssettings.google.com 또는
              https://myadcenter.google.com)에서 맞춤형 광고 해제, 또는 브라우저 설정에서 쿠키 차단
            </li>
            <li>Google의 광고 데이터 처리에 관한 자세한 내용: https://policies.google.com/technologies/partner-sites</li>
          </ul>
        </div>
      </section>

      <section className={styles.section}>
        <h2>7. 고객문의 및 권익침해 구제방법</h2>
        <div className={styles.sectionContent}>
          <p>
            <strong>고객센터</strong>: rlaalsrb3559@naver.com
          </p>

          <p>
            <strong>외부 구제기관</strong>
          </p>
          <ul>
            <li>개인정보침해신고센터 (https://privacy.kisa.or.kr)</li>
            <li>개인정보 분쟁조정위원회 (https://www.kopico.go.kr)</li>
            <li>대검찰청 사이버수사과 (https://www.spo.go.kr)</li>
            <li>경찰청 사이버수사국 (https://ecrm.police.go.kr)</li>
          </ul>
        </div>
      </section>

      <section className={styles.lastSection}>
        <h2>부칙</h2>
        <ul>
          <li>본 방침은 2026년 6월 27일부터 시행합니다.</li>
          <li>
            <strong>개정 이력</strong>
            <ul>
              <li>2024. 01. 01. 제정</li>
              <li>2026. 06. 27. 개정 (온라인 맞춤형 광고·행태정보, 자동 수집 정보, 분석/모니터링 위탁 및 국외이전 사항 반영)</li>
            </ul>
          </li>
        </ul>
      </section>
    </div>
  );
}
