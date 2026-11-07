import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ProfilePreviewPage() {
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  const { default: ProfilePreview } = await import('./ProfilePreview');

  return <ProfilePreview />;
}
