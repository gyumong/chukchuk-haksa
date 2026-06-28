import { TopNavigation } from '@/components/ui/TopNavigation';
import PrivacyPolicyContent from './PrivacyPolicyContent';
import styles from './PrivacyPolicy.module.scss';

export default function PrivacyPolicyPage() {
  return (
    <div className={styles.container}>
      <TopNavigation.Preset title="개인정보처리방침" type="back" />
      <PrivacyPolicyContent />
    </div>
  );
}
