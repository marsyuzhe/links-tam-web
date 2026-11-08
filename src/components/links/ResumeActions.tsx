'use client';
import { LocaleLink as Link, useLocale } from './Locale';
import { LockResumeButton } from './resume-access/ResumeGate';
export function ResumeActions() {
  const { locale } = useLocale();
  return (
    <div className="resume-actions">
      <Link className="reading-button" href="/cv">
        {locale === 'en' ? 'View official PDF ↗' : '查看正式 PDF ↗'}
      </Link>
      <a className="reading-button" href="/api/resume/file?download=1" download>
        {locale === 'en' ? 'Download official PDF ↓' : '下载正式 PDF ↓'}
      </a>
      <LockResumeButton />
    </div>
  );
}
