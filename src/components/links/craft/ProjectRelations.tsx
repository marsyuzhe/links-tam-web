'use client';
import Image from 'next/image';
import { projectMedia } from '@/content/media';
import { useState } from 'react';
import { getProjects } from '@/content/projects-en';
import { LocaleLink as Link, useLocale } from '../Locale';
import { HowItWorks } from './HowItWorks';
const connections = [
  { technology: 'Python / Qt', project: 'manga-studio' },
  { technology: 'n8n / ComfyUI', project: 'commerce-video-agent' },
  { technology: 'React / TypeScript', project: 'portfolio' },
  { technology: 'Docker / Linux', project: 'comfy-local' },
];
export function ProjectRelations() {
  const { locale } = useLocale(),
    en = locale === 'en';
  const [selected, setSelected] = useState(0);
  const projects = getProjects(locale);
  const project = projects.find((item) => item.slug === connections[selected].project)!;
  const media = projectMedia.find((item) => item.id === project.media[0]);
  return (
    <section className="craft-section" id="craft-connections">
      <header className="craft-section-heading">
        <h2>{en ? 'Tools, connected to work.' : '技术，回到作品里。'}</h2>
        <p>
          {en ? 'Choose a tool. See where I put it to work.' : '选一项技术，看看它用在哪件作品里。'}
        </p>
      </header>
      <div className="craft-evidence-layout">
        <div>
          <div className="craft-relation-labels" aria-hidden="true">
            <span>{en ? 'Technology used' : '使用的技术'}</span>
            <span>{en ? 'Related project' : '对应的作品'}</span>
          </div>
          <div className="craft-relations">
            <div className="craft-relation-column">
              {connections.map((item, index) => (
                <button
                  key={item.technology}
                  aria-pressed={selected === index}
                  aria-controls="craft-project-evidence"
                  onClick={() => setSelected(index)}
                >
                  {item.technology}
                </button>
              ))}
            </div>
            <svg viewBox="0 0 160 280" preserveAspectRatio="none" aria-hidden="true">
              {connections.map((item, index) => (
                <path
                  key={item.technology}
                  d={`M0 ${35 + 70 * index} C50 ${17 + 70 * index},110 ${53 + 70 * index},160 ${35 + 70 * index}`}
                  vectorEffect="non-scaling-stroke"
                  className={selected === index ? 'selected' : ''}
                />
              ))}
            </svg>
            <div className="craft-relation-column">
              {connections.map((item, index) => (
                <button
                  key={item.project}
                  aria-pressed={selected === index}
                  aria-controls="craft-project-evidence"
                  onClick={() => setSelected(index)}
                >
                  {projects.find((project) => project.slug === item.project)?.title}
                </button>
              ))}
            </div>
          </div>
        </div>
        <article id="craft-project-evidence" className="craft-project-evidence" aria-live="polite">
          {media && (
            <figure className="relation-media">
              <Image
                src={media.src}
                width={media.width}
                height={media.height}
                alt={en ? project.title + ' repository screenshot' : media.caption}
              />
              <figcaption>
                {en ? 'Actual interface · repository demonstration content' : media.caption} ·{' '}
                <a href={media.sourceUrl} target="_blank" rel="noreferrer">
                  {en ? 'Source' : '截图来源'} ↗
                </a>
              </figcaption>
            </figure>
          )}
          {project.slug === 'commerce-video-agent' && project.process?.length && (
            <figure className="relation-workflow">
              <figcaption>
                {en ? 'Documented workflow · n8n / ComfyUI' : '项目文档中的工作流 · n8n / ComfyUI'}
              </figcaption>
              <ol>
                {project.process.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </figure>
          )}
          {project.slug === 'portfolio' && (
            <figure className="relation-media">
              <Image
                src="/assets/projects/portfolio-skills-v11.webp"
                width={1200}
                height={750}
                alt={
                  en
                    ? 'Actual Skills Galaxy running on the Links portfolio'
                    : 'Links Portfolio 实际运行中的技能星系'
                }
              />
              <figcaption>
                <Link href="/#skills">{en ? 'Try the Skills Galaxy' : '打开技能星系'} ↗</Link>
              </figcaption>
            </figure>
          )}
          <h3>{project.title}</h3>
          <p>{project.description}</p>
          <p>{project.responsibility}</p>
          {!media && project.slug !== 'portfolio' && project.slug !== 'commerce-video-agent' && (
            <p className="note">
              {en
                ? 'No approved interface screenshot for this record; the project documentation is the evidence.'
                : '此档案暂无可公开界面截图，以项目文档与记录作为依据。'}
            </p>
          )}
          <small>
            {project.stage} · {project.evidence}
          </small>
          <Link href={project.link ?? '/projects#' + project.slug}>
            {en ? 'Project record' : '项目记录'} ↗
          </Link>
        </article>
      </div>
      <HowItWorks>
        <p>
          {en
            ? 'The graph connects tools to existing project records. Selecting either end updates the same focus state; the project description and evidence come from the shared archive. No skill scores or unverified outcomes are inferred.'
            : '两侧节点共用一个聚焦状态，介绍与证据来自现有项目档案。不推断技能分数，也不编造实施成果。方案项目继续标明其阶段。'}
        </p>
        <p>
          {en
            ? 'Native buttons work with keyboard and touch. A small SVG supplies the connecting lines without a graph-editor dependency.'
            : '原生按钮支持键盘与触摸，简单 SVG 提供连线，无需图编辑器依赖。'}
        </p>
      </HowItWorks>
    </section>
  );
}
