import Link from 'next/link';
import { notFound } from 'next/navigation';
import { caseProjects } from '@/content/projects';
import { projectMedia } from '@/content/media';
import { ReadingShell, ReturnToWork } from '@/components/links/ReadingShell';
import { MediaGallery } from '@/components/links/MediaGallery';
export function generateStaticParams() {
  return caseProjects.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = caseProjects.find((p) => p.slug === slug);
  return { title: p ? p.title + ' | Links Tam' : '项目未找到', description: p?.description };
}
export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = caseProjects.find((p) => p.slug === slug);
  if (!p) notFound();
  const media = p.media.map((id) => projectMedia.find((m) => m.id === id)!).filter(Boolean);
  return (
    <ReadingShell>
      <div className="case-top">
        <ReturnToWork />
        <Link href="/projects" className="label">
          全部项目档案 ↗
        </Link>
      </div>
      <h1 className="reading-title">{p.title}</h1>
      <p className="reading-lead">{p.description}</p>
      <p className="case-status">{p.status}</p>
      <MediaGallery slug={p.slug} media={media} artwork={p.image} title={p.title} />
      <div className="case-layout">
        <aside>
          <p className="label">主要技术</p>
          <ul>
            {p.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <p className="label mt-8">归属与来源</p>
          <p>{p.ownership}</p>
          <p className="mt-4">
            {p.github ? (
              <a href={p.github} target="_blank" rel="noreferrer">
                查看 GitHub 仓库 ↗
              </a>
            ) : (
              '暂无已确认的公开仓库'
            )}
          </p>
          {p.github && (
            <p className="mt-4">
              <a href={p.github + '/releases'} target="_blank" rel="noreferrer">
                查看发布记录 ↗
              </a>
            </p>
          )}
        </aside>
        <div className="editorial">
          <section>
            <h2>为什么制作</h2>
            <p>{p.why}</p>
          </section>
          <section>
            <h2>我负责的部分</h2>
            <p>{p.responsibility}</p>
          </section>
          <section>
            <h2>工作流与实现方向</h2>
            <ol>
              {p.process?.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          </section>
          <section>
            <h2>资料与验证范围</h2>
            <p>{p.evidence}</p>
            <p className="note">
              媒体来自项目公开仓库；仓库自述的构建、设备测试与效果，并非本轮网站开发重新执行的软件测试。
            </p>
            {!media.length && (
              <p className="note">当前只有原创艺术封面，尚未提供可公开的真实软件截图。</p>
            )}
          </section>
          <section>
            <h2>当前边界</h2>
            <p>{p.boundary}</p>
          </section>
          <Link className="reading-button" href="/projects">
            浏览全部项目 ↗
          </Link>
        </div>
      </div>
    </ReadingShell>
  );
}
