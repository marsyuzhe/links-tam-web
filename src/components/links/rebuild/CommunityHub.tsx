'use client';
import { rememberReadingReturn, useReadingReturn } from './reading-return';
import { WorldGallery } from './WorldGallery';
import { useRef, useState } from 'react';
import { LocaleLink as Link, useLocale } from '../Locale';
import { CommunityShell } from '../community/CommunityShell';
import {
  worlds,
  announcements,
  communityEvents,
  worldScreenshots,
  type WorldId,
} from '@/content/worlds';
import { labels } from '../community/status-labels';
import { useWorldSelection } from '../community/useWorldSelection';
import { useWorldStatus } from '../community/useWorldStatus';
import { gsap, useGSAP, MOTION_OK } from '@/lib/gsap';
export function CommunityHub({ game }: { game?: WorldId }) {
  useReadingReturn(game ?? 'community');
  const { locale } = useLocale(),
    en = locale === 'en',
    n = en ? 1 : 0;
  const { activeWorldId, choose, lane, setLane, notice, setNotice } = useWorldSelection(game);
  const [tab, setTab] = useState('announcements');
  const { statuses, isChecking, refreshServerStatus } = useWorldStatus();
  const root = useRef<HTMLDivElement>(null);
  const world = worlds.find((w) => w.id === activeWorldId)!,
    status = statuses.find((s) => s.id === activeWorldId)!;
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () =>
        gsap.fromTo(
          '.world-stage-art',
          { opacity: 0.35, scale: 0.97 },
          { opacity: 1, scale: 1, duration: 0.5, clearProps: 'all' },
        ),
      );
      return () => mm.revert();
    },
    { scope: root, dependencies: [activeWorldId] },
  );
  const posts = announcements.filter((a) => a.world === activeWorldId && a.state === 'published'),
    events = communityEvents.filter((e) => e.world === activeWorldId && e.state !== 'cancelled'),
    shots = worldScreenshots.filter((s) => s.world === activeWorldId && s.approved);
  return (
    <CommunityShell>
      <div
        ref={root}
        className="community-rebuilt"
        data-detail={Boolean(game)}
        style={{ '--world-accent': world.accent } as React.CSSProperties}
      >
        {game && (
          <Link className="reading-button" href="/community">
            ↖ {en ? 'All worlds' : '返回游戏社区'}
          </Link>
        )}
        {!game && (
          <header className="world-opening">
            <p className="label">Servers & Worlds</p>
            <h1>{en ? 'Worlds we build together.' : '游戏社区'}</h1>
            <p>
              {en
                ? 'Places to explore, build and survive with friends.'
                : '和朋友一起探索、建造与生存的地方。'}
            </p>
          </header>
        )}
        {!game && (
          <div
            className="world-overview"
            role="tablist"
            aria-label={en ? 'Choose world' : '选择游戏'}
          >
            {worlds.map((w) => {
              const s = statuses.find((s) => s.id === w.id)!;
              return (
                <button
                  role="tab"
                  aria-selected={activeWorldId === w.id}
                  style={{ '--tab-accent': w.accent } as React.CSSProperties}
                  key={w.id}
                  onClick={() => choose(w.id)}
                >
                  <span>{w.name}</span>
                  <strong>{w.title[n]}</strong>
                  <span className="world-status" data-status={s.status}>
                    {labels[locale][s.status]}
                    {s.playersOnline !== null && ` · ${s.playersOnline} / ${s.playersMax ?? '—'}`}
                  </span>
                  <small>
                    {en ? 'Version' : '版本'} {s.version ?? '—'}
                  </small>
                </button>
              );
            })}
          </div>
        )}
        <section className="world-feature" aria-label={world.name}>
          <div className="world-stage-art" data-world={activeWorldId} aria-hidden="true">
            <svg viewBox="0 0 700 420" fill="none">
              <path
                d={
                  activeWorldId === 'minecraft'
                    ? 'M50 300 180 230 290 280 420 190 650 300M180 230v-80l110 55v75m0-75 130-75v60m0-60 130 65v90M50 300v35l240 75 360-110'
                    : 'M20 315Q130 190 230 300T440 260T690 310M80 315V210h70v-45h50v125M460 275V145h90v-50h50v200'
                }
              />
              <path d="M0 360h700M80 390h540" />
              <circle
                cx={activeWorldId === 'terraria' ? 350 : 540}
                cy="90"
                r={activeWorldId === 'terraria' ? 45 : 20}
              />
              {activeWorldId === 'project-zomboid' && (
                <path d="M280 320v-90h100v90M285 230l45-45 45 45M600 300l-40-50m20 20 40-45" />
              )}
            </svg>
            <span>
              {en
                ? 'Original concept illustration · Not a server screenshot'
                : '原创概念示意 · 非服务器实景'}
            </span>
          </div>
          <div className="world-feature-copy">
            <p className="label">{world.name}</p>
            {game ? <h1>{world.title[n]}</h1> : <h2>{world.title[n]}</h2>}
            <p>{world.intro[n]}</p>
            <div className="world-live" aria-live="polite">
              <strong
                className="world-status"
                data-status={isChecking ? 'checking' : status.status}
              >
                {isChecking ? labels[locale].checking : labels[locale][status.status]}
              </strong>
              <span>
                {en ? 'Players' : '在线人数'} {status.playersOnline ?? '—'} /{' '}
                {status.playersMax ?? '—'}
              </span>
            </div>
            <dl className="world-facts">
              <dt>{en ? 'Game version' : '游戏版本'}</dt>
              <dd>{status.version ?? '—'}</dd>
              <dt>{activeWorldId === 'terraria' ? 'tModLoader' : en ? 'Loader' : '加载器'}</dt>
              <dd>{status.modloader ?? world.loader ?? '—'}</dd>
              <dt>{en ? 'Pack version' : '整合包版本'}</dt>
              <dd>{world.modpackVersion ?? '—'}</dd>
              <dt>{en ? 'Last checked' : '上次验证'}</dt>
              <dd>{status.checkedAt ?? '—'}</dd>
            </dl>
            <div className="world-actions">
              <button
                className="reading-button"
                disabled={isChecking}
                onClick={refreshServerStatus}
              >
                {en ? 'Check status' : '检查状态'} ↻
              </button>
              {!game && (
                <Link
                  id={`world-enter-${activeWorldId}`}
                  onClick={(e) => {
                    if (!e.metaKey && !e.ctrlKey && !e.shiftKey)
                      rememberReadingReturn('community', e.currentTarget.id);
                  }}
                  className="reading-button"
                  href={'/community/' + activeWorldId}
                >
                  {en ? 'Explore world' : '进入世界'} ↗
                </Link>
              )}
            </div>
          </div>
        </section>
        <section className="world-explorer">
          <div className="rebuild-section-head">
            <h2>
              {activeWorldId === 'minecraft'
                ? en
                  ? 'Mod & Gameplay Explorer'
                  : '模组与玩法'
                : activeWorldId === 'terraria'
                  ? en
                    ? 'Progression Explorer'
                    : '挑战路线'
                  : en
                    ? 'Survival Guide'
                    : '生存与合作'}
            </h2>
            <p>
              {en
                ? 'Planned directions, not live progress.'
                : '规划方向，不代表实时进度或已安装配置。'}
            </p>
          </div>
          <div className="world-lanes">
            <div role="tablist" aria-label={en ? 'Gameplay routes' : '玩法路线'}>
              {world.lanes.map((l, i) => (
                <button key={i} role="tab" aria-selected={lane === i} onClick={() => setLane(i)}>
                  {l.title[n]}
                  <span aria-hidden="true">{l.mods.length || '↗'}</span>
                </button>
              ))}
            </div>
            <article role="tabpanel">
              <h3>{world.lanes[lane].title[n]}</h3>
              <p>{world.lanes[lane].text[n]}</p>
              {world.lanes[lane].mods.map((m) => (
                <details key={m.name} open>
                  <summary>
                    {m.name} ·{' '}
                    {
                      {
                        planned: en ? 'Planned' : '计划加入',
                        enabled: en ? 'Verified enabled' : '已确认启用',
                        compatibility: en ? 'Compatibility testing' : '兼容性待测试',
                        removed: en ? 'Removed' : '已移除',
                      }[m.state]
                    }
                  </summary>
                  <p>{m.purpose[n]}</p>
                  <dl>
                    <dt>{en ? 'Mod version' : '模组版本'}</dt>
                    <dd>{m.version ?? '—'}</dd>
                    <dt>{en ? 'Game version' : '游戏版本'}</dt>
                    <dd>{m.gameVersion ?? '—'}</dd>
                    <dt>{en ? 'Dependencies' : '依赖'}</dt>
                    <dd>
                      {m.dependencies.length
                        ? m.dependencies.join(', ')
                        : en
                          ? 'Not configured'
                          : '尚未配置'}
                    </dd>
                  </dl>
                  <a href={m.source} target="_blank" rel="noreferrer">
                    {en ? 'Upstream project' : '模组来源'} ↗
                  </a>
                </details>
              ))}
              {!world.lanes[lane].mods.length && (
                <p className="note">
                  {en
                    ? 'No verified installed mod list for this route.'
                    : '此方向暂无经核实的已安装模组清单。'}
                </p>
              )}
            </article>
          </div>
        </section>
        <section className="community-bulletin">
          <div className="rebuild-section-head">
            <h2>{en ? 'Around this world.' : '这个世界的近况。'}</h2>
          </div>
          <div
            className="bulletin-tabs"
            role="tablist"
            aria-label={en ? 'Community information' : '社区信息'}
          >
            {['announcements', 'events', 'screenshots', 'join'].map((v, i) => (
              <button role="tab" aria-selected={tab === v} onClick={() => setTab(v)} key={v}>
                {
                  (en
                    ? ['Announcements', 'Events', 'Screenshots', 'Joining']
                    : ['公告', '活动', '游戏截图', '加入指南'])[i]
                }
              </button>
            ))}
          </div>
          <div className="bulletin-panel" role="tabpanel">
            {tab === 'announcements' &&
              (posts.length ? (
                posts.map((p) => (
                  <details key={p.id}>
                    <summary>
                      {p.title[n]} · {p.publishedAt}
                    </summary>
                    <p>{p.body[n]}</p>
                  </details>
                ))
              ) : (
                <>
                  <h3>{en ? 'No public announcements yet.' : '目前还没有公开公告。'}</h3>
                  <p>
                    {en
                      ? 'Launch notices and changes will appear here after confirmation.'
                      : '开服、维护和更新消息将在确认后发布。'}
                  </p>
                </>
              ))}
            {tab === 'events' &&
              (events.length ? (
                events.map((e) => (
                  <details key={e.id}>
                    <summary>
                      {e.title[n]} · {e.startsAt ?? '—'}
                    </summary>
                    <p>{e.rules[n]}</p>
                  </details>
                ))
              ) : (
                <>
                  <h3>
                    {en ? 'The next gathering is still taking shape.' : '下一次相聚，还在酝酿。'}
                  </h3>
                  <p>
                    {en
                      ? 'No dates or registration have been announced.'
                      : '尚未公布活动日期，也未开放报名。'}
                  </p>
                </>
              ))}
            {tab === 'screenshots' && (
              <>
                <h3>
                  {shots.length
                    ? en
                      ? 'Player screenshots'
                      : '玩家截图'
                    : en
                      ? 'Waiting for our own views.'
                      : '等待属于我们的风景。'}
                </h3>
                <p>
                  {!shots.length &&
                    (en
                      ? 'No approved player screenshots are available. The illustration above is concept art.'
                      : '暂无已获准公开的玩家实景。上方线框为原创概念示意，不是游戏截图。')}
                </p>
                <WorldGallery items={shots} en={en} />
              </>
            )}
            {tab === 'join' && (
              <>
                <h3>{en ? 'Not open for joining yet.' : '暂未开放加入。'}</h3>
                <p>
                  {en
                    ? 'Versions, packs, rules and public connection details will be published together before opening.'
                    : '版本、整合包、规则与公开连接方式将在开放前一并发布。'}
                </p>
                <button
                  className="reading-button"
                  disabled={!status.publicJoinEnabled || !status.serverAddress}
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(status.serverAddress!);
                      setNotice(en ? 'Address copied' : '地址已复制');
                    } catch {
                      setNotice(en ? 'Copy unavailable' : '暂时无法复制');
                    }
                  }}
                >
                  {en ? 'Copy public address' : '复制公开地址'}
                </button>
                <p role="status">{notice}</p>
                <p className="note">
                  {en
                    ? 'Public chat and submissions are not connected. No visitor messages are collected.'
                    : '公共留言与投稿尚未接入；本页不收集访客留言。'}
                </p>
              </>
            )}
          </div>
        </section>
      </div>
    </CommunityShell>
  );
}
