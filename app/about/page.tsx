import Link from 'next/link';
import { ReadingShell } from '@/components/links/ReadingShell';
import { ExperienceList } from '@/components/links/ExperienceList';
import { profile } from '@/content/profile';
export const metadata = { title: 'About | Links Tam', description: profile.short };
export default function About() {
  return (
    <ReadingShell>
      <p className="label">ABOUT / {profile.name}</p>
      <h1 className="reading-title">
        从业务问题，
        <br />
        走向技术创造。
      </h1>
      <div className="editorial">
        <p>{profile.short}</p>
        <p>{profile.story}</p>
        <p>{profile.motto}</p>
        <Link className="reading-button" href="/resume">
          完整经历与正式简历 ↗
        </Link>{' '}
        <Link className="reading-button" href="/#about">
          体验代码生成式介绍 ↗
        </Link>
      </div>
      <section className="about-experiences">
        <h2>工作与项目经历</h2>
        <ExperienceList compact />
      </section>
    </ReadingShell>
  );
}
