import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight, Globe, Layers, PenTool, Smartphone, TabletSmartphone, type LucideIcon } from 'lucide-react';
import { HomeSection } from '@/components/home/HomeSection';
import { useReveal, VIEWPORT_ONCE } from '@/lib/motion';

const PLATFORMS: { icon: LucideIcon; name: string; sub: string }[] = [
  { icon: Globe, name: 'Web', sub: 'CSS 变量 · Tailwind v4' },
  { icon: Layers, name: 'Flutter', sub: 'Dart TpTokens' },
  { icon: Smartphone, name: 'iOS', sub: 'Swift TPTokens' },
  { icon: TabletSmartphone, name: 'Android', sub: 'Kotlin · XML' },
  { icon: PenTool, name: 'Figma', sub: 'Tokens Studio' },
];

export function PlatformStrip() {
  const { container, item } = useReveal({ stagger: 0.06 });
  return (
    <HomeSection
      id="platforms"
      eyebrow="平台覆盖 · Platform coverage"
      title="一份源，五个平台。"
      description="Token 以 W3C DTCG 格式维护，由 Style Dictionary 编译为每个平台的原生格式并随版本一起发布。"
      aside={
        <Link to="/platforms" className="inline-flex items-center gap-1.5 text-sm font-medium text-fg-brand transition-colors hover:text-fg-link-hover">
          查看接入指南
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      }
    >
      <motion.ul
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT_ONCE}
        className="grid overflow-hidden rounded-xl border border-border-default bg-bg-surface shadow-level-1 sm:grid-cols-3 lg:grid-cols-5"
      >
        {PLATFORMS.map(({ icon: Icon, name, sub }) => (
          <motion.li
            key={name}
            variants={item}
            className="flex items-center gap-4 border-b border-border-subtle px-6 py-5 last:border-b-0 sm:border-r sm:[&:nth-child(3n)]:border-r-0 lg:border-b-0 lg:[&:nth-child(3n)]:border-r lg:last:border-r-0"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-bg-surface-sunken text-fg-secondary">
              <Icon className="size-5" strokeWidth={1.75} aria-hidden />
            </span>
            <span>
              <span className="block text-headline text-fg-primary">{name}</span>
              <span className="block text-xs text-fg-muted">{sub}</span>
            </span>
          </motion.li>
        ))}
      </motion.ul>
    </HomeSection>
  );
}
