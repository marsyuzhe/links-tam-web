import type { Metadata } from 'next';
import { ProtectedResume } from '@/components/links/resume-access/ProtectedResume';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'CV | Links Tam',
  description: 'Preview the professional resume of Links Tam / 谭文睿.',
};

export default function CvPage() {
  return <ProtectedResume viewer />;
}
