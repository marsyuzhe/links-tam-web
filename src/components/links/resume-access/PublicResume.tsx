'use client';
import { ReadingShell } from '../ReadingShell';
import { LocaleLink, useLocale } from '../Locale';
import { profile } from '@/content/profile';
import { getProjects } from '@/content/projects-en';

/** Public export owns no credentials or PDF routes. Only the existing public archive is used. */
export function PublicResume({ viewer }: { viewer?: boolean }) {
  const { locale, t } = useLocale();
  const en = locale === 'en';
  return (
    <ReadingShell>
      <p className="label">
        {en ? (viewer ? 'Public CV overview' : 'Public profile') : '公开履历概览'}
      </p>
      <h1 className="reading-title">Links Tam</h1>
      <p className="reading-lead">{t(profile.headline)}</p>
      <p>
        {en
          ? 'The private resume is available on the full website. Contact Links through GitHub for access.'
          : '完整私有简历请在 FULL_NODE 网站访问。可通过 GitHub 联系 Links 获取访问方式。'}
      </p>
      <a className="reading-button" href={profile.github}>
        GitHub ↗
      </a>
      <section className="resume-business-projects">
        <h2>{en ? 'Selected public work' : '公开代表作品'}</h2>
        {getProjects(locale)
          .filter((p) => p.featured)
          .map((p) => (
            <article key={p.slug}>
              <h3>
                <LocaleLink href={p.link ?? '/projects'}>{p.title} ↗</LocaleLink>
              </h3>
              <p>{p.description}</p>
            </article>
          ))}
      </section>
    </ReadingShell>
  );
}
