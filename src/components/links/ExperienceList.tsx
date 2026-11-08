'use client';
import { LocaleLink as Link, useLocale } from './Locale';
import { getExperiences } from '@/content/experience-localized';
export function ExperienceList({ compact = false }: { compact?: boolean }) {
  const { locale } = useLocale();
  return (
    <div className={`experience-list ${compact ? 'experience-compact' : ''}`}>
      {getExperiences(locale).map((e) => (
        <article className="experience" key={e.id}>
          <div className="experience-date">{e.period}</div>
          <div className="experience-body">
            <h3>{e.company}</h3>
            <p className="experience-role">{e.role}</p>
            <p className="experience-nature">{e.relationship}</p>
            {!compact && (
              <ul>
                {e.duties.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            )}
            {e.related && (
              <div className="experience-links">
                {e.related.map((r) => (
                  <Link key={r.href} href={r.href}>
                    {r.label} ↗
                  </Link>
                ))}
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
