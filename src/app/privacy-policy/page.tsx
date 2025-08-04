import { TopNavigation } from '@/components/ui/TopNavigation';
import styles from './PrivacyPolicy.module.scss';

export default function PrivacyPolicyPage() {
  return (
    <div className={styles.container}>
      <TopNavigation.Preset title="개인정보처리방침" type="back" />

      <div className={styles.content}>
        <p className={styles.intro}>
          <span className={styles.bold}>척척학사</span>
          (이하 &ldquo;서비스&rdquo;)는 「개인정보 보호법」 등 관련 법령에 따라 사용자의 개인정보를 보호하고, 개인정보
          처리와 관련된 내용을 투명하게 안내하고자 합니다.
          <br />
          <br />
          서비스를 이용하기 전에, 아래의 개인정보 처리 내용을 충분히 읽어보신 뒤 동의해 주시기 바랍니다.
        </p>

        <section className={styles.section}>
          <h2>1. 수집 항목 및 목적</h2>  
          <div className={styles.sectionContent}>
            <h3>1) 수집 항목</h3>
            <ul>
              <li>
                필수정보
                <ul>
                  <li>포털 로그인 정보: 학번(포털 사용자명), 비밀번호(한시적으로 크롤링용)</li>
                  <li>기본 정보: 이름, 입학연도, 전공/학과</li>
                  <li>학사 정보: 수강 내역, 성적 정보(학점, 이수 과목)</li>
                </ul>
              </li>
              <li>선택정보: 연락처, 이메일 등</li>
            </ul>
            <h3>2) 수집·이용 목적</h3>
            <ul>
              <li>학사 정보 자동 조회 및 관리: 학점, 재수강, 수강 과목, 졸업요건 등 맞춤형 학사 정보 안내</li>
              <li>본인 식별 및 회원관리: 계정 생성, 중복 가입 및 불법 이용 방지</li>
              <li>서비스 품질 개선: 통계 분석 및 학사정보 추천 기능 고도화</li>
            </ul>
          </div>
        </section>

        <section className={styles.section}>
          <h2>2. 개인정보의 보유 및 이용 기간</h2>
          <div className={styles.sectionContent}>
            <ul>
              <li>회원 탈퇴 시 즉시 파기하거나, 관련 법령에 따라 일정 기간 보관 후 파기</li>
              <li>단, 내부 정책(부정 이용 방지 등) 및 법령에서 보존 의무가 있는 정보는 해당 기간 동안 별도 저장</li>
            </ul>
          </div>
        </section>

        <section className={styles.section}>
          <h2>3. 동의를 거부할 권리 및 불이익</h2>
          <div className={styles.sectionContent}>
            <ul>
              <li>사용자는 개인정보 수집·이용 동의를 거부할 권리가 있습니다.</li>
              <li>다만, 필수 정보 제공에 동의하지 않으실 경우, 서비스 이용에 제한이 있을 수 있습니다.</li>
              <li>선택 정보 동의를 거부하더라도, 서비스의 기본 기능 이용에는 지장이 없습니다.</li>
            </ul>
          </div>
        </section>

        <section className={styles.section}>
          <h2>4. 개인정보 제3자 제공 및 위탁 안내</h2>
          <div className={styles.sectionContent}>
            <ul>
              <li>척척학사는 사용자의 동의 없이 개인정보를 외부에 제공하지 않습니다.</li>
              <li>
                크롤링(학사 포털 로그인)을 위한 자동화 작업 목적 이외에는 비밀번호를 별도로 저장하거나 제3자에게
                제공하지 않으며, 일회성으로 사용 후 즉시 폐기합니다.
              </li>
              <li>서비스 운영을 위해 외부 업체에 위탁할 경우, 관련 내용을 사전에 고지하고 동의를 받습니다.</li>
            </ul>
          </div>
        </section>

        <section className={styles.section}>
          <h2>5. 개인정보 보호 및 권리 행사</h2>
          <div className={styles.sectionContent}>
            <h3>1) 정보주체의 권리</h3>
            <ul>
              <li>개인정보 열람, 정정·삭제, 처리 정지, 동의 철회 등을 요구할 수 있습니다.</li>
              <li>
                서비스 내 관련 메뉴(계정 설정, 회원탈퇴 등)를 통해 직접 처리하거나, 고객센터로 연락하여 조치 요청
                가능합니다.
              </li>
            </ul>
            <h3>2) 보안 조치</h3>
            <ul>
              <li>사용자의 개인정보를 보호하기 위해 최고 수준의 보안 조치를 적용하고 있습니다.</li>
              <li>민감 정보는 암호화된 통신(SSL/TLS)을 통해 안전하게 전송됩니다.</li>
              <li>
                비밀번호는 저장하지 않으며, 로그인 시 OpenID Connect (OIDC) 프로토콜을 사용하여 안전한 인증 방식을
                사용합니다.
              </li>
              <li>Row-Level Security(RLS)로 사용자 데이터에 대한 세밀한 접근 통제를 제공합니다.</li>
              <li>API 호출 및 서비스 사용 내역은 철저히 기록되어 비정상적인 활동을 모니터링합니다.</li>
            </ul>
          </div>
        </section>

        <section className={styles.section}>
          <h2>6. 고객문의 및 권익침해 구제방법</h2>
          <div className={styles.sectionContent}>
            <ul>
              <li>고객센터: [이메일: rlaalsrb3559@naver.com]</li>
              <li>개인정보 관련 문의 및 요구사항은 고객센터로 연락해 주시기 바랍니다.</li>
              <li>기타 개인정보 침해에 대한 신고나 상담이 필요한 경우:</li>
              <li>개인정보침해신고센터 (https://privacy.kisa.or.kr)</li>
              <li>대검찰청 사이버수사과 (http://www.spo.go.kr)</li>
              <li>경찰청 사이버안전국 (http://cyberbureau.police.go.kr)</li>
            </ul>
          </div>
        </section>

        <section className={styles.lastSection}>
          <p>본 개인정보처리방침은 2024년 1월부터 적용됩니다.</p>
          <p>개인정보처리방침이 변경되는 경우, 서비스 내 공지사항을 통해 안내하겠습니다.</p>
        </section>
      </div>
    </div>
  );
}