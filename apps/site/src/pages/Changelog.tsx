import { Fragment, type ReactNode } from 'react';
import { ExternalLink } from 'lucide-react';
import { SITE } from '@/app/routes';
import { Callout, DocTable, PageHeader, Pill, Prose, Section, type PillTone } from '@/components/docs';
import changelogSource from '../../../../CHANGELOG.md?raw';

/* ------------------------------------------------------------------ */
/* Minimal Keep-a-Changelog parser (headings / lists / inline code, bold, links) */
/* ------------------------------------------------------------------ */

interface ChangeGroup {
  /** e.g. "Added — `docs/`" (raw markdown) */
  heading: string;
  paragraphs: string[];
  items: string[];
}

interface Release {
  version: string;
  date?: string;
  url?: string;
  paragraphs: string[];
  groups: ChangeGroup[];
}

interface Changelog {
  title: string;
  intro: string[];
  releases: Release[];
}

const LINK_DEF = /^\[([^\]]+)\]:\s*(\S+)/;
const RELEASE_HEADING = /^## \[([^\]]+)\](?:\s*-\s*(\d{4}-\d{2}-\d{2}))?/;

function parseChangelog(source: string): Changelog {
  const lines = source.split(/\r?\n/);
  const links: Record<string, string> = {};
  for (const line of lines) {
    const m = LINK_DEF.exec(line);
    if (m) links[m[1]!] = m[2]!;
  }

  const out: Changelog = { title: '', intro: [], releases: [] };
  let release: Release | null = null;
  let group: ChangeGroup | null = null;
  let paragraph: string[] = [];

  const flush = () => {
    if (paragraph.length === 0) return;
    const text = paragraph.join(' ');
    paragraph = [];
    if (group) group.paragraphs.push(text);
    else if (release) release.paragraphs.push(text);
    else out.intro.push(text);
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (LINK_DEF.test(line)) continue;
    if (line.startsWith('# ')) {
      flush();
      out.title = line.slice(2).trim();
      continue;
    }
    const rel = RELEASE_HEADING.exec(line);
    if (rel) {
      flush();
      release = { version: rel[1]!, date: rel[2], url: links[rel[1]!], paragraphs: [], groups: [] };
      out.releases.push(release);
      group = null;
      continue;
    }
    if (line.startsWith('### ')) {
      flush();
      group = { heading: line.slice(4).trim(), paragraphs: [], items: [] };
      release?.groups.push(group);
      continue;
    }
    if (/^[-*] /.test(line)) {
      flush();
      const item = line.slice(2).trim();
      if (group) group.items.push(item);
      else if (release) {
        group = { heading: '', paragraphs: [], items: [item] };
        release.groups.push(group);
      } else out.intro.push(item);
      continue;
    }
    if (line.trim() === '') {
      flush();
      continue;
    }
    paragraph.push(line.trim());
  }
  flush();
  return out;
}

const INLINE = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
const LINK = /^\[([^\]]+)\]\(([^)]+)\)$/;

function renderInline(text: string): ReactNode[] {
  return text
    .split(INLINE)
    .filter(Boolean)
    .map((part, i) => {
      if (part.startsWith('`') && part.endsWith('`')) return <code key={i}>{part.slice(1, -1)}</code>;
      if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
      const link = LINK.exec(part);
      if (link) {
        return (
          <a key={i} href={link[2]} target="_blank" rel="noreferrer">
            {link[1]}
          </a>
        );
      }
      return <Fragment key={i}>{part}</Fragment>;
    });
}

const CHANGE_TYPES: Record<string, { zh: string; tone: PillTone }> = {
  Added: { zh: '新增', tone: 'success' },
  Changed: { zh: '变更', tone: 'brand' },
  Deprecated: { zh: '废弃', tone: 'warning' },
  Removed: { zh: '移除', tone: 'error' },
  Fixed: { zh: '修复', tone: 'brand' },
  Security: { zh: '安全', tone: 'error' },
};

function splitHeading(heading: string): { type?: { key: string; zh: string; tone: PillTone }; rest: string } {
  const m = /^(\w+)\s*(?:[—–-]+\s*(.*))?$/.exec(heading);
  const key = m?.[1];
  if (key && CHANGE_TYPES[key]) return { type: { key, ...CHANGE_TYPES[key] }, rest: m?.[2] ?? '' };
  return { rest: heading };
}

const POLICY: [string, string][] = [
  ['major', '删除 / 重命名任一 semantic 或 component token；改变 token 类型；Logo 构成或品牌蓝值变化；组件 props 破坏性变更'],
  ['minor', '新增 token、新增输出格式、新组件、新变体、新资产'],
  ['patch', '数值微调且不改契约（阴影透明度、动效时长 ±50 ms、文档修订、构建修复）'],
];

const CHANGELOG = parseChangelog(changelogSource);
const RELEASE_URL_FALLBACK = `${SITE.github}/tp-design-system/blob/main/CHANGELOG.md`;

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

function ReleaseSection({ release, latest }: { release: Release; latest: boolean }) {
  const unreleased = release.version.toLowerCase() === 'unreleased';
  const id = unreleased ? 'unreleased' : `v${release.version.replace(/\./g, '-')}`;
  const empty = release.paragraphs.length === 0 && release.groups.length === 0;

  return (
    <Section id={id} title={unreleased ? 'Unreleased' : `v${release.version}`} en={release.date}>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {unreleased ? (
          <Pill tone="outline">尚未发布</Pill>
        ) : (
          <Pill tone={latest ? 'brand' : 'neutral'}>{latest ? '最新版本' : '历史版本'}</Pill>
        )}
        {release.date && (
          <Pill tone="outline" size="md">
            {release.date}
          </Pill>
        )}
        <a
          href={release.url ?? RELEASE_URL_FALLBACK}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-xs text-fg-link underline-offset-2 hover:underline"
        >
          {unreleased ? '与 main 的差异' : 'GitHub Release'}
          <ExternalLink className="size-3" aria-hidden />
        </a>
      </div>

      {empty && <p className="text-sm text-fg-muted">暂无变更。</p>}

      {release.paragraphs.length > 0 && (
        <Prose className="mb-6">
          {release.paragraphs.map((p, i) => (
            <p key={i}>{renderInline(p)}</p>
          ))}
        </Prose>
      )}

      {release.groups.map((group, gi) => {
        const { type, rest } = splitHeading(group.heading);
        return (
          <div key={gi} className="mb-6 rounded-lg border border-border-default bg-bg-surface p-5 shadow-level-1">
            {group.heading && (
              <p className="mb-3 flex flex-wrap items-center gap-2 text-headline text-fg-primary">
                {type ? (
                  <>
                    <Pill tone={type.tone} size="sm">
                      {type.zh} {type.key}
                    </Pill>
                    {rest && <span>{renderInline(rest)}</span>}
                  </>
                ) : (
                  <span>{renderInline(group.heading)}</span>
                )}
              </p>
            )}
            <Prose>
              {group.paragraphs.map((p, i) => (
                <p key={i}>{renderInline(p)}</p>
              ))}
              {group.items.length > 0 && (
                <ul>
                  {group.items.map((item, i) => (
                    <li key={i}>{renderInline(item)}</li>
                  ))}
                </ul>
              )}
            </Prose>
          </div>
        );
      })}
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function ChangelogPage() {
  const published = CHANGELOG.releases.filter((r) => r.version.toLowerCase() !== 'unreleased');
  const latest = published[0];

  return (
    <>
      <PageHeader
        eyebrow="更新 · Updates"
        title="更新日志"
        en="Changelog"
        description={CHANGELOG.intro[0] ? <span>{renderInline(CHANGELOG.intro[0])}</span> : undefined}
        actions={
          <>
            <Pill tone="brand" size="md">
              当前版本 v{SITE.version}
            </Pill>
            <Pill tone="outline" size="md">
              {published.length} 个已发布版本
            </Pill>
            {latest?.date && (
              <Pill tone="outline" size="md">
                最近更新 {latest.date}
              </Pill>
            )}
          </>
        }
      />

      {CHANGELOG.intro.slice(1).length > 0 && (
        <Prose className="mb-12 text-sm text-fg-muted">
          {CHANGELOG.intro.slice(1).map((p, i) => (
            <p key={i}>{renderInline(p)}</p>
          ))}
        </Prose>
      )}

      <Section id="policy" title="版本策略" en="Versioning policy" description="整个仓库共用一个语义化版本号（tag v<major>.<minor>.<patch>）；token 是公开 API。">
        <Callout title="Token 就是 API">
          删除或重命名任一 semantic / component token 即为破坏性变更。废弃时旧名与新名同时存在一个 minor 版本（≥ 4 周），旧名值指向新名并在 <code>$description</code> 标注 <code>DEPRECATED:</code>；
          CHANGELOG 的 Deprecated 段列出映射表，站点 token 表以「已废弃」标记；下一个 major 才移除并写入 Removed 段。组件 props 废弃同理：<code>@deprecated</code> JSDoc + 运行时不报错 + 一个 minor 过渡。
        </Callout>
        <DocTable
          caption="版本级别判定"
          head={
            <>
              <th className="w-24">级别</th>
              <th>变更</th>
            </>
          }
        >
          {POLICY.map(([level, rule]) => (
            <tr key={level}>
              <td>
                <Pill tone={level === 'major' ? 'error' : level === 'minor' ? 'brand' : 'neutral'}>{level}</Pill>
              </td>
              <td className="text-fg-secondary">{rule}</td>
            </tr>
          ))}
        </DocTable>
        <Prose>
          <p>
            primitives 层不是公开 API，但删除会连带影响引用，按 semantic 规则处理。发布清单：<code>pnpm build</code> 与 <code>pnpm typecheck</code> 零错误 → CHANGELOG 定版并标日期 → 根与四个包的 <code>version</code> 同步 → 打 tag 并附下载包 → 通知各平台负责人升级。
          </p>
        </Prose>
      </Section>

      {CHANGELOG.releases.map((release) => (
        <ReleaseSection key={release.version} release={release} latest={release === latest} />
      ))}
    </>
  );
}
