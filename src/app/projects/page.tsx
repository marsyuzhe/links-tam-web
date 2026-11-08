import { ReadingShell } from '@/components/links/ReadingShell';
import { ProjectIndex } from '@/components/links/ProjectIndex';
export const metadata = {
  title: '项目档案 | Links Tam',
  description: '软件、自动化、创意、游戏与客户项目档案，按来源和完成阶段整理。',
};
export default function Projects() {
  return (
    <ReadingShell>
      <p className="label">WORK ARCHIVE</p>
      <h1 className="reading-title">
        做过的，
        <br />
        正在做的。
      </h1>
      <p className="reading-lead">
        从可使用的软件到尚在酝酿的想法。这里保留每个项目的阶段、来源与我参与的部分。
      </p>
      <ProjectIndex />
    </ReadingShell>
  );
}
