import { ProtectedResume } from '@/components/links/resume-access/ProtectedResume';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Resume | Links Tam', robots: { index: false, follow: false } };
export default function Page() {
  return <ProtectedResume />;
}
