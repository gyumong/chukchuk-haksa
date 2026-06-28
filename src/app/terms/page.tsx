import PrivacyPolicyContent from '@/app/privacy-policy/PrivacyPolicyContent';
import styles from '@/app/privacy-policy/PrivacyPolicy.module.scss';

export default function TermsPage() {
  return (
    <div className={styles.container}>
      <PrivacyPolicyContent />
    </div>
  );
}
