import { hasResumeAccess } from '@/lib/server/resume-access';
import { ResumeExperience } from '../rebuild/ResumeExperience';
import { CvViewer } from '@/components/cv/CvViewer';
import { ResumeGate } from './ResumeGate';

export async function ProtectedResume({ viewer = false }: { viewer?: boolean }) {
  if (!(await hasResumeAccess())) return <ResumeGate />;
  return viewer ? <CvViewer /> : <ResumeExperience />;
}
