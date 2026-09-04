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
      <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-4 pt-12 pb-16 sm:px-8 sm:pt-20 lg:grid-cols-[1.15fr_0.85fr] lg:pt-24 lg:pb-24">
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
            className="mt-7 text-[clamp(36px,5.2vw,68px)] leading-[1.2] font-semibold text-fg-primary"
          >
            连接世界，
            <br />
            从清晰开始。
          </motion.h1>
          <motion.p variants={item} lang="en" className="mt-5 text-[18px] leading-7 text-fg-muted sm:text-[22px]">
            Clarity in every connection.
          </motion.p>
          <motion.p variants={item} className="mt-6 max-w-[46ch] text-body-lg text-fg-secondary">
            TP VPN 的统一设计语言。从品牌到每一次连接，让状态一眼可见，让操作自然发生。
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
          <motion.p variants={item} className="mt-8 text-[13px] leading-6 text-fg-muted">
            品牌规范 · 设计基础 · 交互组件 · 多端模式
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
