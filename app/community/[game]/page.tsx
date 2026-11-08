import { notFound } from 'next/navigation';
import { worlds } from '@/content/worlds';
import { CommunityHub } from '@/components/links/rebuild/CommunityHub';
export function generateStaticParams() {
  return worlds.map((w) => ({ game: w.id }));
}
export default async function Page({ params }: { params: Promise<{ game: string }> }) {
  const { game } = await params;
  const w = worlds.find((w) => w.id === game);
  if (!w) notFound();
  return <CommunityHub game={w.id} />;
}
