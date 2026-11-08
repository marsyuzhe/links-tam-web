'use client';
import Image from 'next/image';
import { useLocale } from '../Locale';
import { careerEvidence } from '@/content/career-evidence';

export function WorkEvidence({ id, compact = false }: { id: string; compact?: boolean }) {
  const { locale } = useLocale();
  if (id !== 'kaian' || process.env.NEXT_PUBLIC_ENABLE_WORK_EVIDENCE !== '1') return null;
  const evidence = careerEvidence.kaian,
    n = locale === 'en' ? 1 : 0;
  return (
    <figure className={`work-evidence${compact ? ' work-evidence-compact' : ''}`}>
      <a
        href={evidence.src}
        target="_blank"
        rel="noreferrer"
        aria-label={locale === 'en' ? 'Open role evidence in a new tab' : '在新标签页查看岗位证明'}
      >
        <Image
          src={evidence.src}
          width={evidence.width}
          height={evidence.height}
          alt={evidence.alt[n]}
        />
      </a>
      <figcaption>
        <strong>{evidence.caption[n]}</strong>
        <p>{evidence.description[n]}</p>
      </figcaption>
    </figure>
  );
}
