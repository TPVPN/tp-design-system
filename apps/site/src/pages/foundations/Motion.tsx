import { useReducedMotion } from 'motion/react';
import { Callout, DocTable, PageHeader, Pill, Prose, Section } from '@/components/docs';
import { token, tokensByPrefix } from '@/lib/tokens';
import { ConnectionDemo } from './_parts/ConnectionDemo';
import { DurationTable } from './_parts/DurationTable';
import { EasingCurves } from './_parts/EasingCurves';
import { PlatformSnippets } from './_parts/PlatformSnippets';

const RECIPES: { scene: string; props: string; duration: string; easing: string }[] = [
  { scene: '按钮 hover', props: 'background, box-shadow', duration: 'base 200', easing: 'standard' },
  { scene: '按钮按压', props: 'transform scale 0.98', duration: 'fast 100', easing: 'standard' },
  { scene: 'Tooltip', props: 'opacity, translateY 4px', duration: 'quick 150', easing: 'decelerate / accelerate' },
  { scene: 'Dropdown / Popover', props: 'opacity, scale 0.96 → 1', duration: 'base 200', easing: 'emphasized / accelerate' },
  { scene: 'Sheet', props: 'translateY 100% → 0', duration: 'moderate 300', easing: 'emphasized / accelerate 200' },
  { scene: 'Dialog', props: 'opacity + scale 0.96 → 1', duration: 'moderate 300', easing: 'emphasized / accelerate 200' },
  { scene: 'Toast', props: 'translateY -8px + opacity', duration: 'base 200', easing: 'decelerate / accelerate' },
  { scene: '页面切换', props: 'opacity 0 → 1, translateY 12px → 0', duration: 'moderate 300', easing: 'decelerate' },
  { scene: '骨架屏 → 内容', props: 'opacity 交叉淡入', duration: 'slower 800', easing: 'standard' },
  { scene: 'Switch', props: 'translateX', duration: 'base 200', easing: 'spring' },
  { scene: '连接成功', props: 'scale 1 → 1.04 → 1 + glow 出现', duration: 'moderate 300', easing: 'spring' },
];

const EASING_SNIPPETS = [
  {
    id: 'css',
    label: 'CSS',
    lang: 'css',
    code: `.sheet {\n  transition: transform var(--tp-duration-moderate) var(--tp-easing-emphasized); /* 进入 300ms */\n}\n.sheet[data-state='closed'] {\n  transition-duration: var(--tp-duration-base);        /* 退出更快 200ms */\n  transition-timing-function: var(--tp-easing-accelerate);\n}`,
  },
  {
    id: 'tailwind',
    label: 'Tailwind',
    lang: 'tsx',
    code: `<div className="transition-transform duration-(--duration-moderate) ease-emphasized data-[state=closed]:duration-(--duration-base) data-[state=closed]:ease-accelerate">…</div>`,
  },
  {
    id: 'motion',
    label: 'motion/react',
    lang: 'tsx',
    code: `import { motion } from 'motion/react';\n\n<motion.div\n  initial={{ opacity: 0, y: 12 }}\n  animate={{ opacity: 1, y: 0 }}\n  exit={{ opacity: 0, transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } }} // accelerate, 更快\n  transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}                      // decelerate\n/>`,
  },
  {
    id: 'dart',
    label: 'Dart',
    lang: 'dart',
    code: `AnimatedSlide(\n  duration: TpTokens.durationModerate,   // 300ms\n  curve: TpTokens.easingEmphasized,      // Cubic(0.16, 1.0, 0.3, 1.0)\n  offset: open ? Offset.zero : const Offset(0, 1),\n  child: sheet,\n);`,
  },
  {
    id: 'swift',
    label: 'Swift',
    lang: 'swift',
    code: `let e = TPTokens.easingEmphasized // [0.16, 1.0, 0.3, 1.0]\nlet timing = UICubicTimingParameters(controlPoint1: CGPoint(x: e[0], y: e[1]), controlPoint2: CGPoint(x: e[2], y: e[3]))\nlet animator = UIViewPropertyAnimator(duration: TPTokens.durationModerate, timingParameters: timing)\nanimator.addAnimations { sheet.transform = .identity }\nanimator.startAnimation()`,
  },
];

const REDUCED_SNIPPETS = [
  {
    id: 'css',
    label: 'CSS',
    lang: 'css',
    code: `@media (prefers-reduced-motion: reduce) {\n  *, *::before, *::after {\n    transition-duration: var(--tp-duration-quick) !important; /* 150ms */\n    animation: none !important;\n    transform: none !important;\n  }\n}`,
  },
  {
    id: 'react',
    label: 'motion/react',
    lang: 'tsx',
    code: `import { useReducedMotion } from 'motion/react';\n\nconst reduced = useReducedMotion();\n<motion.div\n  initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}\n  animate={{ opacity: 1, y: 0 }}\n  transition={reduced ? { duration: 0.15 } : { duration: 0.3, ease: [0, 0, 0.2, 1] }}\n/>`,
  },
  {
    id: 'dart',
    label: 'Dart',
    lang: 'dart',
    code: `final reduced = MediaQuery.disableAnimationsOf(context);\nAnimatedOpacity(\n  duration: reduced ? TpTokens.durationQuick : TpTokens.durationModerate,\n  opacity: visible ? 1 : 0,\n  child: child,\n);`,
  },
  {
    id: 'swift',
    label: 'Swift',
    lang: 'swift',
    code: `let reduced = UIAccessibility.isReduceMotionEnabled\nUIView.animate(withDuration: reduced ? TPTokens.durationQuick : TPTokens.durationModerate) {\n  view.alpha = 1\n  if !reduced { view.transform = .identity }\n}`,
  },
];

export default function MotionPage() {
  const reduced = useReducedMotion();
  const quick = token('duration.quick');
  const connect = token('duration.connect');
  const easingCount = tokensByPrefix('easing').length;

  return (
    <>
      <PageHeader
        eyebrow="基础 · Foundations"
        title="动效"
        en="Motion"
        description={`8 档时长、${easingCount} 条缓动曲线。动效服务于状态变化，不做装饰；进入用 decelerate / emphasized，退出用 accelerate 且更快；prefers-reduced-motion 时全部退化为 ${quick} 淡入淡出。`}
      />

      <Section id="duration" title="时长" en="Duration" description="点击播放，圆点按该时长从左滑到右（easing.standard）。base 200ms 是站点与 App 的默认过渡。">
        <DurationTable />
      </Section>

      <Section id="easing" title="缓动曲线" en="Easing" description="曲线按 cubic-bezier 实时绘制；点击播放，小球用该 transition-timing-function 移动。">
        <EasingCurves />
        <PlatformSnippets snippets={EASING_SNIPPETS} />
      </Section>

      <Section id="connection" title="连接动画" en="Connection Animation" description={`点击按钮：未连接 → 连接中（外环 ${connect} 旋转弧线 + 内圈呼吸）→ 已连接（connected 渐变 + brand-glow-lg + 2.4s 轻微呼吸）。再次点击断开。`}>
        <ConnectionDemo />
        <Prose>
          <ul>
            <li>
              <strong>connecting</strong>：外环 <code>duration.connect</code>（{connect}）线性无限旋转，内圈 scale 0.9 → 1.04 → 0.9、opacity 0.35 → 0.85 呼吸；<code>aria-busy</code> 置真。
            </li>
            <li>
              <strong>connected</strong>：<code>gradient.connected</code> 径向渐变 + <code>elevation.brand-glow-lg</code>，整体 scale 1 → 1.02 → 1 每 2.4s 一次；<code>role="switch" aria-checked="true"</code>。
            </li>
            <li>
              <strong>reduced motion</strong>：旋转与呼吸全部停止，连接中改为静态蓝环 + 文字「连接中…」。
            </li>
            <li>Flutter：<code>AnimationController(duration: TpTokens.durationConnect)</code> + <code>RotationTransition</code>；iOS：<code>CABasicAnimation(keyPath: "transform.rotation")</code>，<code>duration = TPTokens.durationConnect</code>。</li>
          </ul>
        </Prose>
      </Section>

      <Section id="reduced-motion" title="减弱动态效果" en="Reduced Motion" description="尊重系统设置是硬性要求：所有动效退化为 150ms 淡入淡出，取消位移、缩放、旋转、无限循环与 shimmer。">
        <div className="my-6 flex flex-wrap items-center gap-3 rounded-lg border border-border-default bg-bg-surface px-4 py-3 shadow-level-1" role="status" aria-live="polite">
          <span className="text-sm text-fg-secondary">当前浏览器 prefers-reduced-motion：</span>
          <Pill tone={reduced ? 'warning' : 'success'}>{reduced ? 'reduce · 本页演示已停用位移动画' : 'no-preference · 演示按 token 时长播放'}</Pill>
          <span className="text-[12px] text-fg-muted">在系统「辅助功能」里切换后本指示实时更新。</span>
        </div>
        <Callout tone="info" title="动效原则（BRIEF §2.7）">
          <ol className="list-decimal space-y-1 pl-5">
            <li>
              进入用 <code>decelerate</code> / <code>emphasized</code>，退出用 <code>accelerate</code> 且更快（退出时长 ≈ 进入 × 0.7）。
            </li>
            <li>动效服务于状态变化，不做装饰；同一时间只有一个主动效。</li>
            <li>位移距离小：页面切换淡入 + 上浮 12px；Sheet 从底部滑入；Dialog 缩放 0.96 → 1。</li>
            <li>列表 stagger 每项 30ms，最多 8 项后不再递增。</li>
            <li>
              连接按钮 connecting 态 = 外环 {connect} 呼吸 + 旋转弧线。
            </li>
            <li>
              <code>prefers-reduced-motion: reduce</code> 时全部退化为 {quick} 淡入淡出；连接中改为静态蓝色 + 文字。
            </li>
            <li>无自动播放的闪烁；任何闪烁频率 &lt; 3 Hz；站点曲线演示需手动点击播放。</li>
          </ol>
        </Callout>
        <PlatformSnippets snippets={REDUCED_SNIPPETS} />
      </Section>

      <Section id="recipes" title="常用配方" en="Recipes" description="属性 · 时长 · 缓动的固定搭配；退出总比进入快。">
        <DocTable
          caption="动效配方"
          head={
            <>
              <th>场景</th>
              <th>属性</th>
              <th>时长</th>
              <th>缓动（进入 / 退出）</th>
            </>
          }
        >
          {RECIPES.map((r) => (
            <tr key={r.scene} className="transition-colors hover:bg-bg-surface-hover">
              <td className="font-medium text-fg-primary">{r.scene}</td>
              <td className="font-mono text-[12px] text-fg-secondary">{r.props}</td>
              <td className="font-mono text-[12px] whitespace-nowrap text-fg-secondary tnum">{r.duration}</td>
              <td className="font-mono text-[12px] text-fg-secondary">{r.easing}</td>
            </tr>
          ))}
        </DocTable>
      </Section>
    </>
  );
}
