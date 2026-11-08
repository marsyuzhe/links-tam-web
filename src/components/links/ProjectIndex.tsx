'use client';
import Image from 'next/image';
import { projectMedia } from '@/content/media';
import { startProjectFlight } from './project-flight';
import { rememberReadingReturn, useReadingReturn } from './rebuild/reading-return';
import { LocaleLink as Link, useLocale } from './Locale';
import { getProjects } from '@/content/projects-en';
import { useState } from 'react';
import { projectCategories } from '@/content/projects';
export function ProjectIndex() {
  useReadingReturn('projects');
  const { locale } = useLocale();
  const en = locale === 'en';
  const projectArchive = getProjects(locale).filter((p) => p.slug !== 'community-worlds');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [stage, setStage] = useState('All');
  const filtered = projectArchive.filter(
    (p) =>
      (category === 'All' || p.category === category) &&
      (stage === 'All' || p.stage === stage) &&
      `${p.title} ${p.description} ${p.tags.join(' ')} ${p.ownership}`
        .toLowerCase()
        .includes(query.toLowerCase().trim()),
  );
  return (
    <>
      <div className="archive-controls">
        <label>
          {en ? 'Search projects' : '搜索项目'}
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={en ? 'Name, tool or direction' : '名称、工具或方向'}
          />
        </label>
        <label>
          {en ? 'Stage' : '阶段'}
          <select value={stage} onChange={(e) => setStage(e.target.value)}>
            <option value="All">{en ? 'All stages' : '全部阶段'}</option>
            {[...new Set(projectArchive.map((p) => p.stage))].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="archive-categories" aria-label="项目分类">
        <button aria-pressed={category === 'All'} onClick={() => setCategory('All')}>
          {en ? 'All' : '全部'}
        </button>
        {projectCategories.map((c) => (
          <button key={c} aria-pressed={category === c} onClick={() => setCategory(c)}>
            {c}
          </button>
        ))}
      </div>
      <p className="archive-count" role="status">
        {filtered.length} / {projectArchive.length}{' '}
        {en
          ? 'records · Modules and concepts are identified separately'
          : '条档案 · 子项目与构想分别标注'}
      </p>
      <div className="archive-list">
        {filtered.map((p) => {
          const preview = p.featured
            ? projectMedia.find((media) => media.id === p.media[0])
            : undefined;
          const fly = (event: React.MouseEvent) => {
            if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
              return;
            rememberReadingReturn('projects', event.currentTarget.id);
            startProjectFlight(event, p.slug);
          };
          return (
            <article
              id={p.slug}
              key={p.slug}
              className={`archive-item ${p.featured ? 'archive-featured' : ''}`}
            >
              <div className="archive-meta">
                <span>{p.category}</span>
                <span>{p.stage}</span>
              </div>
              <div>
                <h2>
                  {p.link ? (
                    <Link id={`archive-title-${p.slug}`} href={p.link} onClick={fly}>
                      {p.title} ↗
                    </Link>
                  ) : (
                    p.title
                  )}
                </h2>
                <p>{p.description}</p>
                <details>
                  <summary>{en ? 'Contribution, sources & scope' : '贡献、来源与当前边界'}</summary>
                  <dl>
                    <dt>{en ? 'Ownership' : '归属'}</dt>
                    <dd>
                      {p.ownership}
                      {p.fork ? ' · Fork' : ''}
                    </dd>
                    <dt>{en ? 'My contribution' : '我的部分'}</dt>
                    <dd>{p.responsibility}</dd>
                    <dt>{en ? 'Sources' : '资料'}</dt>
                    <dd>{p.evidence}</dd>
                    <dt>{en ? 'Current scope' : '当前边界'}</dt>
                    <dd>{p.boundary}</dd>
                  </dl>
                </details>
              </div>
              <div className="archive-links">
                {p.link && preview && (
                  <Link
                    id={`archive-media-${p.slug}`}
                    className="archive-preview"
                    href={p.link}
                    onClick={fly}
                  >
                    <Image
                      src={preview.src}
                      width={preview.width}
                      height={preview.height}
                      alt={preview.caption}
                    />
                  </Link>
                )}
                {p.link && (
                  <Link id={`archive-case-${p.slug}`} href={p.link} onClick={fly}>
                    {en ? 'Read case ↗' : '查看案例 ↗'}
                  </Link>
                )}
                {p.github && (
                  <a href={p.github} target="_blank" rel="noreferrer">
                    {p.fork ? (en ? 'Upstream fork' : '上游 Fork') : 'GitHub'} ↗
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </div>
      {!filtered.length && (
        <p className="archive-empty">
          {en
            ? 'No matching projects. Try another keyword or stage.'
            : '没有匹配的档案。试试其他关键词或阶段。'}
        </p>
      )}
    </>
  );
}
