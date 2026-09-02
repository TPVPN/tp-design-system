import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight, Download } from 'lucide-react';
import { SITE } from '@/app/routes';
import { ButtonLink, Pill } from '@/components/docs';
import { PhoneMock } from '@/components/home/PhoneMock';
import { useReveal } from '@/lib/motion';

export function Hero() {
  const { container, item, single, reduced } = useReveal({ stagger: 0.09, delay: 0.1 });
  return (
    <section className="relative overflow-hidden" aria-labelledby="hero-title">
      <div className="hero-glow absolute inset-0 -z-10" aria-hidden />
      <div className="hero-grid absolute inset-0 -z-10" aria-hidden />
      <div className="mx-auto grid max-w-[1200px] items-center gap-14 px-6 pt-16 pb-20 lg:grid-cols-[1.15fr_0.85fr] lg:pt-24 lg:pb-28">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div variants={item} className="flex items-center gap-3">
            <Pill tone="brand">v{SITE.version}</Pill>
            <Link to="/changelog" className="text-sm text-fg-muted transition-colors hover:text-fg-primary">
              查看更新日志 →
            </Link>
          </motion.div>
          <motion.h1
            variants={item}
            id="hero-title"
            className="mt-6 text-display-md text-fg-primary sm:text-display-lg lg:text-display-xl xl:text-display-2xl"
          >
            为可信连接
            <br className="hidden lg:block" />
            而设计。
          </motion.h1>
          <motion.p variants={item} className="mt-4 text-title-md font-medium text-fg-muted sm:text-title-lg">
            The TP VPN Design System
          </motion.p>
          <motion.p variants={item} className="mt-6 max-w-[46ch] text-body-lg text-fg-secondary">
            一套跨 iOS、Android、Web 与 Figma 的品牌、Token、组件与资产体系——用同一种语言，构建每一次连接。
          </motion.p>
          <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-3">
            <ButtonLink to="/brand/logo" size="lg">
              开始使用
              <ArrowRight aria-hidden />
            </ButtonLink>
            <ButtonLink to="/downloads" variant="outline" size="lg">
              <Download aria-hidden />
              下载资产
            </ButtonLink>
          </motion.div>
          <motion.p variants={item} className="mt-8 text-xs text-fg-muted">
            Light mode only · Tailwind v4 token · React 19 组件 · Flutter / Swift / Kotlin 输出
          </motion.p>
        </motion.div>

        <motion.div
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...single, delay: reduced ? 0 : 0.3 }}
          className="flex justify-center lg:justify-end lg:pr-6"
        >
          <PhoneMock />
        </motion.div>
      </div>
    </section>
  );
}
