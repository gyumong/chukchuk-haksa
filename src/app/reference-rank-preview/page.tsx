import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ReferenceRankPreviewPage() {
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  const { default: ReferenceRankPreview } = await import('./ReferenceRankPreview');

  return <ReferenceRankPreview />;
}
