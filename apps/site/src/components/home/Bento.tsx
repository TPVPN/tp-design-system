import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowUpRight, FileArchive } from 'lucide-react';
import { Button } from '@tpvpn/ui/components/ui/button';
import { brandUrl } from '@/lib/assets';
import { HomeSection } from '@/components/home/HomeSection';
import { cn } from '@/lib/cn';
import { useReveal, VIEWPORT_ONCE } from '@/lib/motion';
import { token, tokensByPrefix } from '@/lib/tokens';

const BLUE_RAMP = tokensByPrefix('color.blue').filter((t) => /^\d+$/.test(t.key));
const HUES = ['blue', 'cyan', 'purple', 'mint', 'pink'] as const;

interface CardProps {
  to: string;
  title: string;
  en: string;
  description: string;
  span: string;
  children: ReactNode;
}

function Card({ to, title, en, description, span, children }: CardProps) {
  const { item } = useReveal();
  return (
    <motion.div variants={item} className={cn('min-w-0', span)}>
      <Link
        to={to}
        className="group flex h-full flex-col overflow-hidden rounded-xl border border-border-default bg-bg-surface transition-[box-shadow,border-color] duration-200 hover:border-blue-300 hover:shadow-level-2"
      >
        <div className="relative flex h-40 items-center justify-center overflow-hidden border-b border-border-subtle bg-bg-canvas px-6">{children}</div>
        <div className="flex flex-1 items-start justify-between gap-4 p-5">
          <div>
            <p className="text-headline text-fg-primary">
              {title}
            </p>
            <p lang="en" className="mt-1 text-[13px] text-fg-muted">{en}</p>
            <p className="mt-1 text-sm leading-6 text-fg-secondary">{description}</p>
          </div>
          <ArrowUpRight
            className="mt-1 size-4 shrink-0 text-fg-placeholder transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-blue-600"
            aria-hidden
          />
        </div>
      </Link>
    </motion.div>
  );
}

const CODE_LINES: { key: string; value: string; kind: 'css' | 'dart' }[] = [
  { key: '--color-bg-canvas', value: '#FAFBFF', kind: 'css' },
  { key: '--color-action-primary-bg', value: '#046BEF', kind: 'css' },
  { key: '--shadow-level-2', value: '0 4px 12px …', kind: 'css' },
  { key: 'TpTokens.colorBlue500', value: 'Color(0xFF1677FF)', kind: 'dart' },
];

export function Bento() {
  const { container } = useReveal({ stagger: 0.07 });
  return (
    <HomeSection
      id="start"
      eyebrow="从这里开始 · Start here"
      title="从品牌到界面。"
      description="品牌、基础 Token、组件与平台交付——每个入口都指向可以直接使用的真实文件与代码。"
    >
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT_ONCE}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-12"
      >
        <Card to="/brand/logo" title="品牌 Logo" en="Logo" description="标识、变体、安全空间与全部下载。" span="lg:col-span-4">
          <img src={brandUrl.logoSvg('horizontal')} alt="TP VPN" className="h-12 w-auto max-w-full" />
        </Card>

        <Card to="/brand/color" title="色彩" en="Color" description="TP Blue #1677FF、五条 11 阶色带与状态色。" span="lg:col-span-5">
          <div className="w-full">
            <div className="flex h-10 w-full overflow-hidden rounded-md shadow-level-1 ring-1 ring-black/5">
              {BLUE_RAMP.map((t) => (
                <span key={t.path} className="flex-1" style={{ background: String(t.value) }} />
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2">
              {HUES.map((h) => (
                <span key={h} className="size-4 rounded-full ring-hairline" style={{ background: token(`color.${h}.500`) }} />
              ))}
              <span className="ml-auto font-mono text-[11px] text-fg-muted">blue · cyan · purple · mint · pink</span>
            </div>
          </div>
        </Card>

        <Card to="/brand/typography" title="字体" en="Typography" description="中英文排版、22 个文字角色与等宽数字。" span="lg:col-span-3">
          <span className="flex items-end gap-4">
            <span className="text-[64px] leading-none font-extrabold tracking-[-0.025em] text-fg-primary">Aa</span>
            <span className="flex flex-col gap-0.5 pb-1 text-[13px] leading-5 text-fg-muted">
              <span className="font-normal">Regular 400</span>
              <span className="font-semibold text-fg-secondary">Semibold 600</span>
              <span className="font-extrabold text-fg-primary">Extrabold 800</span>
            </span>
          </span>
        </Card>

        <Card to="/components" title="组件" en="Components" description="shadcn 基座 + 连接按钮、节点卡片等 VPN 专属组件。" span="lg:col-span-5">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button size="sm" className="pointer-events-none" tabIndex={-1}>
              连接
            </Button>
            <Button size="sm" variant="secondary" className="pointer-events-none" tabIndex={-1}>
              选择节点
            </Button>
            <Button size="sm" variant="outline" className="pointer-events-none" tabIndex={-1}>
              取消
            </Button>
          </div>
        </Card>

        <Card to="/platforms" title="Token 平台" en="Platforms" description="CSS · Tailwind · Dart · Swift · Kotlin · Figma 一键输出。" span="lg:col-span-4">
          <pre className="w-full overflow-hidden font-mono text-[12px] leading-6">
            {CODE_LINES.map((l) => (
              <span key={l.key} className="block truncate">
                <span className="text-fg-secondary">{l.key}</span>
                <span className="text-fg-muted">{l.kind === 'css' ? ': ' : ' = '}</span>
                <span className="text-blue-700">{l.value}</span>
                <span className="text-fg-muted">;</span>
              </span>
            ))}
          </pre>
        </Card>

        <Card to="/downloads" title="下载" en="Downloads" description="品牌全包、Logo、App Icon、Token 与字体。" span="lg:col-span-3">
          <span className="flex flex-col items-center gap-3">
            <span className="flex size-14 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <FileArchive className="size-7" strokeWidth={1.5} aria-hidden />
            </span>
            <span className="rounded-xs bg-bg-surface px-2 py-1 font-mono text-[11px] text-fg-secondary ring-1 ring-border-default">
              tp-vpn-brand-assets-all.zip
            </span>
          </span>
        </Card>
      </motion.div>
    </HomeSection>
  );
}
