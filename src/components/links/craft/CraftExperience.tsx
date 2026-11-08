'use client';
import Image from 'next/image';
import { projectMedia } from '@/content/media';
import { CraftShell } from './CraftShell';
import { useLocale, LocaleLink as Link } from '../Locale';
import { TypographyStudy } from './TypographyStudy';
import { MediaTransition } from './MediaTransition';
import { KeyEngineering } from './KeyEngineering';
import { ProjectRelations } from './ProjectRelations';
import './craft.css';

const workspace = projectMedia.find((media) => media.id === 'manga-workspace')!;

export function CraftExperience() {
  const { locale } = useLocale(),
    en = locale === 'en';
  return (
    <CraftShell>
      <div className="craft-page">
        <header className="craft-opening">
          <p>
            Craft <span>/ {en ? 'The details of making' : '制作细节'}</span>
          </p>
          <h1>
            Made to
            <br />
            <em>Interact.</em>
          </h1>
          <a className="craft-opening-media" href="#craft-media">
            <Image
              src={workspace.src}
              alt={workspace.caption}
              width={workspace.width}
              height={workspace.height}
            />
            <span>
              Links Manga Studio <span>{en ? 'Inspect the transition' : '体验截图转场'} ↘</span>
            </span>
          </a>
          <div className="craft-opening-note">
            <div>
              <p>{en ? 'Some details are better experienced.' : '有些细节，值得亲手试试。'}</p>
              <Link className="craft-replay" href="/?intro=replay">
                {en ? 'Replay the signature entrance' : '重播签名开场'} ↗
              </Link>
            </div>
            <nav aria-label={en ? 'Craft interactions' : 'Craft 互动'}>
              {['type', 'media', 'key', 'connections'].map((id, index) => (
                <a key={id} href={'#craft-' + id}>
                  {
                    (en
                      ? ['Typography', 'Transitions', 'Touch', 'Connections']
                      : ['字形', '转场', '触感', '联系'])[index]
                  }{' '}
                  ↙
                </a>
              ))}
            </nav>
          </div>
        </header>
        <TypographyStudy />
        <MediaTransition />
        <KeyEngineering />
        <ProjectRelations />
        <footer className="craft-outro">
          <p>{en ? 'Keep exploring.' : '继续探索。'}</p>
          <Link className="reading-button" href="/">
            {en ? 'Return to Links Tam official site' : '返回 Links Tam 个人官网'} ↗
          </Link>
        </footer>
      </div>
    </CraftShell>
  );
}
