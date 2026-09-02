import { useEffect, useState, type ReactNode } from 'react';
import { CircleX, Crown, RotateCcw, WifiOff } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { Alert, AlertDescription, AlertTitle, Button, LoadingState, NodeCard, Spinner, TabBar, Tag } from '@tpvpn/ui';
import { Callout, DoDont, DocTable, Grid, PageHeader, Pill, Preview, Prose, Section, SubSection } from '@/components/docs';
import { EASE_ACCELERATE, EASE_DECELERATE } from '@/lib/motion';
import { HOME_TABS } from './_parts/HomeScreen';

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

type StateKey = 'empty' | 'loading' | 'error' | 'offline';

const STATES: { key: StateKey; zh: string; en: string; icon: ReactNode; title: string; body: string; action: ReactNode; rule: string }[] = [
  {
    key: 'empty',
    zh: '空态',
    en: 'Empty',
    icon: <Crown className="size-12 text-fg-placeholder" strokeWidth={1.5} aria-hidden />,
    title: '订阅后即可使用全部节点',
    body: '当前账号还没有可用套餐',
    action: <Button size="sm">查看套餐</Button>,
    rule: '图标 48px fg.placeholder；只放一个主动作。',
  },
  {
    key: 'loading',
    zh: '加载',
    en: 'Loading',
    icon: <Spinner size={32} />,
    title: '正在加载节点',
    body: '获取节点列表与延迟',
    action: (
      <Button size="sm" variant="ghost">
        取消
      </Button>
    ),
    rule: '首屏优先用骨架屏；操作级用按钮内 spinner。',
  },
  {
    key: 'error',
    zh: '错误',
    en: 'Error',
    icon: <CircleX className="size-12 text-status-error-solid" strokeWidth={1.5} aria-hidden />,
    title: '加载失败',
    body: '网络不太稳定，稍后再试即可',
    action: <Button size="sm">重试</Button>,
    rule: '不显示技术错误码；错误写进日志。',
  },
  {
    key: 'offline',
    zh: '离线',
    en: 'Offline',
    icon: <WifiOff className="size-12 text-status-warning-solid" strokeWidth={1.5} aria-hidden />,
    title: '网络不可用',
    body: '联网后会自动恢复',
    action: (
      <Button size="sm" variant="secondary">
        重试
      </Button>
    ),
    rule: '页面级用 amber banner，自动恢复。',
  },
];

const ERROR_COPY: { scene: string; zh: string; en: string; where: string; action: string }[] = [
  { scene: '离线', zh: '网络不可用', en: 'No internet connection', where: '顶部 banner（warning）', action: '自动恢复；可点「重试」' },
  { scene: '连接失败', zh: '连接失败，请重试', en: "Couldn't connect. Try again.", where: 'Toast（error，3–5 s）', action: '重试' },
  { scene: '连接超时（15 s）', zh: '连接超时，请重试或换个节点', en: 'Connection timed out. Try again or pick another node.', where: 'Toast（error）', action: '重试' },
  { scene: '订阅已过期', zh: '订阅已过期', en: 'Your plan has expired', where: '页面级空态', action: '续期' },
  { scene: '流量已用完', zh: '本周期流量已用完', en: "You've used up this period's data", where: '页面级空态', action: '查看套餐' },
  { scene: '兑换码无效', zh: '兑换码无效或已使用', en: 'This code is invalid or already used', where: '表单内（Input error + caption）', action: '保留输入，修改后重试' },
  { scene: '设备数达上限', zh: '设备数已达上限', en: 'Device limit reached', where: 'Dialog', action: '管理设备' },
  { scene: '登录失效', zh: '登录已过期，请重新登录', en: 'Your session has expired. Sign in again.', where: '页面级', action: '重新登录' },
  { scene: '节点不可用', zh: '该节点暂不可用', en: 'This node is temporarily unavailable', where: '列表内 Tag（neutral）+ Toast', action: '换个节点' },
];

const CODE_CROSSFADE = `import { motion, useReducedMotion } from 'motion/react';
import { LoadingState, NodeCard } from '@tpvpn/ui';

function NodeList({ nodes }: { nodes: Node[] | null }) {
  const reduced = useReducedMotion();
  const ready = nodes !== null;
  return (
    <div className="grid">
      {/* skeleton: exits fast (accelerate, 200ms) */}
      <motion.div
        aria-hidden={ready}
        className="col-start-1 row-start-1 flex flex-col gap-3"
        animate={{ opacity: ready ? 0 : 1 }}
        transition={{ duration: reduced ? 0.15 : 0.2, ease: [0.4, 0, 1, 1] }}
      >
        {[0, 1, 2].map((i) => <LoadingState key={i} variant="skeleton" />)}
      </motion.div>
      {/* content: enters slowly (decelerate, 800ms = duration.slower) */}
      <motion.div
        className="col-start-1 row-start-1 flex flex-col gap-3"
        initial={false}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: reduced ? 0.15 : 0.8, ease: [0, 0, 0.2, 1] }}
      >
        {nodes?.map((n) => <NodeCard key={n.id} flagCode={n.code} title={n.title} latencyMs={n.latencyMs} loadPct={n.loadPct} />)}
      </motion.div>
    </div>
  );
}`;

const DEMO_NODES = [
  { code: 'hk', title: '香港', subtitle: 'HK · Hong Kong #01', latencyMs: 18, loadPct: 32, premium: true },
  { code: 'sg', title: '新加坡', subtitle: 'SG · Singapore #02', latencyMs: 42, loadPct: 45, premium: false },
  { code: 'jp', title: '东京', subtitle: 'JP · Tokyo #01', latencyMs: 56, loadPct: 61, premium: false },
];

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

function MiniScreen({ state }: { state: (typeof STATES)[number] }) {
  return (
    <figure className="flex flex-col overflow-hidden rounded-xl border border-border-default bg-bg-surface shadow-level-1">
      <figcaption className="flex items-center justify-between border-b border-border-subtle px-4 py-2.5">
        <span className="text-sm font-semibold text-fg-primary">
          {state.zh} <span className="font-medium text-fg-muted">{state.en}</span>
        </span>
        <Pill size="sm" tone="outline">
          {state.key}
        </Pill>
      </figcaption>
      <div className="flex min-h-[260px] flex-1 flex-col items-center justify-center bg-bg-canvas px-6 py-10 text-center">
        {state.icon}
        <p className="mt-4 text-title-sm text-fg-primary">{state.title}</p>
        <p className="mt-1 text-body-sm text-fg-secondary">{state.body}</p>
        <div className="mt-5">{state.action}</div>
      </div>
      <div inert aria-hidden>
        <TabBar items={HOME_TABS} active="nodes" onChange={() => {}} />
      </div>
      <p className="border-t border-border-subtle px-4 py-2.5 text-xs leading-5 text-fg-muted">{state.rule}</p>
    </figure>
  );
}

function SkeletonToContent() {
  const [run, setRun] = useState(0);
  const [ready, setReady] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    setReady(false);
    const id = window.setTimeout(() => setReady(true), 1400);
    return () => window.clearTimeout(id);
  }, [run]);

  return (
    <Preview
      label="骨架屏到内容的过渡演示"
      code={CODE_CROSSFADE}
      background="surface"
      toolbar={
        <>
          <Pill tone={ready ? 'success' : 'brand'} size="sm" aria-live="polite">
            {ready ? '内容 · 800 ms decelerate 淡入' : '骨架屏 · 1.4 s 后完成'}
          </Pill>
          <Button variant="ghost" size="sm" onClick={() => setRun((n) => n + 1)}>
            <RotateCcw aria-hidden />
            重播
          </Button>
        </>
      }
    >
      <div className="grid w-full max-w-sm">
        <motion.div
          aria-hidden={ready}
          className="col-start-1 row-start-1 flex flex-col gap-3"
          animate={{ opacity: ready ? 0 : 1 }}
          transition={{ duration: reduced ? 0.15 : 0.2, ease: EASE_ACCELERATE }}
          style={{ pointerEvents: ready ? 'none' : 'auto' }}
        >
          {DEMO_NODES.map((n) => (
            <div key={n.code} className="rounded-lg border border-border-default bg-bg-surface p-4">
              <LoadingState variant="skeleton" label="正在加载节点" />
            </div>
          ))}
        </motion.div>
        <motion.div
          aria-hidden={!ready}
          className="col-start-1 row-start-1 flex flex-col gap-3"
          initial={false}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ duration: reduced ? 0.15 : 0.8, ease: EASE_DECELERATE }}
          style={{ pointerEvents: ready ? 'auto' : 'none' }}
        >
          {DEMO_NODES.map((n) => (
            <NodeCard
              key={n.code}
              flagCode={n.code}
              title={n.title}
              subtitle={n.subtitle}
              badge={n.premium ? <Tag tone="brand">优质节点</Tag> : undefined}
              latencyMs={n.latencyMs}
              loadPct={n.loadPct}
            />
          ))}
        </motion.div>
      </div>
    </Preview>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function StatesPage() {
  return (
    <>
      <PageHeader
        eyebrow="模式 · Patterns"
        title="空态 · 错误 · 加载"
        en="States"
        description="没有内容、正在等待、出了问题、断了网——四种通用状态各有一个图标、一句标题、一行说明和唯一的动作。骨架屏与内容用同一布局，200 ms 淡入淡出。"
      />

      <Section id="overview" title="四种状态" en="Four states" description="每个状态是一个完整的小屏幕：图标 48 → 标题 title-sm → 一行说明 body-sm → 主动作。底部 TabBar 保持可见，用户随时能离开。">
        <Grid cols={2} className="my-6">
          {STATES.map((s) => (
            <MiniScreen key={s.key} state={s} />
          ))}
        </Grid>

        <SubSection title="离线 banner" en="Offline banner" description="页面级离线不替换内容：顶部 amber banner，联网后自动消失。">
          <Preview label="离线 banner 预览" background="canvas">
            <Alert variant="warning" className="max-w-sm">
              <WifiOff aria-hidden />
              <AlertTitle>网络不可用</AlertTitle>
              <AlertDescription>联网后会自动恢复，已连接的会话保持不变。</AlertDescription>
            </Alert>
          </Preview>
        </SubSection>
      </Section>

      <Section id="skeleton" title="骨架屏 → 内容" en="Skeleton to content" description="骨架屏与真实内容布局一致，两层叠放：骨架 200 ms accelerate 淡出，内容 800 ms decelerate 淡入。点「重播」再看一次。">
        <SkeletonToContent />
        <Prose>
          <ul>
            <li>300 ms 内完成的请求不显示骨架，直接出内容，避免闪烁。</li>
            <li>骨架只用于首屏与整块内容；局部刷新用就地更新，操作用按钮内 spinner（20px，文字不变，按钮 disabled）。</li>
            <li>
              成功反馈用 <code>LoadingState variant="success"</code>：check 图标 spring 弹入，600 ms 后自动关闭。
            </li>
            <li>
              <code>prefers-reduced-motion</code> 时两段都退化为 150 ms 淡入淡出。
            </li>
          </ul>
        </Prose>
      </Section>

      <Section id="error-copy" title="错误文案" en="Error copy" description="一句话说清发生了什么，再给一个动作。不责怪用户，不制造焦虑，不出现错误码。">
        <DocTable
          caption="错误文案与推荐动作"
          head={
            <>
              <th>场景</th>
              <th>zh-CN</th>
              <th>en</th>
              <th>呈现</th>
              <th>动作</th>
            </>
          }
        >
          {ERROR_COPY.map((row) => (
            <tr key={row.scene}>
              <td className="text-fg-primary">{row.scene}</td>
              <td className="text-fg-primary">{row.zh}</td>
              <td className="text-fg-secondary">{row.en}</td>
              <td className="text-fg-secondary">{row.where}</td>
              <td>
                <Pill tone="brand" size="sm">
                  {row.action}
                </Pill>
              </td>
            </tr>
          ))}
        </DocTable>
        <Prose>
          <p>
            「网络不可用」「连接失败，请重试」「兑换码无效或已使用」三条与「语调与文案」页的五语言对照表同源；其余条目沿用同一语气：短句、全角标点、不用感叹号。
          </p>
        </Prose>
      </Section>

      <Section id="rules" title="规则" en="Rules">
        <Prose>
          <ul>
            <li>
              <strong>一个状态一个动作。</strong>空态、错误、离线各只放一个按钮；需要第二条路时用文字链接，不用第二个 primary。
            </li>
            <li>
              <strong>不责怪用户。</strong>「网络不太稳定」而不是「您的网络有问题」；「兑换码无效或已使用」而不是「输入错误」。
            </li>
            <li>
              <strong>TabBar 保持可见。</strong>状态只替换内容区，导航不消失；用户永远能切到「我的」或回首页。
            </li>
            <li>
              <strong>200 ms 淡入淡出。</strong>状态切换用 <code>duration.base</code> + <code>easing.standard</code>；进入内容用 decelerate，退出用 accelerate 且更快。
            </li>
            <li>操作级错误用 Toast（3–5 s 自动消失，可手动关闭）；表单错误在提交时校验、输入时清除。</li>
            <li>错误码与堆栈只进日志；界面上最多给一个「复制诊断信息」的次级入口。</li>
          </ul>
        </Prose>

        <DoDont
          doCaption="说事实，给出下一步；语气平静。"
          dontCaption="责怪用户，暴露技术细节，没有可做的事。"
          previewClassName="bg-bg-canvas"
          do={
            <div className="flex flex-col items-center text-center">
              <CircleX className="size-10 text-status-error-solid" strokeWidth={1.5} aria-hidden />
              <p className="mt-3 text-title-sm text-fg-primary">加载失败</p>
              <p className="mt-1 text-body-sm text-fg-secondary">网络不太稳定，稍后再试即可</p>
              <Button size="sm" className="mt-4">
                重试
              </Button>
            </div>
          }
          dont={
            <div className="flex flex-col items-center text-center">
              <CircleX className="size-10 text-status-error-solid" strokeWidth={1.5} aria-hidden />
              <p className="mt-3 text-title-sm text-fg-primary">您的网络有问题！</p>
              <p className="mt-1 text-body-sm text-fg-secondary">HTTP 503 · upstream connect error</p>
            </div>
          }
        />
      </Section>

      <Section id="platform" title="Flutter / iOS 对应" en="Flutter / iOS">
        <Callout title="Flutter / iOS 对应">
          <p>
            <strong>Flutter</strong>：骨架用自绘 Shimmer 或 <code>Container(color: TpTokens.colorSlate100)</code>；状态切换用{' '}
            <code>AnimatedSwitcher(duration: TpTokens.durationBase, switchInCurve: TpTokens.easingDecelerate, switchOutCurve: TpTokens.easingAccelerate)</code>；
            操作级 spinner <code>CircularProgressIndicator(strokeWidth: 2)</code>；离线 banner 用 <code>MaterialBanner</code>。
          </p>
          <p>
            <strong>iOS（SwiftUI）</strong>：骨架 <code>.redacted(reason: .placeholder)</code> + <code>ProgressView</code>；切换{' '}
            <code>withAnimation(.easeOut(duration: TPTokens.durationBase))</code>；成功态 <code>Image(systemName: "checkmark")</code> 配 spring；
            离线用顶部 <code>overlay(alignment: .top)</code>。
          </p>
        </Callout>
      </Section>
    </>
  );
}
