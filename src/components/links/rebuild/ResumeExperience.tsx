'use client';
import { rememberReadingReturn, useReadingReturn } from './reading-return';
import { WorkEvidence } from '../experience/WorkEvidence';
import { resumeEditorial } from '@/content/resume-editorial';
import { useRef, useState } from 'react';
import Image from 'next/image';
import { LocaleLink as Link, useLocale } from '../Locale';
import { ReadingShell } from '../ReadingShell';
import { ResumeActions } from '../ResumeActions';
import { ExperienceList } from '../ExperienceList';
import { getExperiences } from '@/content/experience-localized';
import { getProjects } from '@/content/projects-en';
import { projectMedia } from '@/content/media';
import { profile } from '@/content/profile';
import { useResumeMediaDialog } from './useResumeMediaDialog';
import { useResumeMotion } from './useResumeMotion';
export function ResumeExperience() {
  useReadingReturn('resume');
  const { locale, t } = useLocale(),
    en = locale === 'en';
  const allProjects = getProjects(locale),
    experiences = getExperiences(locale),
    projects = allProjects.filter((p) => p.featured),
    business = resumeEditorial.businessSlugs.map(
      (slug) => allProjects.find((p) => p.slug === slug)!,
    );
  const n = en ? 1 : 0;
  const printProjects = [
    ...business,
    ...projects.filter((p) => ['manga-studio', 'links-toolbox'].includes(p.slug)),
  ];
  const [selectedExperienceId, setSelectedExperienceId] = useState('kaian'),
    [selected, setSelected] = useState<string | null>(null);
  const trigger = useRef<HTMLElement | null>(null),
    dialog = useRef<HTMLDialogElement>(null),
    root = useRef<HTMLDivElement>(null);
  const current = experiences.find((e) => e.id === selectedExperienceId)!;
  const chosen = projects.find((p) => p.slug === selected);
  const associated = projects.find((p) => current.related?.some((r) => r.href === p.link));
  useResumeMotion(root);
  const close = useResumeMediaDialog(selected, dialog, trigger, () => setSelected(null));
  const open = (slug: string, target: HTMLElement) => {
    trigger.current = target;
    setSelected(slug);
  };
  return (
    <ReadingShell>
      <div ref={root} className="resume-rebuilt">
        <div className="resume-screen">
          <header className="resume-opening">
            <p className="label">Creative Technologist</p>
            <h1>
              Links Tam<span>/ {en ? 'Tan Wenrui' : '谭文睿'}</span>
            </h1>
            <p className="resume-statement">
              {en
                ? 'From practical problems. To tools people can use.'
                : '从实际问题出发，做真正能使用的工具。'}
            </p>
            <div className="resume-opening-bottom">
              <p>{resumeEditorial.intro[n]}</p>
              <ResumeActions />
            </div>
          </header>
          <section className="resume-career-focus">
            <h2>{en ? 'Where I contribute' : '我关注的工作'}</h2>
            <div>
              <p>{resumeEditorial.focus[n]}</p>
              <p>{resumeEditorial.method[n]}</p>
            </div>
          </section>
          <section className="resume-reveal">
            <div className="rebuild-section-head">
              <h2>{en ? 'Experience, in practice.' : '经历，在实践中展开。'}</h2>
              <p>
                {en
                  ? 'Select a chapter to see its connections.'
                  : '聚焦一段经历，看看它与作品的联系。'}
              </p>
            </div>
            <div className="experience-explorer">
              <div>
                {experiences.map((e) => (
                  <article
                    key={e.id}
                    className={`resume-chapter ${selectedExperienceId === e.id ? 'chapter-active' : ''}`}
                  >
                    <p className="chapter-meta">
                      {e.period} · {e.relationship}
                    </p>
                    <button
                      className="chapter-title"
                      onClick={() => setSelectedExperienceId(e.id)}
                      aria-pressed={selectedExperienceId === e.id}
                      aria-controls="resume-related-work"
                    >
                      {e.company}
                      <span aria-hidden="true">↗</span>
                    </button>
                    <p className="chapter-role">{e.role}</p>
                    <ul>
                      {e.duties.map((d) => (
                        <li key={d}>{d}</li>
                      ))}
                    </ul>
                    <div className="chapter-links">
                      {e.related?.map((p) => (
                        <Link href={p.href} key={p.href}>
                          {p.label} ↗
                        </Link>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
              <aside className="experience-evidence" id="resume-related-work" aria-live="polite">
                <p className="label">{en ? 'CONNECTED WORK' : '相关实践'}</p>
                <h3>{current.company}</h3>
                {associated ? (
                  <>
                    <button
                      onClick={(e) => open(associated.slug, e.currentTarget)}
                      className="evidence-preview"
                    >
                      {associated.media[0] ? (
                        <Image
                          src={projectMedia.find((m) => m.id === associated.media[0])!.src}
                          width={900}
                          height={600}
                          alt={associated.title}
                        />
                      ) : (
                        <span className="workflow-sketch" aria-hidden="true">
                          n8n → ComfyUI
                          <br />
                          LLM → Video
                        </span>
                      )}
                      <span>{en ? 'Explore work & sources ↗' : '查看作品与来源 ↗'}</span>
                    </button>
                    <p>{associated.description}</p>
                  </>
                ) : (
                  <p>{current.sourceNote}</p>
                )}
                <WorkEvidence id={current.id} compact />
              </aside>
            </div>
          </section>
          <section className="resume-reveal">
            <div className="rebuild-section-head">
              <h2>{en ? 'Tools, with evidence.' : '用作品说明能力。'}</h2>
              <p>{en ? 'Actual interfaces. Clear ownership.' : '真实界面，清楚的参与范围。'}</p>
            </div>
            <div className="resume-evidence-wall">
              {projects.map((p) => {
                const media = projectMedia.find((m) => m.id === p.media[0]);
                return (
                  <article className="evidence-project" key={p.slug}>
                    <button
                      id={`resume-media-${p.slug}`}
                      className="evidence-preview"
                      onClick={(e) => open(p.slug, e.currentTarget)}
                    >
                      {media ? (
                        <Image
                          src={media.src}
                          width={media.width}
                          height={media.height}
                          alt={en ? p.title + ' · Repository screenshot' : media.caption}
                        />
                      ) : (
                        <div className="workflow-sketch">
                          {p.tags.join(' / ')}
                          <small>
                            {en
                              ? 'Project documentation · No public interface image'
                              : '项目方案 · 暂无公开界面截图'}
                          </small>
                        </div>
                      )}
                      <span>
                        {p.media.length
                          ? en
                            ? 'Repository interface · Demo content ↗'
                            : '真实界面 · 仓库演示素材 ↗'
                          : en
                            ? 'Project documentation ↗'
                            : '项目方案记录 ↗'}
                      </span>
                    </button>
                    <div className="evidence-project-caption">
                      <h3>{p.title}</h3>
                      <p>
                        {p.stage} · {p.tags.join(' · ')}
                      </p>
                      <p>{p.description}</p>
                      <Link
                        id={`resume-case-${p.slug}`}
                        onClick={(e) => {
                          if (!e.metaKey && !e.ctrlKey && !e.shiftKey)
                            rememberReadingReturn('resume', e.currentTarget.id);
                        }}
                        href={p.link!}
                      >
                        {en ? 'Read full case ↗' : '进入完整案例 ↗'}
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
          <section className="resume-business-projects resume-reveal">
            <div className="rebuild-section-head">
              <h2>{en ? 'Business, product, implementation.' : '业务、产品与落地。'}</h2>
              <p>
                {en
                  ? 'Workflows and solution design from the final resume.'
                  : '简历中的核心业务与技术方案。'}
              </p>
            </div>
            {business.map((p) => (
              <article key={p.slug}>
                <div>
                  <h3>{p.title}</h3>
                  <p>{p.stage}</p>
                </div>
                <div>
                  <p>{p.description}</p>
                  <p>{p.responsibility}</p>
                  <Link
                    id={`business-case-${p.slug}`}
                    href={p.link ?? '/projects#' + p.slug}
                    onClick={(e) => rememberReadingReturn('resume', e.currentTarget.id)}
                  >
                    {en ? 'Project record' : '项目记录'} ↗
                  </Link>
                </div>
              </article>
            ))}
          </section>
          <section className="resume-reveal resume-practice">
            <h2>{en ? 'How I put tools to work.' : '技术，如何进入工作。'}</h2>
            {resumeEditorial.capabilities.map((c) => {
              const p = allProjects.find((p) => p.slug === c.project)!;
              return (
                <div key={c.project + c.name[0]}>
                  <h3>{c.name[n]}</h3>
                  <p>{c.text[n]}</p>
                  <Link href={p.link ?? '/projects#' + p.slug}>{p.title} ↗</Link>
                </div>
              );
            })}
          </section>
          <footer className="resume-outro">
            <p>{t(profile.motto)}</p>
            <p>{t(profile.education)}</p>
            <a href={profile.github}>GitHub · marsyuzhe ↗</a>
            <ResumeActions />
          </footer>
        </div>
        <article className="resume-sheet resume-print">
          <header>
            <p>Creative Technologist</p>
            <h1>Links Tam / {en ? 'Tan Wenrui' : '谭文睿'}</h1>
            <p>{resumeEditorial.intro[n]}</p>
            <p>{resumeEditorial.focus[n]}</p>
          </header>
          <section>
            <h2>{en ? 'Experience' : '工作与项目经历'}</h2>
            <ExperienceList />
          </section>
          <section className="resume-projects">
            <h2>{en ? 'Selected projects' : '代表项目'}</h2>
            {printProjects.map((p) => (
              <div className="resume-entry" key={p.slug}>
                <h3>{p.title}</h3>
                <p>{p.description}</p>
                <p>{p.github ?? p.link ?? '/projects#' + p.slug}</p>
              </div>
            ))}
          </section>
          <section className="resume-capabilities">
            <h2>{en ? 'Capabilities' : '能力与工具'}</h2>
            <div>
              {resumeEditorial.capabilities.map((c) => (
                <p key={c.name[0]}>
                  <strong>{c.name[n]}</strong>
                  <br />
                  {c.text[n]}
                </p>
              ))}
            </div>
          </section>
          <section>
            <h2>{en ? 'Education & contact' : '学习背景与联系'}</h2>
            <p>{t(profile.education)}</p>
            <p>github.com/marsyuzhe</p>
            <p>{t(profile.motto)}</p>
          </section>
        </article>
        {chosen && (
          <dialog
            ref={dialog}
            className="rebuild-dialog"
            onCancel={(e) => {
              e.preventDefault();
              close();
            }}
            aria-label={chosen.title}
          >
            <button autoFocus onClick={close}>
              {en ? 'Close' : '关闭'} ×
            </button>
            <h2>{chosen.title}</h2>
            {chosen.media[0] && (
              <Image
                src={projectMedia.find((m) => m.id === chosen.media[0])!.src}
                width={1366}
                height={900}
                alt={chosen.title}
              />
            )}
            <p>{chosen.description}</p>
            <p>{chosen.responsibility}</p>
            <p className="note">{chosen.boundary}</p>
            {chosen.media[0] && (
              <a
                href={projectMedia.find((m) => m.id === chosen.media[0])!.sourceUrl}
                target="_blank"
                rel="noreferrer"
              >
                {en ? 'Screenshot source' : '截图来源'} ↗
              </a>
            )}{' '}
            <Link
              href={chosen.link!}
              onClick={(e) => {
                if (!e.metaKey && !e.ctrlKey && !e.shiftKey)
                  rememberReadingReturn(
                    'resume',
                    trigger.current?.id ?? `resume-case-${chosen.slug}`,
                  );
              }}
            >
              {en ? 'Full case' : '完整案例'} ↗
            </Link>
          </dialog>
        )}
      </div>
    </ReadingShell>
  );
}
