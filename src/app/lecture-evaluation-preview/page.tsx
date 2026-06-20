import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function LectureEvaluationPreviewPage() {
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  const { default: LectureEvaluationPreview } = await import('./LectureEvaluationPreview');

  return <LectureEvaluationPreview />;
}
