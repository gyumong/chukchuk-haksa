export default function Home() {
  return (
    <div>
      {/* Paperlogy 폰트 테스트 */}
      <div style={{ fontFamily: 'var(--paperlogy-font)' }} className="--body-lg-regular">
        Hello paperlogy (Paperlogy 폰트)
      </div>

      {/* SUIT 폰트 테스트 */}
      <div style={{ fontFamily: 'var(--suit-font)' }} className="--body-lg-semibold">
        suit (SUIT 폰트)
      </div>

      {/* weight 테스트 */}
      <div style={{ fontFamily: 'var(--suit-font)', fontWeight: 400 }}>Regular 400 weight</div>
      <div style={{ fontFamily: 'var(--suit-font)', fontWeight: 600, fontSize: '18px' }}>SemiBold body-lg-semibold</div>
      <div className="--body-lg-semibold">body-lg-semibold</div>
      <div className="--body-lg-regular">body-lg-regular</div>
      <div className="test-typography">body-lg-regular</div>
    </div>
  );
}
