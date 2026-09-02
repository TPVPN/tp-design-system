import { motion } from 'motion/react';
import { Eye, Grid2x2, ShieldCheck, Zap, type LucideIcon } from 'lucide-react';
import { useReveal, VIEWPORT_ONCE } from '@/lib/motion';

const PRINCIPLES: { icon: LucideIcon; title: string; en: string; text: string }[] = [
  { icon: ShieldCheck, title: '可信', en: 'Trustworthy', text: '每一个状态都诚实可见：已连接就是已连接，出错就说清楚。' },
  { icon: Eye, title: '清晰', en: 'Clear', text: '一标题一句话，单一品牌蓝作为唯一强调，信息层级一眼可辨。' },
  { icon: Zap, title: '轻快', en: 'Light', text: '200ms 标准过渡与克制的动效，让连接的过程本身令人安心。' },
  { icon: Grid2x2, title: '一致', en: 'Consistent', text: '同一套 token 驱动 iOS、Android、Web 与 Figma，不做第二套定义。' },
];

export function Principles() {
  const { container, item } = useReveal({ stagger: 0.08 });
  return (
    <section aria-label="设计原则" className="border-y border-border-subtle bg-bg-surface">
      <motion.ul
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT_ONCE}
        className="mx-auto grid max-w-[1200px] gap-x-8 gap-y-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:py-16"
      >
        {PRINCIPLES.map(({ icon: Icon, title, en, text }) => (
          <motion.li key={en} variants={item} className="flex gap-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600">
              <Icon className="size-5" strokeWidth={1.75} aria-hidden />
            </span>
            <div>
              <p className="text-headline text-fg-primary">
                {title} <span className="font-medium text-fg-muted">{en}</span>
              </p>
              <p className="mt-1.5 text-sm leading-6 text-fg-secondary">{text}</p>
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
